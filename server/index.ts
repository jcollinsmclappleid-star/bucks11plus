import os from "os";
import { startNurtureProcessor } from "./leadMagnet";
import { createHttpServer, log } from "./createApp";
import { runEmailTriggers } from "./email";
import { runRetentionSweep } from "./retention";

const isVercel = process.env.VERCEL === "1";

(async () => {
  const { httpServer } = await createHttpServer();

  if (!isVercel) {
    startNurtureProcessor();

    const SIX_HOURS = 6 * 60 * 60 * 1000;
    setTimeout(() => {
      runEmailTriggers().catch((err) => console.error("Email trigger error:", err));
      setInterval(() => {
        runEmailTriggers().catch((err) => console.error("Email trigger error:", err));
      }, SIX_HOURS);
    }, 5 * 60 * 1000);

    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    setTimeout(() => {
      runRetentionSweep().catch((err) => console.error("Retention sweep error:", err));
      setInterval(() => {
        runRetentionSweep().catch((err) => console.error("Retention sweep error:", err));
      }, ONE_WEEK);
    }, 10 * 60 * 1000);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: os.platform() === "linux",
    },
    () => {
      log(`serving on port ${port}`);
      log(`open http://localhost:${port}`, "dev");
    },
  );
})();
