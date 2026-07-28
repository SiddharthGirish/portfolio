/* ============================================================
   Siddharth Girish — Portfolio scripts
   Vanilla JS only. Sections:
   1. Profile image fallback
   2. Mobile navigation
   3. Sticky nav shadow + scroll progress + back-to-top
   4. Active section highlighting
   5. Typing animation (hero title)
   6. Reveal-on-scroll
   7. Animated counters
   8. Contact form validation (frontend only)
   9. Footer year
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Profile image fallback ----------
     If profile.jpg isn't present next to index.html,
     show the "SG" monogram instead of a broken image. */
  var profileImg = document.getElementById("profileImg");
  var monogram = document.getElementById("monogram");
  if (profileImg && monogram) {
    profileImg.addEventListener("error", function () {
      profileImg.style.display = "none";
      monogram.style.display = "grid";
    });
  }

  /* ---------- 2. Mobile navigation ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after choosing a link (mobile)
  navLinks.addEventListener("click", function (e) {
    if (e.target.matches(".nav__link")) closeMenu();
  });

  // Close on Escape for keyboard users
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- 3. Sticky nav shadow, scroll progress, back-to-top ---------- */
  var navbar = document.getElementById("navbar");
  var progressBar = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    navbar.classList.toggle("is-scrolled", y > 8);
    progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    backToTop.classList.toggle("is-visible", y > 500);

    highlightActiveSection();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- 4. Active section highlighting ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var linkMap = {};
  document.querySelectorAll(".nav__link").forEach(function (link) {
    linkMap[link.getAttribute("href").slice(1)] = link;
  });

  function highlightActiveSection() {
    var offset = window.scrollY + 120; // account for fixed nav
    var currentId = sections[0] ? sections[0].id : null;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= offset) currentId = sec.id;
    });

    Object.keys(linkMap).forEach(function (id) {
      linkMap[id].classList.toggle("is-active", id === currentId);
    });
  }

  /* ---------- 5. Typing animation ---------- */
  var typedEl = document.getElementById("typedTitle");
  var titles = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Generative AI Engineer",
    "Computer Vision Engineer",
    "AI Research Engineer"
  ];

  if (prefersReducedMotion) {
    // Skip the animation, show the primary title immediately
    typedEl.textContent = titles[0];
  } else {
    var titleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      var current = titles[titleIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1800); // pause on full word
          return;
        }
        setTimeout(typeLoop, 65);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          setTimeout(typeLoop, 350);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    typeLoop();
  }

  /* ---------- 6. Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 7. Animated counters ---------- */
  var counters = document.querySelectorAll(".stat__num");
  var counterDone = false;

  function animateCounters() {
    if (counterDone) return;
    counterDone = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (prefersReducedMotion) { el.textContent = target; return; }

      var duration = 1200;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // Ease-out cubic for a satisfying finish
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if ("IntersectionObserver" in window) {
    var statsBlock = document.querySelector(".about__stats");
    if (statsBlock) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            animateCounters();
            counterObserver.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      counterObserver.observe(statsBlock);
    }
  } else {
    animateCounters();
  }

  /* ---------- 8. Contact form validation ---------- */
  var sendBtn = document.getElementById("sendBtn");

  var fields = {
    name:    { input: document.getElementById("fName"),    error: document.getElementById("errName") },
    email:   { input: document.getElementById("fEmail"),   error: document.getElementById("errEmail") },
    subject: { input: document.getElementById("fSubject"), error: document.getElementById("errSubject") },
    message: { input: document.getElementById("fMessage"), error: document.getElementById("errMessage") }
  };

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    field.error.textContent = message;
    field.input.classList.toggle("is-invalid", Boolean(message));
  }

  function validateField(key) {
    var field = fields[key];
    var value = field.input.value.trim();

    if (!value) {
      setError(field, "This field is required.");
      return false;
    }
    if (key === "email" && !emailPattern.test(value)) {
      setError(field, "Enter a valid email address.");
      return false;
    }
    if (key === "message" && value.length < 10) {
      setError(field, "Message should be at least 10 characters.");
      return false;
    }
    setError(field, "");
    return true;
  }

  // Live validation: clear errors as the user fixes them
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("input", function () {
      if (fields[key].error.textContent) validateField(key);
    });
  });

  sendBtn.addEventListener("click", function () {
    var valid = Object.keys(fields)
      .map(validateField)
      .every(Boolean);

    var success = document.getElementById("formSuccess");

    if (valid) {
      success.textContent = "Message ready — thanks, " + fields.name.input.value.trim() + "! (Connect a backend or a service like Formspree to deliver it.)";
      Object.keys(fields).forEach(function (key) { fields[key].input.value = ""; });
    } else {
      success.textContent = "";
    }
  });

  /* ---------- 9. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  // Initialize state on load
  onScroll();
})();