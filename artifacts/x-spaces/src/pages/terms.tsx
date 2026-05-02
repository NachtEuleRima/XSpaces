export default function Terms() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(222 47% 4%)",
      color: "rgba(255,255,255,0.85)",
      fontFamily: "monospace",
      padding: "3rem 1.5rem 5rem",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <a href="/" style={{ color: "hsl(195 100% 60%)", fontSize: "0.75rem", letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" }}>
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
          Terms of Service
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: "0.5rem", marginBottom: "2.5rem" }}>
          Last updated: May 2026
        </p>

        <Section title="Acceptance of Terms">
          By accessing or using XSpaces Live (XCOMS Space), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
        </Section>

        <Section title="About the Service">
          XSpaces Live is an independent, fan-made tracker for live and upcoming X Spaces. It is not affiliated with, endorsed by, or sponsored by X Corp or Twitter, Inc. All X Spaces data is retrieved via the official X API in accordance with X's developer terms.
        </Section>

        <Section title="Use of the Service">
          You agree to use XSpaces Live only for lawful purposes and in accordance with these terms. You must not:
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", lineHeight: 2 }}>
            <li>Attempt to scrape, reverse-engineer, or systematically extract data from the service</li>
            <li>Use the service to harass, stalk, or harm any individual</li>
            <li>Submit false, misleading, or abusive content via the feedback form</li>
            <li>Attempt to gain unauthorized access to any part of the service or its infrastructure</li>
          </ul>
        </Section>

        <Section title="Account & Sign-In">
          You may use the service without signing in. If you choose to sign in with X or provide a username, you represent that you have the right to use that X account or handle. We are not responsible for any unauthorized use of your credentials.
        </Section>

        <Section title="Intellectual Property">
          The XSpaces Live name, site design, and original code are the property of the creator. The Star Trek-inspired aesthetic is used as fan homage and is not affiliated with Paramount Global or CBS Studios. X, the X logo, and X Spaces are trademarks of X Corp.
        </Section>

        <Section title="Donations">
          Donations made through Venmo, CashApp, or PayPal are voluntary and non-refundable. They support the continued development and hosting of the service. Donations do not entitle you to any specific features, access, or service level.
        </Section>

        <Section title="Disclaimer of Warranties">
          XSpaces Live is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or availability of Spaces data. Live data depends on the X API and may be delayed, incomplete, or temporarily unavailable.
        </Section>

        <Section title="Limitation of Liability">
          To the fullest extent permitted by law, XSpaces Live and its creator shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
        </Section>

        <Section title="Changes to Terms">
          We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms. The "last updated" date at the top of this page will reflect any changes.
        </Section>

        <Section title="Contact">
          For questions about these terms, reach out on X: <a href="https://x.com/RimaSukhadia" target="_blank" rel="noopener noreferrer" style={{ color: "hsl(195 100% 60%)" }}>@RimaSukhadia</a>
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
