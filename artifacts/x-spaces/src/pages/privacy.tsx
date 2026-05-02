import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePop = () => { window.location.href = "/?auth=1"; };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(222 47% 4%)",
      color: "rgba(255,255,255,0.85)",
      fontFamily: "monospace",
      padding: "3rem 1.5rem 5rem",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <a href="/?auth=1" style={{ color: "hsl(195 100% 60%)", fontSize: "0.75rem", letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" }}>
          ← Back to Mission Control
        </a>

        <h1 style={{
          marginTop: "2rem",
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "hsl(195 100% 65%)",
          textShadow: "0 0 20px hsl(195 100% 50% / 0.4)",
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: "0.5rem", marginBottom: "2.5rem" }}>
          Last updated: May 2026
        </p>

        <Section title="Who We Are">
          XSpaces Live (also referred to as XCOMS Space) is an independent, fan-made live tracker for X Spaces. We are not affiliated with, endorsed by, or sponsored by X Corp or Twitter, Inc.
        </Section>

        <Section title="What We Collect">
          We collect the minimum necessary to personalize your experience:
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", lineHeight: 2 }}>
            <li>Your <strong style={{ color: "hsl(195 100% 70%)" }}>X username</strong> — entered manually or via X OAuth sign-in</li>
            <li>Your <strong style={{ color: "hsl(195 100% 70%)" }}>authentication method</strong> (X sign-in or manual entry)</li>
            <li>Anonymous <strong style={{ color: "hsl(195 100% 70%)" }}>visitor counts</strong> — no personal data attached</li>
            <li>Optional <strong style={{ color: "hsl(195 100% 70%)" }}>feedback messages</strong> you choose to submit</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>We do <strong>not</strong> collect your email address, password, location, or any data beyond the above.</p>
        </Section>

        <Section title="How We Use Your Data">
          <ul style={{ paddingLeft: "1.25rem", lineHeight: 2 }}>
            <li>Your username is used solely to personalize which Spaces appear at the top of your feed</li>
            <li>Feedback messages are used only to improve the product</li>
            <li>We do not sell, rent, share, or trade your data with any third party</li>
            <li>We do not use your data for advertising</li>
          </ul>
        </Section>

        <Section title="X API & OAuth">
          When you sign in with X, we use X's official OAuth 2.0 flow. We request <strong style={{ color: "hsl(195 100% 70%)" }}>read-only access</strong> to your public profile to retrieve your username. We do not read your DMs, tweets, followers, or any other account data. We never post on your behalf.
        </Section>

        <Section title="Data Storage">
          Your username is stored in your browser's local storage on your device. If you submit feedback, that message is stored in our secure database. You can clear your stored data at any time by signing out or clearing your browser storage.
        </Section>

        <Section title="Cookies">
          We do not use tracking cookies or third-party analytics. Session storage is used only to manage your current visit state (e.g. whether you've seen the welcome screen this session).
        </Section>

        <Section title="Your Rights">
          You can:
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", lineHeight: 2 }}>
            <li>Sign out at any time to remove your username from the session</li>
            <li>Clear all stored data by clearing your browser's local storage</li>
            <li>Request deletion of any submitted feedback by contacting us on X</li>
          </ul>
        </Section>

        <Section title="Contact">
          For privacy-related questions, reach out on X: <a href="https://x.com/RimaSukhadia" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(195 100% 60%)" }}>@RimaSukhadia</a>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{
        fontSize: "0.8rem",
        fontWeight: 900,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "hsl(290 90% 72%)",
        marginBottom: "0.6rem",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: "0.82rem", lineHeight: 1.9, color: "rgba(255,255,255,0.65)" }}>
        {children}
      </div>
      <div style={{ marginTop: "1.5rem", height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}
