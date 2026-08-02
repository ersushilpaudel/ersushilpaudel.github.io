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

  /* ---------- visit count ----------
     Global total, so it needs a counter service — a static host cannot keep
     state. api.counterapi.dev is the only external origin the CSP allows, and
     only for connect-src, so it can return a number but never run code here.
     The count is public and unauthenticated: anyone who finds the endpoint can
     inflate it, which is acceptable for a vanity figure and would not be for
     anything load-bearing. On any failure the line stays hidden rather than
     showing a stale or wrong number. */
  var visits = document.getElementById("visits");
  var COUNTER = "https://api.counterapi.dev/v1/ersushilpaudel/site-visits/up";

  if (window.fetch) {
    fetch(COUNTER, { referrerPolicy: "no-referrer" })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (data) {
        if (!data || typeof data.count !== "number") return;
        visits.textContent =
          data.count.toLocaleString() + (data.count === 1 ? " visit" : " visits");
        visits.hidden = false;
      })
      .catch(function () { /* counter unavailable — leave hidden */ });
  }
})();
