import { dossierModalTemplate } from './template.js';
import { getUTMParams } from './utm.js';
import { DEFAULT_REQUEST_TYPES, mergeRequestTypes, renderTemplate } from './request-types.js';

const LOG_PREFIX = '[RequestForm]';

console.log(LOG_PREFIX, 'script parsed, readyState =', document.readyState);

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

function sendToWebhook(webhookUrl, payload, callback) {
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

function findRequestType(requestTypes, target) {
  const key = Object.keys(requestTypes).find((typeKey) =>
    target.classList.contains(requestTypes[typeKey].triggerClass)
  );
  return key ? { key, config: requestTypes[key] } : null;
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
    const btn = e.target;
    const { key: requestKey, config: typeConfig } = match;

    console.log(LOG_PREFIX, 'matched request type', requestKey);

    const { courseId, courseName } = detectCourse();

    let loggedInUser = null;
    const utms = getUTMParams();
    if (window.LearnWorlds && window.LearnWorlds.analytics && window.LearnWorlds.analytics.user) {
      loggedInUser = window.LearnWorlds.analytics.user;
    }

    console.log(LOG_PREFIX, 'logged in user?', loggedInUser);

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

      submitBtn.textContent = typeConfig.sendingLabel;
      submitBtn.disabled = true;
      const utms = getUTMParams();

      const payload = {
        email: document.getElementById('dossier-email').value,
        nombre: document.getElementById('dossier-nombre').value,
        course_id: document.getElementById('modal-course-id').value,
        course_name: document.getElementById('modal-course-name').value,
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
