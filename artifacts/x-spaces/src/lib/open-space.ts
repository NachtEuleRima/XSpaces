/**
 * Opens an X Space URL.
 * On mobile, tries the twitter:// deep link first (opens the X app if installed),
 * then falls back to the web URL after 1.5s if the app didn't intercept it.
 * On desktop, opens a new tab.
 */
export function openSpaceUrl(url: string): void {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const spaceIdMatch = url.match(/\/spaces\/([A-Za-z0-9]+)/i);

  if (isMobile && spaceIdMatch) {
    const appUrl = `twitter://spaces?id=${spaceIdMatch[1]}`;
    window.location.href = appUrl;
    setTimeout(() => {
      // If we're still here the app wasn't installed — fall back to web
      window.location.href = url;
    }, 1500);
  } else {
    window.open(url, "_blank");
  }
}
