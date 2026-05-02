import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Self-hosted fonts (replaces fonts.googleapis.com to avoid sending visitor
// IP addresses to Google before consent — UK GDPR / PECR requirement).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/libre-baskerville/400-italic.css";

createRoot(document.getElementById("root")!).render(<App />);
