// Formulario de solicitud de beca. A diferencia de los demás tipos de solicitud, sus campos no están escritos aquí: se
// construyen con la configuración de la convocatoria que da POSSO Admin (GET /api/public/becas/{codigo}): cursos con su
// plazo, preguntas y textos legales. Así una convocatoria nueva (otra beca, otras fechas, otras preguntas) se da de alta
// en POSSO Admin → Becas sin tocar este script.
//
// Reutiliza el modal de siempre (#dossierModal): los campos nombre, email y casilla de términos son los estáticos de la
// plantilla; el resto (teléfono, curso, preguntas, declaración responsable) se pinta en #beca-extra-fields. Todo el
// contenido que viene del servidor se inserta con textContent, nunca como HTML.

const LOG_PREFIX = '[RequestForm:beca]';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSSO_BASE_POR_DEFECTO = 'https://admin.posso.es';
const URL_RE = /(https?:\/\/[^\s)]+)/g;

let estado = null; // { codigo, config, campos }
let etiquetaNombreOriginal = null;

function el(tag, attrs, hijos) {
  const nodo = document.createElement(tag);
  Object.keys(attrs || {}).forEach((k) => {
    if (k === 'text') nodo.textContent = attrs[k];
    else if (k === 'class') nodo.className = attrs[k];
    else nodo.setAttribute(k, attrs[k]);
  });
  (hijos || []).forEach((h) => nodo.append(h));
  return nodo;
}

export function possoBase(config) {
  let base = config.possoBaseUrl;
  if (!base && config.possoUrl) {
    try {
      base = new URL(config.possoUrl).origin;
    } catch (e) {
      base = null;
    }
  }
  return (base || POSSO_BASE_POR_DEFECTO).replace(/\/+$/, '');
}

// Texto con enlaces: las URL http(s) se convierten en <a>, el resto va como texto.
function conEnlaces(texto) {
  const nodos = [];
  let ultimo = 0;
  texto.replace(URL_RE, (url, _g, indice) => {
    if (indice > ultimo) nodos.push(texto.slice(ultimo, indice));
    nodos.push(el('a', { href: url, target: '_blank', rel: 'noopener', text: url }));
    ultimo = indice + url.length;
    return url;
  });
  if (ultimo < texto.length) nodos.push(texto.slice(ultimo));
  return nodos;
}

function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' });
}

function fechaHoraCorta(iso) {
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });
}

function setError(campo, mensaje) {
  const error = document.getElementById(campo.errorId);
  if (error) error.textContent = mensaje || '';
  (campo.marcar || []).forEach((id) => {
    const nodo = document.getElementById(id);
    if (nodo) nodo.classList.toggle('dossier-input-invalid', !!mensaje);
  });
}

function grupo(campo, etiquetaTexto, control, ayuda) {
  const label = el('label', { for: campo.id, text: etiquetaTexto + (campo.obligatorio ? ' *' : '') });
  const hijos = [label, control];
  if (ayuda) hijos.push(el('small', { class: 'dossier-field-hint', id: campo.id + '-hint', text: ayuda }));
  hijos.push(el('span', { class: 'dossier-field-error', id: campo.errorId }));
  return el('div', { class: 'dossier-input-group' }, hijos);
}

function pintarPregunta(p) {
  const id = 'beca-q-' + p.clave;
  const campo = { id, errorId: id + '-error', clave: p.clave, tipo: p.tipo, obligatorio: !!p.obligatorio, maxCaracteres: p.maxCaracteres || null, opciones: p.opciones || [], etiqueta: p.etiqueta, marcar: [id] };
  if (p.tipo === 'select') {
    const select = el('select', { id }, [el('option', { value: '', text: 'Selecciona una opción' })]);
    campo.opciones.forEach((o) => select.append(el('option', { value: o, text: o })));
    return { campo, nodo: grupo(campo, p.etiqueta, select, p.ayuda) };
  }
  if (p.tipo === 'radio') {
    const opciones = el('div', { class: 'dossier-radio-group', id, role: 'radiogroup' });
    campo.opciones.forEach((o, i) => {
      const input = el('input', { type: 'radio', name: id, id: id + '-' + i, value: o });
      opciones.append(el('label', { class: 'dossier-radio-option', for: id + '-' + i }, [input, ' ' + o]));
    });
    campo.marcar = [];
    const g = grupo(campo, p.etiqueta, opciones, p.ayuda);
    // La etiqueta de un grupo de opciones no apunta a un control concreto.
    g.querySelector('label').removeAttribute('for');
    return { campo, nodo: g };
  }
  if (p.tipo === 'textarea') {
    const area = el('textarea', { id, rows: '4' });
    if (campo.maxCaracteres) area.setAttribute('maxlength', String(campo.maxCaracteres));
    const g = grupo(campo, p.etiqueta, area, p.ayuda);
    if (campo.maxCaracteres) {
      const contador = el('span', { class: 'dossier-char-count', id: id + '-count', text: '0/' + campo.maxCaracteres });
      area.addEventListener('input', () => {
        contador.textContent = area.value.length + '/' + campo.maxCaracteres;
      });
      g.insertBefore(contador, g.querySelector('.dossier-field-error'));
    }
    return { campo, nodo: g };
  }
  const input = el('input', { type: 'text', id });
  if (campo.maxCaracteres) input.setAttribute('maxlength', String(campo.maxCaracteres));
  return { campo, nodo: grupo(campo, p.etiqueta, input, p.ayuda) };
}

