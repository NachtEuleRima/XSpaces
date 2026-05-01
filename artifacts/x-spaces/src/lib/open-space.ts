/**
 * Opens an X Space URL.
 * On mobile, uses window.location.href so iOS universal links hand off to the X app directly.
 * On desktop, opens a new tab.
 */
export function openSpaceUrl(url: string): void {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
  }
}
