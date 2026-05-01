import { useEffect, useState } from "react";

export function ScrollNav() {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      setAtTop(scrollTop < 60);
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (target: "top" | "bottom") => {
    window.scrollTo({ top: target === "top" ? 0 : document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid hsl(195 100% 50% / 0.3)",
    background: disabled ? "hsl(195 100% 50% / 0.03)" : "hsl(195 100% 50% / 0.08)",
    color: disabled ? "hsl(195 100% 50% / 0.2)" : "hsl(195 100% 65%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
    boxShadow: disabled ? "none" : "0 0 12px hsl(195 100% 50% / 0.15)",
    transition: "all 0.2s ease",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    fontSize: 14,
    fontWeight: 700,
  });

  return (
    <>
      <button
        onClick={() => !atTop && scrollTo("top")}
        style={{ ...btnStyle(atTop), position: "fixed", right: 16, top: 16, zIndex: 50 }}
        aria-label="Scroll to top"
      >
        ▲
      </button>
      <button
        onClick={() => !atBottom && scrollTo("bottom")}
        style={{ ...btnStyle(atBottom), position: "fixed", right: 16, bottom: 16, zIndex: 50 }}
        aria-label="Scroll to bottom"
      >
        ▼
      </button>
    </>
  );
}
