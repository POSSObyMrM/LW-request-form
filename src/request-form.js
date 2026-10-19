import { dossierModalTemplate } from './template.js';
import { getUTMParams } from './utm.js';
import { DEFAULT_REQUEST_TYPES, mergeRequestTypes, renderTemplate } from './request-types.js';
import { abrirBeca, becaCargada, enviarBeca, limpiarFormularioBeca, validarBeca } from './beca-form.js';

const LOG_PREFIX = '[RequestForm]';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSSO_URL_POR_DEFECTO = 'https://admin.posso.es/api/public/recursos/solicitar';

console.log(LOG_PREFIX, 'script parsed, readyState =', document.readyState);

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message || '';
  if (input) input.classList.toggle('dossier-input-invalid', !!message);
}

function validateDossierForm() {
  const nombre = document.getElementById('dossier-nombre').value.trim();
  const email = document.getElementById('dossier-email').value.trim();
  const termsAccepted = document.getElementById('dossier-terms').checked;

  let isValid = true;

  if (!nombre) {
    setFieldError('dossier-nombre', 'dossier-nombre-error', 'Este campo es obligatorio.');
    isValid = false;
  } else {
    setFieldError('dossier-nombre', 'dossier-nombre-error', '');
  }

  if (!email) {
    setFieldError('dossier-email', 'dossier-email-error', 'Este campo es obligatorio.');
    isValid = false;
  } else if (!EMAIL_RE.test(email)) {
    setFieldError('dossier-email', 'dossier-email-error', 'Introduce un correo electrónico válido.');
    isValid = false;
  } else {
    setFieldError('dossier-email', 'dossier-email-error', '');
  }

  if (!termsAccepted) {
    setFieldError('dossier-terms', 'dossier-terms-error', 'Debes aceptar los Términos y la Política de Privacidad.');
    isValid = false;
  } else {
    setFieldError('dossier-terms', 'dossier-terms-error', '');
  }

  console.log(LOG_PREFIX, 'form validation', { nombreOk: !!nombre, emailOk: EMAIL_RE.test(email), termsAccepted, isValid });

  return isValid;
}

function injectModal() {
  if (document.getElementById('dossierModal')) {
    console.log(LOG_PREFIX, '#dossierModal already present, skipping injection');
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = dossierModalTemplate.trim();
  document.body.appendChild(wrapper.firstElementChild);
  console.log(LOG_PREFIX, 'modal injected:', !!document.getElementById('dossierModal'));
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

function generateEventId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // Fallback para navegadores sin crypto.randomUUID (o contextos no seguros)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Datos de seguimiento (Meta CAPI) que viajan en todos los envíos.
function getTrackingFields() {
  return {
    event_id: generateEventId(),
    user_agent: navigator.userAgent || '',
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
  };
}

function sendToWebhook(webhookUrl, payload, callback) {
  payload = Object.assign({}, payload, getTrackingFields());
  console.log(LOG_PREFIX, 'sending to webhook', webhookUrl, payload);
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log(LOG_PREFIX, 'webhook response', res.status, res.ok);
      callback(res.ok);
    })
    .catch((err) => {
      console.error(LOG_PREFIX, 'error webhook:', err);
      callback(false);
    });
}

function detectCourse() {
  let courseId = 'curso-desconocido';
  const pathSegments = window.location.pathname.split('/');
  const courseIdx = pathSegments.indexOf('course');
  if (courseIdx !== -1 && pathSegments[courseIdx + 1]) {
    courseId = pathSegments[courseIdx + 1];
  }

  let courseName = '';
  const metaOgTitle = document.querySelector('meta[property="og:title"]');
  if (metaOgTitle && metaOgTitle.getAttribute('content')) {
    courseName = metaOgTitle.getAttribute('content');
  } else {
    // Fallback: si no encuentra la meta tag, lee el título de la pestaña del navegador
    courseName = document.title.split('|')[0].trim();
  }

  console.log(LOG_PREFIX, 'detected course', { courseId, courseName });
  return { courseId, courseName };
}

