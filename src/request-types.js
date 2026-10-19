const PLACEHOLDER = /\{\{\s*course\s*\}\}/g;

export function renderTemplate(template, courseName) {
  return template.replace(PLACEHOLDER, courseName);
}

// One entry per trigger button "flavor". Add more here (or via
// window.RequestFormConfig.requestTypes) to support new flows without
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
  // Recursos que gestiona POSSO Admin (no Make): el formulario llama a
  // RequestFormConfig.possoUrl con el código "recurso" dado de alta en
  // POSSO → Configuración → Recursos descargables. Siempre abre el popup
  // (hace falta el consentimiento explícito, también con sesión iniciada).
  // "textoConsentimiento" debe ser el MISMO texto configurado en POSSO.
  incompany: {
    triggerClass: 'btn-incompany-request',
    recurso: 'dossier-incompany',
    camposEmpresa: true,
    textoConsentimiento:
      'Acepto que POSSO trate mis datos para enviarme este recurso y contactarme con información sobre sus formaciones. Puedo darme de baja en cualquier momento.',
    modalTitle: 'Descargar Dossier InCompany',
    subtitleTemplate: 'Te enviaremos por email el dossier de formación InCompany.',
    submitLabel: 'Solicitar Dossier',
    sendingLabel: 'Enviando...',
    successAlert: '¡Gracias! Revisa tu bandeja de entrada, el dossier va en camino.',
    errorAlert: 'Ocurrió un error. Por favor inténtalo de nuevo.',
    loggedIn: {},
  },
  // Solicitud de beca (POSSO Admin → Becas). Los campos NO están aquí: se construyen con la configuración de la
  // convocatoria que da POSSO (GET /api/public/becas/{codigo}). El botón indica la convocatoria con data-beca="codigo" (o
  // RequestFormConfig.becaCodigo) y, si se quiere, un curso ya elegido con data-curso="codigo-del-curso".
  beca: {
    triggerClass: 'btn-beca-request',
    beca: true,
    modalTitle: 'Solicitud de beca',
    subtitleTemplate: '',
    submitLabel: 'Enviar solicitud',
    sendingLabel: 'Enviando...',
    successAlert: '¡Gracias! Hemos recibido tu solicitud. Te hemos enviado un email de confirmación con la fecha de resolución.',
    errorAlert: 'Ocurrió un error. Por favor inténtalo de nuevo.',
    loggedIn: {},
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
