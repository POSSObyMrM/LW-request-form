const PLACEHOLDER = /\{\{\s*course\s*\}\}/g;

export function renderTemplate(template, courseName) {
  return template.replace(PLACEHOLDER, courseName);
}

// One entry per trigger button "flavor". Add more here (or via
// window.DossierFormConfig.requestTypes) to support new flows without
// touching the HTML or the click/submit logic.
export const DEFAULT_REQUEST_TYPES = {
  dossier: {
    triggerClass: 'btn-dossier-request',
    payloadType: 'dossier',
    modalTitle: 'Descargar Dossier',
    subtitleTemplate: 'Te enviaremos el dossier del {{course}}.',
    submitLabel: 'Solicitar Dossier',
    sendingLabel: 'Enviando...',
    successAlert: '¡Gracias! Revisa tu bandeja de entrada, el dossier va en camino.',
    errorAlert: 'Ocurrió un error. Por favor inténtalo de nuevo.',
    loggedIn: {
      processingLabel: 'Procesando...',
      sentLabel: '¡Enviado!',
      successAlert: '¡Listo! Te acabamos de enviar el dossier a tu correo electrónico.',
      errorAlert: 'Hubo un problema. Por favor, inténtalo de nuevo.',
    },
  },
  info: {
    triggerClass: 'btn-info-request',
    payloadType: 'info',
    modalTitle: 'Avisarme de Novedades',
    subtitleTemplate: 'Te avisaremos en cuanto haya novedades sobre el {{course}}.',
    submitLabel: 'Avisarme',
    sendingLabel: 'Enviando...',
    successAlert: '¡Gracias! Te avisaremos en cuanto tengamos novedades.',
    errorAlert: 'Ocurrió un error. Por favor inténtalo de nuevo.',
    loggedIn: {
      processingLabel: 'Procesando...',
      sentLabel: '¡Enviado!',
      successAlert: '¡Listo! Te avisaremos por correo en cuanto haya novedades.',
      errorAlert: 'Hubo un problema. Por favor, inténtalo de nuevo.',
    },
  },
};

export function mergeRequestTypes(defaults, overrides) {
  const result = {};
  const keys = new Set([...Object.keys(defaults), ...Object.keys(overrides || {})]);
  keys.forEach((key) => {
    const base = defaults[key] || {};
    const override = (overrides && overrides[key]) || {};
    result[key] = {
      ...base,
      ...override,
      loggedIn: { ...(base.loggedIn || {}), ...(override.loggedIn || {}) },
    };
  });
  return result;
}
