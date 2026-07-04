(() => {
  // src/template.js
  var dossierModalTemplate = `
<div id="dossierModal" class="dossier-modal-container">
  <div class="dossier-modal-box">
    <span class="dossier-modal-close">&times;</span>
    <h2 id="dossier-course-title" class="lw-widget-in learnworlds-subheading learnworlds-element learnworlds-subheading-small">Descargar Dossier</h2>
    <div id="dossier-course-subtitle" class="lw-widget-in learnworlds-main-text learnworlds-main-text-large learnworlds-element" data-element-id="textLarge" data-node-type="text">Revisa tu correo, te acabamos de enviar lo que nos has pedido.</div>

    <form id="dossierForm" novalidate>
      <input type="hidden" id="modal-course-id">
      <input type="hidden" id="modal-course-name">
      <input type="hidden" id="modal-page-url">

      <div class="dossier-input-group">
        <label for="dossier-nombre">Nombre completo *</label>
        <input type="text" id="dossier-nombre" required placeholder="Ej. Andrea Pérez">
        <span class="dossier-field-error" id="dossier-nombre-error"></span>
      </div>

      <div class="dossier-input-group">
        <label for="dossier-email">Correo electrónico *</label>
        <input type="email" id="dossier-email" required placeholder="ejemplo@correo.com">
        <span class="dossier-field-error" id="dossier-email-error"></span>
      </div>

      <div class="lead-form__optin-checkbox">
          <label for="dossier-terms" class="checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left">
              <input class="checkbox flexible-part js-optin-checkbox" type="checkbox" data-gtm-form-interact-field-id="0" id="dossier-terms" required>
              <div class="checkbox-box lw-border-color-fadeout80 flexible-part">
                  <span class="learnworlds-icon learnworlds-heading3-small fas fa-check"></span>
              </div>
              <div class="flexible-part">
                  Acepto los <a href="/terms" target="_blank" rel="noopener">Términos y Condiciones</a> y la <a href="/privacy" target="_blank" rel="noopener">Política de Privacidad</a> *
              </div>
          </label>
          <span class="dossier-field-error" id="dossier-terms-error"></span>
      </div>

      <button type="submit" id="dossier-submit-btn" class="learnworlds-button">Solicitar Dossier</button>
    </form>
  </div>
</div>
`;

  // src/utm.js
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var STORAGE_KEY = "posso_utms";
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    let foundAny = false;
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        utms[key] = value;
        foundAny = true;
      }
    });
    if (foundAny) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
      return utms;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // src/request-types.js
  var PLACEHOLDER = /\{\{\s*course\s*\}\}/g;
  function renderTemplate(template, courseName) {
    return template.replace(PLACEHOLDER, courseName);
  }
  var DEFAULT_REQUEST_TYPES = {
    dossier: {
      triggerClass: "btn-dossier-request",
      payloadType: "dossier",
      modalTitle: "Descargar Dossier",
      subtitleTemplate: "Te enviaremos el dossier del {{course}}.",
      submitLabel: "Solicitar Dossier",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Revisa tu bandeja de entrada, el dossier va en camino.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {
        processingLabel: "Procesando...",
        sentLabel: "\xA1Enviado!",
        successAlert: "\xA1Listo! Te acabamos de enviar el dossier a tu correo electr\xF3nico.",
        errorAlert: "Hubo un problema. Por favor, int\xE9ntalo de nuevo."
      }
    },
    info: {
      triggerClass: "btn-info-request",
      payloadType: "info",
      modalTitle: "Avisarme de Novedades",
      subtitleTemplate: "Te avisaremos en cuanto haya novedades sobre el {{course}}.",
      submitLabel: "Avisarme",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Te avisaremos en cuanto tengamos novedades.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {
        processingLabel: "Procesando...",
        sentLabel: "\xA1Enviado!",
        successAlert: "\xA1Listo! Te avisaremos por correo en cuanto haya novedades.",
        errorAlert: "Hubo un problema. Por favor, int\xE9ntalo de nuevo."
      }
    }
  };
  function mergeRequestTypes(defaults, overrides) {
    const result = {};
    const keys = /* @__PURE__ */ new Set([...Object.keys(defaults), ...Object.keys(overrides || {})]);
    keys.forEach((key) => {
      const base = defaults[key] || {};
      const override = overrides && overrides[key] || {};
      result[key] = {
        ...base,
        ...override,
        loggedIn: { ...base.loggedIn || {}, ...override.loggedIn || {} }
      };
    });
    return result;
  }

  // src/request-form.js
  var LOG_PREFIX = "[RequestForm]";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log(LOG_PREFIX, "script parsed, readyState =", document.readyState);
  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message || "";
    if (input) input.classList.toggle("dossier-input-invalid", !!message);
  }
  function validateDossierForm() {
    const nombre = document.getElementById("dossier-nombre").value.trim();
    const email = document.getElementById("dossier-email").value.trim();
    const termsAccepted = document.getElementById("dossier-terms").checked;
    let isValid = true;
    if (!nombre) {
      setFieldError("dossier-nombre", "dossier-nombre-error", "Este campo es obligatorio.");
      isValid = false;
    } else {
      setFieldError("dossier-nombre", "dossier-nombre-error", "");
    }
    if (!email) {
      setFieldError("dossier-email", "dossier-email-error", "Este campo es obligatorio.");
      isValid = false;
    } else if (!EMAIL_RE.test(email)) {
      setFieldError("dossier-email", "dossier-email-error", "Introduce un correo electr\xF3nico v\xE1lido.");
      isValid = false;
    } else {
      setFieldError("dossier-email", "dossier-email-error", "");
    }
    if (!termsAccepted) {
      setFieldError("dossier-terms", "dossier-terms-error", "Debes aceptar los T\xE9rminos y la Pol\xEDtica de Privacidad.");
      isValid = false;
    } else {
      setFieldError("dossier-terms", "dossier-terms-error", "");
    }
    console.log(LOG_PREFIX, "form validation", { nombreOk: !!nombre, emailOk: EMAIL_RE.test(email), termsAccepted, isValid });
    return isValid;
  }
  function injectModal() {
    if (document.getElementById("dossierModal")) {
      console.log(LOG_PREFIX, "#dossierModal already present, skipping injection");
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = dossierModalTemplate.trim();
    document.body.appendChild(wrapper.firstElementChild);
    console.log(LOG_PREFIX, "modal injected:", !!document.getElementById("dossierModal"));
  }
  function sendToWebhook(webhookUrl, payload, callback) {
    console.log(LOG_PREFIX, "sending to webhook", webhookUrl, payload);
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((res) => {
      console.log(LOG_PREFIX, "webhook response", res.status, res.ok);
      callback(res.ok);
    }).catch((err) => {
      console.error(LOG_PREFIX, "error webhook:", err);
      callback(false);
    });
  }
  function detectCourse() {
    let courseId = "curso-desconocido";
    const pathSegments = window.location.pathname.split("/");
    const courseIdx = pathSegments.indexOf("course");
    if (courseIdx !== -1 && pathSegments[courseIdx + 1]) {
      courseId = pathSegments[courseIdx + 1];
    }
    let courseName = "";
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle && metaOgTitle.getAttribute("content")) {
      courseName = metaOgTitle.getAttribute("content");
    } else {
      courseName = document.title.split("|")[0].trim();
    }
    console.log(LOG_PREFIX, "detected course", { courseId, courseName });
    return { courseId, courseName };
  }
  function findRequestType(requestTypes, target) {
    const key = Object.keys(requestTypes).find(
      (typeKey) => target.classList.contains(requestTypes[typeKey].triggerClass)
    );
    return key ? { key, config: requestTypes[key] } : null;
  }
  function init() {
    console.log(LOG_PREFIX, "init() running");
    const config = window.RequestFormConfig || {};
    const webhookUrl = config.webhookUrl;
    const requestTypes = mergeRequestTypes(DEFAULT_REQUEST_TYPES, config.requestTypes);
    console.log(LOG_PREFIX, "config read", {
      hasWebhookUrl: !!webhookUrl,
      triggerClasses: Object.values(requestTypes).map((t) => t.triggerClass)
    });
    if (!webhookUrl) {
      console.error(LOG_PREFIX, "Falta window.RequestFormConfig.webhookUrl antes de cargar este script. El formulario no podr\xE1 enviarse.");
    }
    injectModal();
    const modal = document.getElementById("dossierModal");
    const closeBtn = modal ? modal.querySelector(".dossier-modal-close") : null;
    const form = document.getElementById("dossierForm");
    const titleEl = document.getElementById("dossier-course-title");
    const subtitleEl = document.getElementById("dossier-course-subtitle");
    const submitBtn = document.getElementById("dossier-submit-btn");
    console.log(LOG_PREFIX, "element lookup", {
      modal: !!modal,
      closeBtn: !!closeBtn,
      form: !!form,
      titleEl: !!titleEl,
      subtitleEl: !!subtitleEl,
      submitBtn: !!submitBtn
    });
    if (!modal) {
      console.error(LOG_PREFIX, "#dossierModal not found in DOM after injection, aborting init()");
      return;
    }
    let activeRequestKey = null;
    document.body.addEventListener("click", function(e) {
      if (!e.target) return;
      const triggerSelector = Object.values(requestTypes).map((t) => "." + t.triggerClass).join(", ");
      const closestTrigger = e.target.closest(triggerSelector);
      console.log(LOG_PREFIX, "click detected", {
        tag: e.target.tagName,
        classes: e.target.className,
        exactMatch: !!findRequestType(requestTypes, e.target),
        closestMatch: !!closestTrigger
      });
      const match = findRequestType(requestTypes, e.target);
      if (!match) {
        if (closestTrigger) {
          console.warn(
            LOG_PREFIX,
            "click landed on a child of a trigger element (e.g. an icon/span inside the button) \u2014 exact e.target match failed. Trigger element was:",
            closestTrigger
          );
        }
        return;
      }
      e.preventDefault();
      const btn = e.target;
      const { key: requestKey, config: typeConfig } = match;
      console.log(LOG_PREFIX, "matched request type", requestKey);
      const { courseId, courseName } = detectCourse();
      const pageUrl = window.location.href;
      let loggedInUser = null;
      const utms = getUTMParams();
      if (window.LearnWorlds && window.LearnWorlds.analytics && window.LearnWorlds.analytics.user) {
        loggedInUser = window.LearnWorlds.analytics.user;
      }
      console.log(LOG_PREFIX, "logged in user?", loggedInUser);
      if (loggedInUser && loggedInUser.email) {
        const originalText = btn.innerText;
        btn.innerText = typeConfig.loggedIn.processingLabel;
        btn.disabled = true;
        const payload = {
          email: loggedInUser.email,
          nombre: loggedInUser.name || (loggedInUser.first_name ? loggedInUser.first_name + " " + (loggedInUser.last_name || "") : "Usuario Registrado"),
          course_id: courseId,
          course_name: courseName,
          page_url: pageUrl,
          request_type: typeConfig.payloadType,
          logged_in: true,
          utm_source: utms.utm_source || "",
          utm_medium: utms.utm_medium || "",
          utm_campaign: utms.utm_campaign || "",
          utm_term: utms.utm_term || "",
          utm_content: utms.utm_content || ""
        };
        sendToWebhook(webhookUrl, payload, function(esExitoso) {
          if (esExitoso) {
            btn.innerText = typeConfig.loggedIn.sentLabel;
            alert(typeConfig.loggedIn.successAlert);
          } else {
            btn.innerText = originalText;
            btn.disabled = false;
            alert(typeConfig.loggedIn.errorAlert);
          }
        });
      } else {
        activeRequestKey = requestKey;
        document.getElementById("modal-course-id").value = courseId;
        document.getElementById("modal-course-name").value = courseName;
        document.getElementById("modal-page-url").value = pageUrl;
        titleEl.textContent = typeConfig.modalTitle;
        subtitleEl.innerText = renderTemplate(typeConfig.subtitleTemplate, courseName);
        submitBtn.textContent = typeConfig.submitLabel;
        modal.style.display = "block";
        console.log(LOG_PREFIX, "modal opened, display =", modal.style.display);
      }
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
      });
    }
    window.addEventListener("click", function(e) {
      if (e.target === modal) modal.style.display = "none";
    });
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        const typeConfig = requestTypes[activeRequestKey];
        if (!typeConfig) return;
        if (!validateDossierForm()) {
          console.warn(LOG_PREFIX, "submit blocked by validation");
          return;
        }
        submitBtn.textContent = typeConfig.sendingLabel;
        submitBtn.disabled = true;
        const utms = getUTMParams();
        const payload = {
          email: document.getElementById("dossier-email").value,
          nombre: document.getElementById("dossier-nombre").value,
          course_id: document.getElementById("modal-course-id").value,
          course_name: document.getElementById("modal-course-name").value,
          page_url: document.getElementById("modal-page-url").value,
          request_type: typeConfig.payloadType,
          logged_in: false,
          utm_source: utms.utm_source || "",
          utm_medium: utms.utm_medium || "",
          utm_campaign: utms.utm_campaign || "",
          utm_term: utms.utm_term || "",
          utm_content: utms.utm_content || ""
        };
        sendToWebhook(webhookUrl, payload, function(esExitoso) {
          submitBtn.disabled = false;
          submitBtn.textContent = typeConfig.submitLabel;
          if (esExitoso) {
            modal.style.display = "none";
            form.reset();
            alert(typeConfig.successAlert);
          } else {
            alert(typeConfig.errorAlert);
          }
        });
      });
    }
    console.log(LOG_PREFIX, "init() complete, listeners attached");
  }
  if (document.readyState === "loading") {
    console.log(LOG_PREFIX, "deferring init() until DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
