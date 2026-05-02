import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { pool } from "./db";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import type { User } from "@shared/schema";
import { sendPasswordResetEmail, sendEmailVerificationEmail } from "./email";

// Per-account login throttle. The IP-based authLimiter blocks brute force
// from a single source; this in-memory map prevents distributed brute force
// from grinding away at one specific account by rotating IPs. Lockout is only
// applied to USERNAMES THAT ACTUALLY EXIST so an attacker cannot DoS arbitrary
// accounts by spamming wrong-password attempts at made-up usernames.
const failedLogins = new Map<string, { fails: number; lockedUntil: number }>();
const MAX_LOGIN_FAILS = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000;

function loginLockRemaining(username: string): number {
  const entry = failedLogins.get(username);
  if (!entry) return 0;
  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) {
    failedLogins.delete(username);
    return 0;
  }
  return remaining;
}

function recordFailedLogin(username: string) {
  const entry = failedLogins.get(username) ?? { fails: 0, lockedUntil: 0 };
  entry.fails += 1;
  if (entry.fails >= MAX_LOGIN_FAILS) {
    entry.lockedUntil = Date.now() + LOGIN_LOCK_MS;
    entry.fails = 0;
  }
  failedLogins.set(username, entry);
}

function clearFailedLogins(username: string) {
  failedLogins.delete(username);
}

// Rate limiter for auth endpoints — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  skip: () => process.env.NODE_ENV === "test",
});

// Password strength: min 8 chars, at least one letter and one number
function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashedPassword, salt] = stored.split(".");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

declare global {
  namespace Express {
    interface User extends import("@shared/schema").User {}
  }
}

export function setupAuth(app: Express) {
  const PgStore = ConnectPgSimple(session);

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable must be set");
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
    store: new PgStore({
      pool,
      createTableIfMissing: true,
    }),
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const lockedRemainingMs = loginLockRemaining(username);
        if (lockedRemainingMs > 0) {
          const minutes = Math.max(1, Math.ceil(lockedRemainingMs / 60000));
          return done(null, false, {
            message: `Account temporarily locked due to too many failed sign-in attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or reset your password.`,
          });
        }
        const user = await storage.getUserByUsername(username);
        if (!user) {
          // Do NOT increment failure counter for non-existent usernames —
          // otherwise an attacker could lock arbitrary accounts they don't own.
          return done(null, false, { message: "Invalid username or password" });
        }
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          recordFailedLogin(username);
          return done(null, false, { message: "Invalid username or password" });
        }
        clearFailedLogins(username);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/auth/register", authLimiter, async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const pwError = validatePasswordStrength(password);
      if (pwError) return res.status(400).json({ message: pwError });

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ username, password: hashedPassword });

      // Stamp last-login on creation so the retention sweep starts the clock from sign-up
      db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))
        .catch((e) => console.error("[Auth] Failed to stamp lastLoginAt on register:", e));

      // Send email verification (fire-and-forget, never block signup on email delivery)
      sendEmailVerificationEmail(user.id, username).catch((e) =>
        console.error("[Auth] Failed to send verification email:", e),
      );

      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...safeUser } = user;
        return res.status(201).json(safeUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", authLimiter, (req, res, next) => {
    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      // Stamp last-login asynchronously so the retention sweep has a fresh signal,
      // and clear any retention-warning stamp so the next dormancy cycle starts fresh.
      db.update(users)
        .set({ lastLoginAt: new Date(), retentionWarningSentAt: null })
        .where(eq(users.id, user.id))
        .catch((e) => console.error("[Auth] Failed to stamp lastLoginAt on login:", e));

      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...safeUser } = user;
        return res.json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password: _, ...safeUser } = req.user!;
    res.json(safeUser);
  });

  app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const results = await db.select().from(users).where(
        eq(users.username, normalizedEmail)
      );
      let user = results[0];
      if (!user) {
        const byEmail = await db.select().from(users).where(eq(users.email, normalizedEmail));
        user = byEmail[0];
      }

      if (user) {
        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await db.update(users)
          .set({ passwordResetToken: token, passwordResetExpires: expires })
          .where(eq(users.id, user.id));

        await sendPasswordResetEmail(email.toLowerCase().trim(), token);
      }

      res.json({ message: "If an account with that email exists, we've sent a password reset link." });
    } catch (err) {
      console.error("[Auth] Forgot password error:", err);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  });

  app.post("/api/auth/reset-password", authLimiter, async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      const pwError = validatePasswordStrength(password);
      if (pwError) return res.status(400).json({ message: pwError });

      const [user] = await db.select().from(users).where(
        and(
          eq(users.passwordResetToken, token),
          gt(users.passwordResetExpires, new Date())
        )
      );

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
      }

      const hashedPassword = await hashPassword(password);
      await db.update(users)
        .set({
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        })
        .where(eq(users.id, user.id));

      res.json({ message: "Password updated successfully. You can now sign in." });
    } catch (err) {
      console.error("[Auth] Reset password error:", err);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  });
}

export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.user?.subscriptionExpiresAt && req.user.subscriptionTier !== 'free') {
    const expiresAt = new Date(req.user.subscriptionExpiresAt);
    if (expiresAt < new Date()) {
      req.user.subscriptionTier = 'free';
      storage.updateUserSubscription(req.user.id, 'free', null).catch(() => {});
    }
  }
  next();
}
