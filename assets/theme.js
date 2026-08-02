/* Runs before first paint so there is no flash of the wrong palette.
   Kept in its own file (not inline) so the CSP can forbid inline script. */
(function () {
  var t = null;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") {
    t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", t);
})();
