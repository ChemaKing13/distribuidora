/* =========================================================
   ALTA COPA DISTRIBUCIÓN — main.js
   Un solo lugar para actualizar los datos de contacto:
   cambia CONFIG y se propaga a todas las páginas.
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = {
    whatsappNumber: "525512345678", // formato internacional sin '+' ni espacios
    phoneDisplay: "+52 55 1234 5678",
    phoneHref: "+525512345678",
    email: "contacto@altacopa.mx",
    address: "Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México",
    hours: "Lunes a viernes, 9:00–18:00 h",
    whatsappGreeting:
      "Hola, me gustaría solicitar información / cotización de productos de Alta Copa Distribución.",
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyContactConfig();
    setupNavToggle();
    setupYear();
    setupScrollReveal();
    setupCatalogFilter();
    setupQuoteForm();
  });

  /* ---------- Config de contacto en todo el sitio ---------- */
  function applyContactConfig() {
    var waLink =
      "https://wa.me/" +
      CONFIG.whatsappNumber +
      "?text=" +
      encodeURIComponent(CONFIG.whatsappGreeting);

    document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
      el.setAttribute("href", waLink);
    });
    document.querySelectorAll("[data-phone-link]").forEach(function (el) {
      el.setAttribute("href", "tel:" + CONFIG.phoneHref);
    });
    document.querySelectorAll("[data-phone-text]").forEach(function (el) {
      el.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll("[data-email-link]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + CONFIG.email);
    });
    document.querySelectorAll("[data-email-text]").forEach(function (el) {
      el.textContent = CONFIG.email;
    });
    document.querySelectorAll("[data-address-text]").forEach(function (el) {
      el.textContent = CONFIG.address;
    });
    document.querySelectorAll("[data-hours-text]").forEach(function (el) {
      el.textContent = CONFIG.hours;
    });
  }

  /* ---------- Navegación móvil ---------- */
  function setupNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* ---------- Año en footer ---------- */
  function setupYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Revelado sutil al hacer scroll ---------- */
  function setupScrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Filtro de catálogo (catalogo.html) ---------- */
  function setupCatalogFilter() {
    var filterBar = document.querySelector("[data-filter-bar]");
    var cards = document.querySelectorAll("[data-category]");
    if (!filterBar || !cards.length) return;

    var buttons = filterBar.querySelectorAll(".filter-btn");

    function applyFilter(category) {
      cards.forEach(function (card) {
        var match = category === "todos" || card.dataset.category === category;
        card.style.display = match ? "" : "none";
      });
      buttons.forEach(function (btn) {
        btn.setAttribute(
          "aria-pressed",
          String(btn.dataset.filter === category)
        );
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.dataset.filter);
        var params = new URLSearchParams(window.location.search);
        if (btn.dataset.filter === "todos") {
          params.delete("categoria");
        } else {
          params.set("categoria", btn.dataset.filter);
        }
        var newUrl =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, "", newUrl);
      });
    });

    var initial = new URLSearchParams(window.location.search).get("categoria");
    if (initial && filterBar.querySelector('[data-filter="' + initial + '"]')) {
      applyFilter(initial);
    }
  }

  /* ---------- Formulario de cotización → WhatsApp ---------- */
  function setupQuoteForm() {
    var form = document.getElementById("quote-form");
    if (!form) return;

    prefillFromQuery(form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = validateForm(form);

      if (errors.length) {
        showErrorSummary(form, errors);
        return;
      }

      clearErrorSummary(form);
      var message = buildWhatsAppMessage(form);
      var url =
        "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);

      window.open(url, "_blank", "noopener");

      form.hidden = true;
      var success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
  }

  function prefillFromQuery(form) {
    var producto = new URLSearchParams(window.location.search).get("producto");
    if (!producto) return;
    var checkbox = form.querySelector(
      'input[name="productos"][value="' + producto + '"]'
    );
    if (checkbox) checkbox.checked = true;
  }

  function validateForm(form) {
    var errors = [];
    var requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(function (field) {
      var fieldWrap = field.closest(".form-field");
      var isValid = field.checkValidity();
      var value = field.value.trim();

      if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
        isValid = false;
      }

      if (!isValid) {
        if (fieldWrap) fieldWrap.classList.add("has-error");
        errors.push({
          id: field.id,
          label: fieldWrap ? fieldWrap.querySelector("label").textContent : field.name,
        });
      } else if (fieldWrap) {
        fieldWrap.classList.remove("has-error");
      }
    });

    return errors;
  }

  function showErrorSummary(form, errors) {
    var summary = document.getElementById("form-error-summary");
    if (!summary) return;

    summary.innerHTML =
      "<strong>Revisa los siguientes campos:</strong><ul>" +
      errors
        .map(function (err) {
          return '<li><a href="#' + err.id + '">' + err.label.replace("*", "").trim() + "</a></li>";
        })
        .join("") +
      "</ul>";
    summary.classList.add("show");
    summary.setAttribute("tabindex", "-1");
    summary.focus();
  }

  function clearErrorSummary(form) {
    var summary = document.getElementById("form-error-summary");
    if (summary) {
      summary.classList.remove("show");
      summary.innerHTML = "";
    }
  }

  function buildWhatsAppMessage(form) {
    var data = new FormData(form);
    var productos = data.getAll("productos").join(", ") || "No especificado";

    var lines = [
      "Nueva solicitud de cotización — Alta Copa Distribución",
      "",
      "Nombre: " + (data.get("nombre") || ""),
      "Empresa / negocio: " + (data.get("empresa") || ""),
      "Teléfono: " + (data.get("telefono") || ""),
      "Email: " + (data.get("email") || ""),
      "Tipo de negocio: " + (data.get("tipo_negocio") || ""),
      "Productos de interés: " + productos,
      "Mensaje: " + (data.get("mensaje") || "—"),
    ];

    return lines.join("\n");
  }
})();
