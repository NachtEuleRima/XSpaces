/**
 * Opens an X Space URL.
 * On mobile: fires the twitter:// custom scheme (no dialog, goes straight to the app).
 * Cancels the web fallback if the page goes hidden (meaning the app opened successfully).
 * On desktop: opens a new tab.
 */
export function openSpaceUrl(url: string): void {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    window.open(url, "_blank");
    return;
  }

  const spaceIdMatch = url.match(/\/spaces\/([A-Za-z0-9]+)/i);
  if (!spaceIdMatch) {
    window.location.href = url;
    return;
  }

  const appUrl = `twitter://spaces?id=${spaceIdMatch[1]}`;
  window.location.href = appUrl;

  // If the app opened, the browser tab goes hidden — cancel the web fallback
  const fallback = setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.location.href = url;
  }, 1500);

  function onVisibilityChange() {
    if (document.hidden) {
      clearTimeout(fallback);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
}
