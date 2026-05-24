(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = [];

  navLinks.forEach(function (link) {
    const id = link.getAttribute("href");
    if (id && id.startsWith("#")) {
      const section = document.querySelector(id);
      if (section) {
        sections.push({ id: id.slice(1), el: section, link: link });
      }
    }
  });

  function setActiveNav(activeId) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      const isActive = href === "#" + activeId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getCurrentSection() {
    const offset = 120;
    let current = sections[0] ? sections[0].id : null;

    sections.forEach(function (item) {
      const top = item.el.getBoundingClientRect().top;
      if (top <= offset) {
        current = item.id;
      }
    });

    return current;
  }

  function updateNavbarScrolledState() {
    if (!navbar) return;
    const shouldBeScrolled = window.scrollY > 40;
    navbar.classList.toggle("scrolled", shouldBeScrolled);
  }

  if (sections.length > 0) {
    window.addEventListener(
      "scroll",
      function () {
        updateNavbarScrolledState();
        const current = getCurrentSection();
        if (current) {
          setActiveNav(current);
        }
      },
      { passive: true }
    );

    setActiveNav(sections[0].id);
    updateNavbarScrolledState();
  } else {
    window.addEventListener(
      "scroll",
      function () {
        updateNavbarScrolledState();
      },
      { passive: true }
    );
    updateNavbarScrolledState();
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const navCollapse = document.getElementById("navbarNav");
      if (navCollapse && navCollapse.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler && typeof bootstrap !== "undefined") {
          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      }
    });
  });

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(".section-header.reveal-ready, .reveal-card");
    if (revealTargets.length > 0) {
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
      );

      revealTargets.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    document
      .querySelectorAll(".section-header.reveal-ready, .reveal-card")
      .forEach(function (el) {
        el.classList.add("is-visible");
      });
  }
})();
