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

  /* A single line just below the sticky nav decides the active section: the
     last section whose top has crossed it wins. A band would be ambiguous —
     clicking a link parks that section's top at scroll-padding-top (84px), so
     the previous section still occupies the sliver above it and would take the
     highlight. The line sits a few px below 84 so the clicked section lands on
     the winning side of it even after sub-pixel rounding. */
  var LINE = 92;

  if (sections.length) {
    var current = null;

    var spy = function () {
      var id = null;
      var atBottom = window.innerHeight + window.scrollY >=
                     document.documentElement.scrollHeight - 2;

      if (atBottom) {
        /* A short final section may never reach the line; claim it anyway. */
        id = sections[sections.length - 1].id;
      } else {
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].getBoundingClientRect().top <= LINE) id = sections[i].id;
        }
      }

      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    };

    /* Called straight from the scroll event rather than batched into a
       requestAnimationFrame: rAF is suspended while the tab is hidden, which
       would leave the highlight frozen on whatever was last on screen. Six
       reads and no writes on the common path is cheap enough to run inline. */
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
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
