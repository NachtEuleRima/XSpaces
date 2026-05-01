import { createRoot } from "react-dom/client";
import App from "./App";
import { FeedbackFloat } from "./components/feedback-float";
import { DonateFloat } from "./components/donate-float";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

function makeFloatHost(id: string): HTMLDivElement {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  return el;
}

createRoot(makeFloatHost("feedback-root")).render(<FeedbackFloat />);
createRoot(makeFloatHost("donate-root")).render(<DonateFloat />);
