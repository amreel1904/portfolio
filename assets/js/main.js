/**
* Amreel Nuqman — Portfolio
* Editorial dev-native (dark). Continuous-scroll interactions.
*/
(function () {
  "use strict";

  const select = (el, all = false) =>
    all ? [...document.querySelectorAll(el)] : document.querySelector(el);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /**
   * Sticky header background after scrolling past the top
   */
  const header = select("#header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /**
   * Mobile nav toggle
   */
  const navbar = select("#navbar");
  const navToggle = select(".mobile-nav-toggle");

  const closeMobileNav = () => {
    if (!navbar || !navbar.classList.contains("navbar-mobile")) return;
    navbar.classList.remove("navbar-mobile");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector("i").classList.replace("bi-x", "bi-list");
    }
  };

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = navbar.classList.toggle("navbar-mobile");
      this.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = this.querySelector("i");
      icon.classList.toggle("bi-list", !open);
      icon.classList.toggle("bi-x", open);
    });
  }

  /**
   * Theme toggle (dark ⇄ light), persisted in localStorage.
   * The inline <head> script has already set data-theme before first paint;
   * here we sync the button's icon/label and wire the click.
   */
  const root = document.documentElement;
  const themeToggle = select(".theme-toggle");

  const syncThemeButton = (theme) => {
    if (!themeToggle) return;
    const label =
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    const icon = themeToggle.querySelector("i");
    if (icon) icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  };

  syncThemeButton(root.getAttribute("data-theme") || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable (private mode) — theme still applies for the session */
      }
      syncThemeButton(next);
    });
  }

  /**
   * Smooth-scroll nav links (with header offset) + close mobile menu
   */
  select("#navbar .nav-link", true).forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = select(this.hash);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (this.hash === "#hero" ? 0 : header.offsetHeight);
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  /**
   * Scrollspy — highlight the nav link for the section in view
   */
  const navLinks = select("#navbar .nav-link", true);
  const sections = navLinks
    .map((l) => select(l.hash))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.hash === id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /**
   * Reveal on scroll — content is visible by default; this only enhances.
   */
  const reveals = select(".reveal", true);
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // small stagger for grouped items
          const delay = Math.min(i * 60, 240);
          setTimeout(() => entry.target.classList.add("in-view"), delay);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
    // Safety: if anything is still hidden after load (e.g. above the fold), show it.
    window.addEventListener("load", () => {
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in-view");
      });
    });
  }

  /**
   * Footer year
   */
  const yearEl = select("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== "undefined" && select(".testimonials-slider")) {
    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: prefersReducedMotion
        ? false
        : { delay: 4000, disableOnInteraction: false },
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  /**
   * Portfolio filter (native CSS Grid — no layout library).
   * Items stay in normal grid flow; filtering just toggles [hidden],
   * so the grid re-flows itself and always fills the container width.
   */
  (() => {
    const container = select(".portfolio-container");
    if (!container) return;
    const items = select(".portfolio-item", true);
    const filters = select("#portfolio-flters li", true);
    filters.forEach((f) => {
      f.addEventListener("click", function () {
        filters.forEach((el) => el.classList.remove("filter-active"));
        this.classList.add("filter-active");
        const selector = this.getAttribute("data-filter"); // "*" | ".filter-app" | ".filter-web"
        items.forEach((item) => {
          item.hidden = selector !== "*" && !item.matches(selector);
        });
      });
    });
  })();

  /**
   * Portfolio lightbox
   */
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".portfolio-lightbox" });
  }

  /**
   * Counters
   */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }
})();
