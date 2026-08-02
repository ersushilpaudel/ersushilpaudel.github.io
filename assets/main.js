/* Sushil Paudel — personal site */
(function () {
  "use strict";

  /* ---------- portrait fallback ---------- */
  /* Handled here rather than an inline onerror= so the CSP can forbid inline
     script. If the image is missing or fails to decode, show the monogram. */
  var portrait = document.getElementById("portrait");
  var monogram = document.getElementById("monogram");

  var useMonogram = function () {
    portrait.style.display = "none";
    monogram.hidden = false;
  };

  portrait.addEventListener("error", useMonogram);
  if (portrait.complete && portrait.naturalWidth === 0) useMonogram();

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var btn  = document.getElementById("theme");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Follow the OS only while the visitor hasn't chosen for themselves. */
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", function (e) {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) root.setAttribute("data-theme", e.matches ? "dark" : "light");
  });

  /* ---------- nav shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("stuck", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on enter ---------- */
  var items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    /* Stagger siblings inside a grid so cards cascade rather than pop together. */
    items.forEach(function (el, i) {
      var sibs = el.parentElement.querySelectorAll(":scope > .reveal");
      if (sibs.length > 1) {
        el.style.transitionDelay = (Array.prototype.indexOf.call(sibs, el) * 70) + "ms";
      }
      io.observe(el);
    });
  }

  /* ---------- scroll spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Set();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      /* Highlight the topmost section currently in the band. */
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible.has(sections[i].id)) { current = sections[i].id; break; }
      }
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    }, { rootMargin: "-64px 0px -60% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