function valorCampo(campo) {
  if (campo.tipo === 'radio') {
    const marcado = document.querySelector('input[name="' + campo.id + '"]:checked');
    return marcado ? marcado.value : '';
  }
  const nodo = document.getElementById(campo.id);
  return nodo ? nodo.value.trim() : '';
}

function contenedor() {
  const form = document.getElementById('dossierForm');
  let caja = document.getElementById('beca-extra-fields');
  if (!caja) {
    caja = el('div', { id: 'beca-extra-fields' });
    const trampa = document.getElementById('dossier-website');
    form.insertBefore(caja, trampa);
  }
  return caja;
}

// Pinta el formulario con la configuración de la convocatoria.
function pintar(config, becaConfig, cursoPreseleccionado) {
  const caja = contenedor();
  caja.hidden = false;
  caja.replaceChildren();
  const campos = [];

  // Nombre: «Nombre y apellidos».
  const etiquetaNombre = document.querySelector('label[for="dossier-nombre"]');
  if (etiquetaNombre) {
    if (etiquetaNombreOriginal === null) etiquetaNombreOriginal = etiquetaNombre.textContent;
    etiquetaNombre.textContent = 'Nombre y apellidos *';
  }

  // Teléfono.
  const telefono = { id: 'beca-telefono', errorId: 'beca-telefono-error', clave: 'telefono', tipo: 'tel', obligatorio: true, marcar: ['beca-telefono'], etiqueta: 'Teléfono' };
  caja.append(grupo(telefono, 'Teléfono', el('input', { type: 'tel', id: 'beca-telefono', autocomplete: 'tel' })));
  campos.push(telefono);

  // Curso.
  const curso = { id: 'beca-curso', errorId: 'beca-curso-error', clave: 'curso', tipo: 'select', obligatorio: true, marcar: ['beca-curso'], etiqueta: 'Curso' };
  const select = el('select', { id: 'beca-curso' }, [el('option', { value: '', text: 'Selecciona un curso' })]);
  becaConfig.cursos.forEach((c) => {
    const opcion = el('option', { value: c.codigo, text: c.nombre + (c.abierto ? ' (cierre ' + fechaCorta(c.cierre) + ')' : ' (plazo cerrado)') });
    if (!c.abierto) opcion.disabled = true;
    select.append(opcion);
  });
  const grupoCurso = grupo(curso, 'Curso al que solicitas la beca', select);
  const info = el('div', { class: 'dossier-field-hint', id: 'beca-curso-info' });
  grupoCurso.insertBefore(info, grupoCurso.querySelector('.dossier-field-error'));
  caja.append(grupoCurso);
  campos.push(curso);
  select.addEventListener('change', () => {
    const c = becaConfig.cursos.find((x) => x.codigo === select.value);
    const partes = [];
    if (c) {
      partes.push('Cierre de solicitudes: ' + fechaHoraCorta(c.cierre) + '. Resolución: ' + fechaCorta(c.fechaResolucion) + '.');
      if (c.requisitos) partes.push('Requisitos técnicos: ' + c.requisitos);
    }
    info.textContent = partes.join(' ');
  });

  // Preguntas de la convocatoria.
  becaConfig.preguntas.forEach((p) => {
    const { campo, nodo } = pintarPregunta(p);
    caja.append(nodo);
    campos.push(campo);
  });

  // Declaración responsable (casilla).
  const declaracion = { id: 'beca-declaracion', errorId: 'beca-declaracion-error', clave: 'declaracion', tipo: 'checkbox', obligatorio: true, marcar: [], etiqueta: 'Declaración responsable' };
  const caja2 = el('div', { class: 'lead-form__optin-checkbox' }, [
    el('label', { for: 'beca-declaracion', class: 'checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left' }, [
      el('input', { class: 'checkbox flexible-part js-optin-checkbox', type: 'checkbox', id: 'beca-declaracion' }),
      el('div', { class: 'checkbox-box lw-border-color-fadeout80 flexible-part' }, [el('span', { class: 'learnworlds-icon learnworlds-heading3-small fas fa-check' })]),
      el('div', { class: 'flexible-part' }, [...conEnlaces(becaConfig.textoDeclaracion), ' *']),
    ]),
    el('span', { class: 'dossier-field-error', id: 'beca-declaracion-error' }),
  ]);
  caja.append(caja2);
  campos.push(declaracion);

  // Casilla de protección de datos: la estática de la plantilla, con el texto de la convocatoria.
  const etiquetaTerminos = document.getElementById('dossier-terms-label');
  etiquetaTerminos.replaceChildren(...conEnlaces(becaConfig.textoConsentimiento), ' *');
  campos.push({ id: 'dossier-terms', errorId: 'dossier-terms-error', clave: 'consentimiento', tipo: 'checkbox', obligatorio: true, marcar: [] });

  // Preselección del curso (data-curso del botón).
  if (cursoPreseleccionado) {
    const c = becaConfig.cursos.find((x) => x.codigo === cursoPreseleccionado);
    if (c && c.abierto) {
      select.value = c.codigo;
      select.dispatchEvent(new Event('change'));
    }
  }

  estado = { config: becaConfig, campos };
}