// Campos extra (empresa/cargo) y texto de la casilla según el tipo: los
// recursos de POSSO muestran su propio texto de consentimiento; el resto,
// el texto de siempre (Términos y Política de Privacidad).
let textoTerminosOriginal = null;
function prepararCamposRecurso(typeConfig) {
  const conEmpresa = !!(typeConfig.recurso && typeConfig.camposEmpresa);
  document.getElementById('dossier-empresa-group').hidden = !conEmpresa;
  document.getElementById('dossier-cargo-group').hidden = !conEmpresa;
  const etiqueta = document.getElementById('dossier-terms-label');
  if (textoTerminosOriginal === null) textoTerminosOriginal = etiqueta.innerHTML;
  if (typeConfig.recurso && typeConfig.textoConsentimiento) {
    etiqueta.textContent = typeConfig.textoConsentimiento + ' ';
    const enlace = document.createElement('a');
    enlace.href = '/privacy';
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    enlace.textContent = 'Política de Privacidad';
    etiqueta.append('(', enlace, ') *');
  } else {
    etiqueta.innerHTML = textoTerminosOriginal;
  }
}

function findRequestType(requestTypes, target) {
  const key = Object.keys(requestTypes).find((typeKey) =>
    target.classList.contains(requestTypes[typeKey].triggerClass)
  );
  if (key) return { key, config: requestTypes[key], element: target };
  // Las solicitudes de beca también responden a un clic en un hijo del botón (icono, span...).
  const keyBeca = Object.keys(requestTypes).find(
    (typeKey) => requestTypes[typeKey].beca && target.closest('.' + requestTypes[typeKey].triggerClass)
  );
  return keyBeca
    ? { key: keyBeca, config: requestTypes[keyBeca], element: target.closest('.' + requestTypes[keyBeca].triggerClass) }
    : null;
}

