document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initFooterYear();
  initScrollReveal();
  initFloatingContact();
  initContactForm();
});

function initMobileNav() {
  var toggle = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  if (!toggle || !mobileNav) return;

  function closeMenu(returnFocus) {
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { closeMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMenu(true);
    }
  });
}

function initFooterYear() {
  var year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });
}

function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var els = document.querySelectorAll(
    ".pillar, .two-up__item, .step, .card, .feature-card, .check-item, .contact-card, .solution-block, .screenshot-frame, .badge"
  );
  if (!els.length) return;

  els.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach(function (el) { io.observe(el); });
}

function initFloatingContact() {
  if (location.pathname.indexOf("contact.html") !== -1) return;
  var a = document.createElement("a");
  a.href = "contact.html";
  a.className = "btn btn--gold mobile-contact-cta";
  a.textContent = "Nous contacter";
  document.body.appendChild(a);
}

function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var CONTACT_EMAIL = "b.bertolis@outlook.com";

  var fieldsCommon = document.getElementById("fields-common");
  var fieldsApplication = document.getElementById("fields-application");
  var fieldsAdministrative = document.getElementById("fields-administrative");
  var radios = form.querySelectorAll('input[name="request-type"]');

  var APPLICATION_QUESTIONS = [
    ["app-goal", "Objectif de l'outil"],
    ["app-process", "Process à simplifier"],
    ["app-users", "Nombre d'utilisateurs"],
    ["app-timeline", "Délai souhaité"],
    ["app-existing", "Outils existants à connecter/remplacer"]
  ];
  var ADMINISTRATIVE_QUESTIONS = [
    ["adm-type", "Type de démarches"],
    ["adm-frequency", "Fréquence du besoin"],
    ["adm-volume", "Volume approximatif"],
    ["adm-current", "Processus actuel"]
  ];

  radios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      fieldsCommon.hidden = false;
      fieldsApplication.hidden = radio.value !== "application";
      fieldsAdministrative.hidden = radio.value !== "administrative";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var type = form.querySelector('input[name="request-type"]:checked');
    if (!type) return;

    var typeLabel = type.value === "application" ? "Création d'application" : "Assistance administrative";
    var val = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    var lines = [];
    lines.push("Type de demande : " + typeLabel);
    lines.push("Nom : " + val("f-name"));
    if (val("f-company")) lines.push("Entreprise : " + val("f-company"));
    lines.push("E-mail : " + val("f-email"));
    if (val("f-phone")) lines.push("Téléphone : " + val("f-phone"));
    lines.push("");

    var questions = type.value === "application" ? APPLICATION_QUESTIONS : ADMINISTRATIVE_QUESTIONS;
    questions.forEach(function (q) {
      var v = val(q[0]);
      if (v) lines.push(q[1] + " : " + v);
    });

    if (val("f-message")) {
      lines.push("");
      lines.push("Précisions complémentaires :");
      lines.push(val("f-message"));
    }

    var subject = "[Bertolis] Nouvelle demande — " + typeLabel;
    var body = lines.join("\n");
    window.location.href =
      "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
}
