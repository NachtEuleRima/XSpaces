import { createRoot } from "react-dom/client";
import App from "./App";
import { DonateFloat } from "./components/donate-float";
import "./index.css";

// Track modal open state globally so DonateFloat (separate root) knows on mount
window.addEventListener("xcoms:auth-open", () => { (window as any).__xcomsModalOpen = true; });
window.addEventListener("xcoms:auth-close", () => { (window as any).__xcomsModalOpen = false; });

createRoot(document.getElementById("root")!).render(<App />);

// Donate button lives in index.html with position:fixed inline style
createRoot(document.getElementById("donate-root")!).render(<DonateFloat />);
