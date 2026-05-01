import { createRoot } from "react-dom/client";
import App from "./App";
import { FeedbackFloat } from "./components/feedback-float";
import { DonateFloat } from "./components/donate-float";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const feedbackEl = document.createElement("div");
feedbackEl.id = "feedback-root";
document.body.appendChild(feedbackEl);
createRoot(feedbackEl).render(<FeedbackFloat />);

const donateEl = document.createElement("div");
donateEl.id = "donate-root";
document.body.appendChild(donateEl);
createRoot(donateEl).render(<DonateFloat />);
