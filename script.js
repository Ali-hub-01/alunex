/* ALUNEX — interactions (vanilla, no deps) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_NUMBER = "77712678988";

  /* ---------- intro: start hero animations once page is ready ---------- */
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
  /* fallback if load takes long (slow image) — start after 1.2s anyway */
  setTimeout(function () { document.body.classList.add("loaded"); }, 1200);

  /* ---------- header state ---------- */
  var hdr = document.getElementById("hdr");
  var onScrollHdr = function () {
    if (window.scrollY > 30) hdr.classList.add("scrolled");
    else hdr.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScrollHdr, { passive: true });
  onScrollHdr();

  /* ---------- burger / mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- scroll reveals + mechanism animations ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
  );
  var forceStatic = /[?&]static/.test(location.search);
  if (forceStatic) document.body.classList.add("static", "loaded");
  document
    .querySelectorAll(".svc, .io-fade, .why-card, .step, .lead")
    .forEach(function (el) {
      if (forceStatic) el.classList.add("on");
      else io.observe(el);
    });

  /* ---------- hero parallax (desktop-ish, skipped for reduced motion) ---------- */
  if (!reduceMotion) {
    var heroImg = document.querySelector(".hero-img");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight && heroImg) {
          heroImg.style.transform = "translateY(" + y * 0.18 + "px) scale(1.0)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- process rail fill (mobile vertical rail) ---------- */
  var proc = document.getElementById("kak-rabotaem");
  var fill = document.getElementById("procFill");
  if (proc && fill && !reduceMotion) {
    var railTick = false;
    var updateRail = function () {
      var r = proc.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.75 - r.top) / (r.height);
      progress = Math.max(0, Math.min(1, progress));
      fill.style.height = (progress * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", function () {
      if (railTick) return;
      railTick = true;
      requestAnimationFrame(function () { updateRail(); railTick = false; });
    }, { passive: true });
    updateRail();
  }

  /* ---------- "Рассчитать" links preselect the service in the form ---------- */
  var select = document.getElementById("serviceSelect");
  document.querySelectorAll(".svc-link[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var val = a.getAttribute("data-service");
      if (!select) return;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === val) { select.selectedIndex = i; break; }
      }
    });
  });

  /* ---------- lead form → WhatsApp ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = (form.elements.name.value || "").trim();
      var service = form.elements.service.value;
      var comment = (form.elements.comment.value || "").trim();
      var lines = [
        "Здравствуйте! Хочу рассчитать стоимость остекления.",
        "Имя: " + name,
        "Услуга: " + service
      ];
      if (comment) lines.push("Комментарий: " + comment);
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- current year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
