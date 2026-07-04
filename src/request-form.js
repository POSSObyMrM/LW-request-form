import { dossierModalTemplate } from './template.js';
import { getUTMParams } from './utm.js';
import { DEFAULT_REQUEST_TYPES, mergeRequestTypes, renderTemplate } from './request-types.js';

function injectModal() {
  if (document.getElementById('dossierModal')) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = dossierModalTemplate.trim();
  document.body.appendChild(wrapper.firstElementChild);
}

function sendToWebhook(webhookUrl, payload, callback) {
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => callback(res.ok))
    .catch((err) => {
      console.error('[DossierForm] Error Webhook:', err);
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

  return { courseId, courseName };
}

function findRequestType(requestTypes, target) {
  const key = Object.keys(requestTypes).find((typeKey) =>
    target.classList.contains(requestTypes[typeKey].triggerClass)
  );
  return key ? { key, config: requestTypes[key] } : null;
}

function init() {
  const config = window.DossierFormConfig || {};
  const webhookUrl = config.webhookUrl;
  const requestTypes = mergeRequestTypes(DEFAULT_REQUEST_TYPES, config.requestTypes);

  if (!webhookUrl) {
    console.error('[DossierForm] Falta window.DossierFormConfig.webhookUrl antes de cargar este script. El formulario no podrá enviarse.');
  }

  injectModal();

  const modal = document.getElementById('dossierModal');
  const closeBtn = modal.querySelector('.dossier-modal-close');
  const form = document.getElementById('dossierForm');
  const titleEl = document.getElementById('dossier-course-title');
  const subtitleEl = document.getElementById('dossier-course-subtitle');
  const submitBtn = document.getElementById('dossier-submit-btn');

  // Qué tipo de solicitud abrió el modal, para que el submit sepa qué
  // textos/alertas usar y qué request_type mandar al webhook.
  let activeRequestKey = null;

  document.body.addEventListener('click', function (e) {
    if (!e.target) return;
    const match = findRequestType(requestTypes, e.target);
    if (!match) return;
    e.preventDefault();
    const btn = e.target;
    const { key: requestKey, config: typeConfig } = match;

    const { courseId, courseName } = detectCourse();

    let loggedInUser = null;
    const utms = getUTMParams();
    if (window.LearnWorlds && window.LearnWorlds.analytics && window.LearnWorlds.analytics.user) {
      loggedInUser = window.LearnWorlds.analytics.user;
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