function init() {
  console.log(LOG_PREFIX, 'init() running');

  const config = window.RequestFormConfig || {};
  const webhookUrl = config.webhookUrl;
  const requestTypes = mergeRequestTypes(DEFAULT_REQUEST_TYPES, config.requestTypes);

  console.log(LOG_PREFIX, 'config read', {
    hasWebhookUrl: !!webhookUrl,
    triggerClasses: Object.values(requestTypes).map((t) => t.triggerClass),
  });

  if (!webhookUrl) {
    console.error(LOG_PREFIX, 'Falta window.RequestFormConfig.webhookUrl antes de cargar este script. El formulario no podrá enviarse.');
  }

  injectModal();

  const modal = document.getElementById('dossierModal');
  const closeBtn = modal ? modal.querySelector('.dossier-modal-close') : null;
  const form = document.getElementById('dossierForm');
  const titleEl = document.getElementById('dossier-course-title');
  const subtitleEl = document.getElementById('dossier-course-subtitle');
  const submitBtn = document.getElementById('dossier-submit-btn');

  console.log(LOG_PREFIX, 'element lookup', {
    modal: !!modal,
    closeBtn: !!closeBtn,
    form: !!form,
    titleEl: !!titleEl,
    subtitleEl: !!subtitleEl,
    submitBtn: !!submitBtn,
  });

  if (!modal) {
    console.error(LOG_PREFIX, '#dossierModal not found in DOM after injection, aborting init()');
    return;
  }

  // Qué tipo de solicitud abrió el modal, para que el submit sepa qué
  // textos/alertas usar y qué request_type mandar al webhook.
  let activeRequestKey = null;

  document.body.addEventListener('click', function (e) {
    if (!e.target) return;

    const triggerSelector = Object.values(requestTypes)
      .map((t) => '.' + t.triggerClass)
      .join(', ');
    const closestTrigger = e.target.closest(triggerSelector);

    console.log(LOG_PREFIX, 'click detected', {
      tag: e.target.tagName,
      classes: e.target.className,
      exactMatch: !!findRequestType(requestTypes, e.target),
      closestMatch: !!closestTrigger,
    });

    const match = findRequestType(requestTypes, e.target);
    if (!match) {
      if (closestTrigger) {
        console.warn(
          LOG_PREFIX,
          'click landed on a child of a trigger element (e.g. an icon/span inside the button) — exact e.target match failed. Trigger element was:',
          closestTrigger
        );
      }
      return;
    }
    e.preventDefault();
    const btn = match.element;
    const { key: requestKey, config: typeConfig } = match;

    console.log(LOG_PREFIX, 'matched request type', requestKey);

    const { courseId, courseName } = detectCourse();
    const pageUrl = window.location.href;

    let loggedInUser = null;
    const utms = getUTMParams();
    if (window.LearnWorlds && window.LearnWorlds.analytics && window.LearnWorlds.analytics.user) {
      loggedInUser = window.LearnWorlds.analytics.user;
    }

    console.log(LOG_PREFIX, 'logged in user?', loggedInUser);

    if (typeConfig.beca) {
      // CASO D: Solicitud de beca — el formulario se construye con la configuración de la convocatoria (ver beca-form.js).
      activeRequestKey = requestKey;
      document.getElementById('modal-course-id').value = courseId;
      document.getElementById('modal-course-name').value = courseName;
      document.getElementById('modal-page-url').value = pageUrl;
      prepararCamposRecurso(typeConfig);
      abrirBeca({ config, typeConfig, boton: btn, modal, titleEl, subtitleEl, submitBtn, loggedInUser });
      return;
    }

    // Cualquier otro tipo: el modal vuelve a ser el de siempre (por si antes se abrió el de beca).
    limpiarFormularioBeca();

    if (typeConfig.recurso) {
      // CASO C: Recurso de POSSO — siempre popup (consentimiento explícito),
      // con nombre/email ya rellenos si hay sesión iniciada.
      activeRequestKey = requestKey;
      document.getElementById('modal-course-id').value = courseId;
      document.getElementById('modal-course-name').value = courseName;
      document.getElementById('modal-page-url').value = pageUrl;
      if (loggedInUser && loggedInUser.email) {
        document.getElementById('dossier-email').value = loggedInUser.email;
        const nombreSesion = loggedInUser.name || [loggedInUser.first_name, loggedInUser.last_name].filter(Boolean).join(' ');
        if (nombreSesion) document.getElementById('dossier-nombre').value = nombreSesion;
      }
      prepararCamposRecurso(typeConfig);
      titleEl.textContent = typeConfig.modalTitle;
      subtitleEl.innerText = renderTemplate(typeConfig.subtitleTemplate, courseName);
      submitBtn.textContent = typeConfig.submitLabel;
      modal.style.display = 'block';
      return;
    }

    if (loggedInUser && loggedInUser.email) {
      // CASO A: Usuario Logado
      const originalText = btn.innerText;
      btn.innerText = typeConfig.loggedIn.processingLabel;
      btn.disabled = true;

      const payload = {
        email: loggedInUser.email,
        nombre: loggedInUser.name || (loggedInUser.first_name ? loggedInUser.first_name + ' ' + (loggedInUser.last_name || '') : 'Usuario Registrado'),
        course_id: courseId,
        course_name: courseName,
        page_url: pageUrl,
        request_type: typeConfig.payloadType,
        logged_in: true,
        utm_source: utms.utm_source || '',
        utm_medium: utms.utm_medium || '',
        utm_campaign: utms.utm_campaign || '',
        utm_term: utms.utm_term || '',
        utm_content: utms.utm_content || '',
      };

      sendToWebhook(webhookUrl, payload, function (esExitoso) {
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
      // CASO B: Usuario NO Logado (abrir popup y guardar los datos detectados en los campos ocultos)
      activeRequestKey = requestKey;
      document.getElementById('modal-course-id').value = courseId;
      document.getElementById('modal-course-name').value = courseName;
      document.getElementById('modal-page-url').value = pageUrl;
      prepararCamposRecurso(typeConfig);
      titleEl.textContent = typeConfig.modalTitle;
      subtitleEl.innerText = renderTemplate(typeConfig.subtitleTemplate, courseName);
      submitBtn.textContent = typeConfig.submitLabel;
      modal.style.display = 'block';
      console.log(LOG_PREFIX, 'modal opened, display =', modal.style.display);
    }
  });

  // Cerrar el popup
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }
  window.addEventListener('click', function (e) {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Manejar el envío del formulario del popup (para usuarios NO logados)
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const typeConfig = requestTypes[activeRequestKey];
      if (!typeConfig) return;

      if (typeConfig.beca) {
        if (!becaCargada()) return;
        if (!validarBeca()) {
          console.warn(LOG_PREFIX, 'submit blocked by validation (beca)');
          return;
        }
        submitBtn.textContent = typeConfig.sendingLabel;
        submitBtn.disabled = true;
        enviarBeca({ config, utms: getUTMParams(), pageUrl: document.getElementById('modal-page-url').value, tracking: getTrackingFields() }).then((r) => {
          submitBtn.disabled = false;
          submitBtn.textContent = typeConfig.submitLabel;
          if (r.ok) {
            modal.style.display = 'none';
            form.reset();
            limpiarFormularioBeca();
            alert(typeConfig.successAlert);
          } else {
            alert(r.mensaje || typeConfig.errorAlert);
          }
        });
        return;
      }

      if (!validateDossierForm()) {
        console.warn(LOG_PREFIX, 'submit blocked by validation');
        return;
      }

      submitBtn.textContent = typeConfig.sendingLabel;
      submitBtn.disabled = true;
      const utms = getUTMParams();

      const alTerminar = function (esExitoso) {
        submitBtn.disabled = false;
        submitBtn.textContent = typeConfig.submitLabel;
        if (esExitoso) {
          modal.style.display = 'none';
          form.reset();
          alert(typeConfig.successAlert);
        } else {
          alert(typeConfig.errorAlert);
        }
      };

      if (typeConfig.recurso) {
        const valor = (id) => document.getElementById(id).value.trim();
        sendToWebhook(
          config.possoUrl || POSSO_URL_POR_DEFECTO,
          {
            recurso: typeConfig.recurso,
            nombre: valor('dossier-nombre'),
            email: valor('dossier-email'),
            empresa: typeConfig.camposEmpresa ? valor('dossier-empresa') : '',
            cargo: typeConfig.camposEmpresa ? valor('dossier-cargo') : '',
            consentimiento: document.getElementById('dossier-terms').checked,
            website: document.getElementById('dossier-website').value,
            url: valor('modal-page-url'),
            utm_source: utms.utm_source || '',
            utm_medium: utms.utm_medium || '',
            utm_campaign: utms.utm_campaign || '',
            utm_term: utms.utm_term || '',
            utm_content: utms.utm_content || '',
          },
          alTerminar
        );
        return;
      }

      const payload = {
        email: document.getElementById('dossier-email').value,
        nombre: document.getElementById('dossier-nombre').value,
        course_id: document.getElementById('modal-course-id').value,
        course_name: document.getElementById('modal-course-name').value,
        page_url: document.getElementById('modal-page-url').value,
        request_type: typeConfig.payloadType,
        logged_in: false,
        utm_source: utms.utm_source || '',
        utm_medium: utms.utm_medium || '',
        utm_campaign: utms.utm_campaign || '',
        utm_term: utms.utm_term || '',
        utm_content: utms.utm_content || '',
      };

      sendToWebhook(webhookUrl, payload, function (esExitoso) {
        submitBtn.disabled = false;
        submitBtn.textContent = typeConfig.submitLabel;
        if (esExitoso) {
          modal.style.display = 'none';
          form.reset();
          alert(typeConfig.successAlert);
        } else {
          alert(typeConfig.errorAlert);
        }
      });
    });
  }

  console.log(LOG_PREFIX, 'init() complete, listeners attached');
}

if (document.readyState === 'loading') {
  console.log(LOG_PREFIX, 'deferring init() until DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
