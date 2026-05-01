import { createRoot } from "react-dom/client";
import App from "./App";
import { DonateFloat } from "./components/donate-float";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Donate button lives in index.html with position:fixed inline style
createRoot(document.getElementById("donate-root")!).render(<DonateFloat />);
