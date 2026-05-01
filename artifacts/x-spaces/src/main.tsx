import { createRoot } from "react-dom/client";
import App from "./App";
import { FeedbackFloat } from "./components/feedback-float";
import { DonateFloat } from "./components/donate-float";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// These divs already exist in index.html with position:fixed inline styles.
// React just mounts the visual content into them.
createRoot(document.getElementById("feedback-root")!).render(<FeedbackFloat />);
createRoot(document.getElementById("donate-root")!).render(<DonateFloat />);
