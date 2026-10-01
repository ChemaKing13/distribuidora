/* =========================================================
   ALTA COPA DISTRIBUCIÓN — main.js
   Un solo lugar para actualizar los datos de contacto:
   cambia CONFIG y se propaga a todas las páginas.
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = {
    whatsappNumber: "525548323739", // formato internacional sin '+' ni espacios
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
    var known = Array.prototype.some.call(buttons, function (btn) {
      return btn.dataset.filter === initial;
    });
    if (initial && known) {
      applyFilter(initial);
    }
  }

  /* ---------- Formulario de cotización → email (Web3Forms) ---------- */
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
      sendQuote(form);
    });
  }

  function sendQuote(form) {
    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = "Enviando…";

    var data = new FormData(form);
    data.set("productos", data.getAll("productos").join(", "));
    data.set(
      "subject",
      "Solicitud de cotización — " + (data.get("empresa") || "sitio web")
    );

    function fail(message) {
      button.disabled = false;
      button.textContent = label;
      showSendError(form, message);
    }

    fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
      .then(function (res) {
        return res.json();
      })
      .then(function (result) {
        if (result.success) {
          showSuccess(form);
        } else {
          fail(result.message);
        }
      })
      .catch(function () {
        fail(null);
      });
  }

  function showSuccess(form) {
    form.hidden = true;
    var success = document.getElementById("form-success");
    if (!success) return;
    success.classList.add("show");
    success.setAttribute("tabindex", "-1");
    success.focus();
  }

  function showSendError(form, message) {
    var summary = document.getElementById("form-error-summary");
    if (!summary) return;

    summary.innerHTML = "";

    var title = document.createElement("strong");
    title.textContent = "No pudimos enviar tu solicitud.";
    summary.appendChild(title);

    if (message) {
      var detail = document.createElement("p");
      detail.textContent = message;
      summary.appendChild(detail);
    }

    var retry = document.createElement("p");
    retry.appendChild(document.createTextNode("Intenta de nuevo o "));
    var wa = document.createElement("a");
    wa.href =
      "https://wa.me/" +
      CONFIG.whatsappNumber +
      "?text=" +
      encodeURIComponent(buildWhatsAppMessage(form));
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.textContent = "envíala por WhatsApp";
    retry.appendChild(wa);
    retry.appendChild(document.createTextNode("."));
    summary.appendChild(retry);

    summary.classList.add("show");
    summary.setAttribute("tabindex", "-1");
    summary.focus();
  }

  function prefillFromQuery(form) {
    var producto = new URLSearchParams(window.location.search).get("producto");
    if (!producto) return;
    form.querySelectorAll('input[name="productos"]').forEach(function (cb) {
      if (cb.value === producto) cb.checked = true;
    });
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

      if (field.type === "tel" && value && value.replace(/\D/g, "").length < 10) {
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

    // Validación especial para checkboxes de productos
    var productCheckboxes = form.querySelectorAll('input[name="productos"]');
    if (productCheckboxes.length > 0) {
      var anyChecked = Array.from(productCheckboxes).some(function (cb) { return cb.checked; });
      if (!anyChecked) {
        var productFieldWrap = form.querySelector('input[name="productos"]').closest(".form-field");
        if (productFieldWrap) productFieldWrap.classList.add("has-error");
        errors.push({
          id: "productos-error",
          label: "Productos de interés",
        });
      } else if (productCheckboxes[0].closest(".form-field")) {
        productCheckboxes[0].closest(".form-field").classList.remove("has-error");
      }
    }

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
