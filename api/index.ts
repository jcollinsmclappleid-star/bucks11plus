import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApp } = require("../dist/vercel-app.cjs") as {
  createApp: () => Promise<{ app: import("express").Express }>;
};

const { app } = await createApp();

export default app;
