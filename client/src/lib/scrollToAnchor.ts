/** Smooth-scroll to an on-page anchor (works with wouter client routing). */
export function scrollToAnchor(id: string) {
  const el = document.getElementById(id.replace(/^#/, ""));
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  const hash = id.startsWith("#") ? id : `#${id}`;
  window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  return true;
}