// Deja el modal como lo necesitan los demás tipos de solicitud.
export function limpiarFormularioBeca() {
  const caja = document.getElementById('beca-extra-fields');
  if (caja) {
    caja.replaceChildren();
    caja.hidden = true;
  }
  const etiquetaNombre = document.querySelector('label[for="dossier-nombre"]');
  if (etiquetaNombre && etiquetaNombreOriginal !== null) etiquetaNombre.textContent = etiquetaNombreOriginal;
  ['dossier-terms-error', 'dossier-nombre-error', 'dossier-email-error'].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.textContent = '';
  });
  estado = null;
}

// Abre el formulario de beca: muestra el modal en el acto y lo rellena cuando llega la configuración.
export function abrirBeca({ config, boton, modal, titleEl, subtitleEl, submitBtn, loggedInUser }) {
  const codigo = (boton.getAttribute('data-beca') || config.becaCodigo || '').trim();
  const cursoPre = (boton.getAttribute('data-curso') || '').trim();
  if (!codigo) {
    console.error(LOG_PREFIX, 'Falta data-beca en el botón (o RequestFormConfig.becaCodigo): no se sabe de qué convocatoria es.');
    alert('No hemos podido abrir el formulario. Por favor, inténtalo de nuevo más tarde.');
    return;
  }

  limpiarFormularioBeca();
  titleEl.textContent = 'Solicitud de beca';
  subtitleEl.textContent = 'Cargando el formulario…';
  submitBtn.disabled = true;
  modal.style.display = 'block';

  fetch(possoBase(config) + '/api/public/becas/' + encodeURIComponent(codigo), { headers: { Accept: 'application/json' } })
    .then((res) => res.json().then((cuerpo) => ({ ok: res.ok, cuerpo })))
    .then(({ ok, cuerpo }) => {
      if (!ok || !cuerpo || !cuerpo.config) throw new Error('config no disponible');
      const becaConfig = cuerpo.config;
      becaConfig.codigo = becaConfig.codigo || codigo;
      titleEl.textContent = becaConfig.titulo;
      subtitleEl.textContent = becaConfig.introduccion || '';
      pintar(config, becaConfig, cursoPre);
      estado.codigo = becaConfig.codigo;
      if (loggedInUser && loggedInUser.email) {
        document.getElementById('dossier-email').value = loggedInUser.email;
        const nombre = loggedInUser.name || [loggedInUser.first_name, loggedInUser.last_name].filter(Boolean).join(' ');
        if (nombre) document.getElementById('dossier-nombre').value = nombre;
      }
      const hayAbiertos = becaConfig.cursos.some((c) => c.abierto);
      if (!hayAbiertos) {
        subtitleEl.textContent = 'El plazo de solicitud de todos los cursos de esta convocatoria ha terminado.';
        submitBtn.disabled = true;
      } else {
        submitBtn.disabled = false;
      }
    })
    .catch((err) => {
      console.error(LOG_PREFIX, 'no se pudo cargar la convocatoria', err);
      subtitleEl.textContent = 'No hemos podido cargar el formulario. Inténtalo de nuevo en unos minutos.';
    });
}

export function becaCargada() {
  return !!estado;
}

// Valida todo el formulario de beca; marca los errores bajo cada campo. Devuelve true si se puede enviar.
export function validarBeca() {
  if (!estado) return false;
  let valido = true;
  const nombre = document.getElementById('dossier-nombre').value.trim();
  const email = document.getElementById('dossier-email').value.trim();
  const fallo = (campo, mensaje) => {
    setError(campo, mensaje);
    if (mensaje) valido = false;
  };
  fallo({ errorId: 'dossier-nombre-error', marcar: ['dossier-nombre'] }, nombre.length < 2 ? 'Este campo es obligatorio.' : '');
  fallo({ errorId: 'dossier-email-error', marcar: ['dossier-email'] }, !email ? 'Este campo es obligatorio.' : !EMAIL_RE.test(email) ? 'Introduce un correo electrónico válido.' : '');

  estado.campos.forEach((c) => {
    if (c.clave === 'consentimiento') {
      fallo(c, document.getElementById('dossier-terms').checked ? '' : 'Debes aceptar la protección de datos para continuar.');
      return;
    }
    if (c.clave === 'declaracion') {
      fallo(c, document.getElementById('beca-declaracion').checked ? '' : 'Debes aceptar la declaración responsable.');
      return;
    }
    const valor = c.tipo === 'tel' || c.tipo === 'select' || c.tipo === 'radio' || c.tipo === 'textarea' || c.tipo === 'texto' ? valorCampo(c) : '';
    if (!valor) {
      fallo(c, c.obligatorio ? (c.tipo === 'select' || c.tipo === 'radio' ? 'Selecciona una opción.' : 'Este campo es obligatorio.') : '');
      return;
    }
    if (c.clave === 'telefono' && valor.replace(/[^\d]/g, '').length < 6) return fallo(c, 'Introduce un teléfono válido.');
    if (c.maxCaracteres && valor.length > c.maxCaracteres) return fallo(c, 'Máximo ' + c.maxCaracteres + ' caracteres.');
    fallo(c, '');
  });
  console.log(LOG_PREFIX, 'validación', { valido });
  return valido;
}

function postJson(url, payload) {
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then((res) => res.json().catch(() => ({})).then((cuerpo) => ({ ok: res.ok, status: res.status, cuerpo })))
    .catch((err) => {
      console.error(LOG_PREFIX, 'error de red', err);
      return { ok: false, status: 0, cuerpo: {} };
    });
}

// Envía la solicitud a POSSO Admin. Resuelve { ok, mensaje } con el aviso a enseñar si falla.
export async function enviarBeca({ config, utms, pageUrl, tracking }) {
  const respuestas = {};
  estado.campos.forEach((c) => {
    if (c.clave === 'telefono' || c.clave === 'curso' || c.clave === 'declaracion' || c.clave === 'consentimiento') return;
    const v = valorCampo(c);
    if (v) respuestas[c.clave] = v;
  });
  const payload = Object.assign(
    {
      convocatoria: estado.codigo,
      curso: document.getElementById('beca-curso').value,
      nombre: document.getElementById('dossier-nombre').value.trim(),
      email: document.getElementById('dossier-email').value.trim(),
      telefono: document.getElementById('beca-telefono').value.trim(),
      respuestas,
      declaracion: document.getElementById('beca-declaracion').checked,
      consentimiento: document.getElementById('dossier-terms').checked,
      website: document.getElementById('dossier-website').value,
      url: pageUrl,
      utm_source: utms.utm_source || '',
      utm_medium: utms.utm_medium || '',
      utm_campaign: utms.utm_campaign || '',
      utm_term: utms.utm_term || '',
      utm_content: utms.utm_content || '',
    },
    tracking
  );
  console.log(LOG_PREFIX, 'enviando solicitud', payload.convocatoria, payload.curso);
  const r = await postJson(possoBase(config) + '/api/public/becas/solicitar', payload);
  if (r.ok) return { ok: true };
  if (r.status === 409) return { ok: false, mensaje: (r.cuerpo && r.cuerpo.error) || 'El plazo de solicitud de este curso ha terminado.' };
  if (r.status === 400) {
    const claves = (r.cuerpo && r.cuerpo.campos) || [];
    estado.campos.forEach((c) => {
      if (claves.indexOf(c.clave) !== -1) setError(c, 'Revisa este campo.');
    });
    return { ok: false, mensaje: 'Revisa los campos marcados e inténtalo de nuevo.' };
  }
  return { ok: false, mensaje: null };
}
