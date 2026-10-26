import { AREAS, ARQUETIPOS, CASOS, ESCALA, INTRO, PREGUNTAS, TEXTOS_RESULTADO as T } from './datos.js';
import { CENTRO, VERTICES, geometriaTriangulo, propuestaPartes, resultadoDe, respuestasValidas } from './calculo.js';
import { getUTMParams } from '../utm.js';

// Autodiagnóstico InCompany. Script independiente de request-form.js: se enlaza aparte en LearnWorlds.
//
// Se abre con cualquier elemento con la clase «btn-autodiagnostico» (o un enlace a «#autodiagnostico»), o desde
// código con window.PossoAutodiagnostico.abrir(). Si en este navegador ya se respondió, abre directamente el
// resultado; si no, la primera pregunta. El resultado (respuestas + fecha) se guarda en localStorage: no viaja en
// cada petición como una cookie y no caduca solo. Desde el resultado se pueden ver y cambiar las respuestas (se
// recalcula y se vuelve a guardar) o repetir el diagnóstico (se borra).
//
// Configuración opcional, antes de cargar el script:
//   window.AutodiagnosticoConfig = {
//     calendlyUrl: 'https://calendly.com/…',            // botón «Reservar una llamada» (sin él, no se muestra)
//     possoUrl: 'https://…/api/public/leads/autodiagnostico', // a dónde manda «Escríbenos» (por defecto, POSSO Admin)
//     onLeadMagnet: function (datos) { return promesa },// envío del recurso (datos.email + resultado)
//     onContacto: function (datos) { return promesa },  // sustituye el envío a POSSO (nombre, email, empresa… + resultado)
//   };
// Sin onLeadMagnet el formulario del recurso solo avisa de que aún no está conectado. «Escríbenos» manda a POSSO Admin
// los datos y el diagnóstico completo (oportunidad + tarea de seguimiento), salvo que haya onContacto.
// Eventos en document: posso:autodiagnostico:{inicio, completado, actualizado, lead-magnet, contacto, llamada}
// (detail = datos del resultado), y en window.dataLayer (Google Tag Manager) si existe.
//
// Estilos: LW-styles, src/partials/dynamic/_autodiagnostico.less (clases autodiag-*, sobre el modal dossier-*).

const CLAVE_ALMACEN = 'posso_autodiagnostico_incompany';
const VERSION = 1;
const CLASE_DISPARADOR = 'btn-autodiagnostico';
const ANCLA = '#autodiagnostico';
const POSSO_URL_POR_DEFECTO = 'https://admin.posso.es/api/public/leads/autodiagnostico';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SVG = 'http://www.w3.org/2000/svg';
// Logos de los casos: public/casos/ del mismo sitio desde el que se sirve este script (GitHub Pages, jsDelivr o local).
const LOGOS_CASOS = (() => {
  try {
    return new URL('../public/casos/', document.currentScript.src).href;
  } catch (e) {
    return 'https://possobymrm.github.io/LW-request-form/public/casos/';
  }
})();

let modal = null;
let contenido = null;
let disparador = null;
let respuestas = [];
let actual = 0;
let emailRecordado = '';

function config() {
  return window.AutodiagnosticoConfig || {};
}

function el(tag, attrs, hijos) {
  const nodo = document.createElement(tag);
  Object.keys(attrs || {}).forEach((k) => {
    const v = attrs[k];
    if (v === undefined || v === null || v === false) return;
    if (k === 'text') nodo.textContent = v;
    else if (k === 'class') nodo.className = v;
    else if (k.startsWith('on')) nodo.addEventListener(k.slice(2), v);
    else nodo.setAttribute(k, v === true ? '' : v);
  });
  (hijos || []).forEach((h) => h && nodo.append(h));
  return nodo;
}

function svg(tag, attrs, hijos) {
  const nodo = document.createElementNS(SVG, tag);
  Object.keys(attrs || {}).forEach((k) => {
    if (k === 'text') nodo.textContent = attrs[k];
    else nodo.setAttribute(k, attrs[k]);
  });
  (hijos || []).forEach((h) => h && nodo.append(h));
  return nodo;
}

// --- Almacén -------------------------------------------------------------------------------------------------------

function leerGuardado() {
  try {
    const g = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN) || 'null');
    if (g && g.version === VERSION && respuestasValidas(g.respuestas) && !isNaN(new Date(g.fecha))) return g;
  } catch (e) {
    /* almacenamiento bloqueado o dato corrupto: como si no hubiera */
  }
  return null;
}

// «previo»: lo ya guardado (al cambiar respuestas se conserva que ya escribió por «Escríbenos»).
function guardar(resps, previo) {
  const r = resultadoDe(resps);
  const g = { version: VERSION, fecha: new Date().toISOString(), respuestas: resps, arquetipo: r.arquetipo, puntuaciones: r.puntuaciones };
  if (previo && previo.contacto) g.contacto = previo.contacto;
  escribirGuardado(g);
  return g;
}

function escribirGuardado(g) {
  try {
    window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(g));
  } catch (e) {
    /* sin almacenamiento: el resultado se ve igual, solo no se recordará */
  }
}

function borrarGuardado() {
  try {
    window.localStorage.removeItem(CLAVE_ALMACEN);
  } catch (e) {
    /* nada que borrar */
  }
}

function emitir(nombre, detalle) {
  document.dispatchEvent(new CustomEvent('posso:autodiagnostico:' + nombre, { detail: detalle }));
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'autodiagnostico_' + nombre.replace(/-/g, '_'), autodiagnostico_arquetipo: detalle && detalle.arquetipoNombre });
  }
}

// --- Modal ---------------------------------------------------------------------------------------------------------

function crearModal() {
  if (modal) return;
  contenido = el('div', { class: 'autodiag-contenido', 'aria-live': 'polite' });
  modal = el('div', { id: 'autodiagModal', class: 'dossier-modal-container autodiag-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'autodiag-titulo' }, [
    el('div', { class: 'dossier-modal-box autodiag-box' }, [
      el('button', { type: 'button', class: 'dossier-modal-close autodiag-cerrar', 'aria-label': 'Cerrar', text: '×', onclick: cerrar }),
      contenido,
    ]),
  ]);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && estaAbierto()) cerrar();
  });
  document.body.appendChild(modal);
}

// Sustituye el contenido del modal; los bloques opcionales que no tocan (null) se descartan.
function pintar(...bloques) {
  contenido.replaceChildren(...bloques.filter(Boolean));
}

function estaAbierto() {
  return !!modal && modal.style.display === 'block';
}

export function abrir(origen) {
  crearModal();
  disparador = origen || document.activeElement;
  const guardado = leerGuardado();
  if (guardado) pintarResultado(guardado);
  else empezar();
  modal.style.display = 'block';
  arriba();
}

function cerrar() {
  if (!modal) return;
  modal.style.display = 'none';
  if (disparador && typeof disparador.focus === 'function') disparador.focus();
}

function arriba() {
  modal.scrollTop = 0;
  const destino = contenido.querySelector('[data-foco]') || modal.querySelector('.autodiag-cerrar');
  if (destino) destino.focus({ preventScroll: true });
}

// --- Preguntas -----------------------------------------------------------------------------------------------------

function empezar() {
  respuestas = new Array(PREGUNTAS.length).fill(null);
  actual = 0;
  pintarPregunta();
}

// Opciones de una pregunta como grupo de radio con botones.
function grupoOpciones(indice, elegida, alElegir) {
  const p = PREGUNTAS[indice];
  const opciones = p.tipo === 'escala' ? ESCALA : p.opciones.map((o) => o.texto);
  const grupo = el(
    'div',
    {
      class: 'autodiag-opciones autodiag-opciones-' + (p.tipo === 'escala' ? 'escala' : 'lista'),
      role: 'radiogroup',
      'aria-labelledby': 'autodiag-pregunta-' + indice,
    },
    opciones.map((texto, i) =>
      el('button', {
        type: 'button',
        class: 'autodiag-opcion' + (elegida === i ? ' is-elegida' : ''),
        role: 'radio',
        'aria-checked': elegida === i ? 'true' : 'false',
        'data-indice': String(i),
        text: texto,
        onclick: () => alElegir(i),
      }),
    ),
  );
  // Flechas para moverse entre opciones (patrón de radiogroup).
  grupo.addEventListener('keydown', (e) => {
    const botones = Array.from(grupo.querySelectorAll('.autodiag-opcion'));
    const i = botones.indexOf(document.activeElement);
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (i < 0 || !delta) return;
    e.preventDefault();
    botones[(i + delta + botones.length) % botones.length].focus();
  });
  return grupo;
}

function pintarPregunta() {
  const p = PREGUNTAS[actual];
  const total = PREGUNTAS.length;
  const grupo = grupoOpciones(actual, respuestas[actual], responder);
  const foco = grupo.querySelectorAll('.autodiag-opcion')[respuestas[actual] ?? 0];
  if (foco) foco.setAttribute('data-foco', '');

  pintar(
    el('div', { class: 'autodiag-cabecera' }, [
      el('p', { class: 'autodiag-eyebrow', text: 'POSSO In Company' }),
      el('h2', { id: 'autodiag-titulo', class: 'autodiag-titulo learnworlds-subheading learnworlds-subheading-small', text: INTRO.titulo }),
      el('p', { class: 'autodiag-subtitulo learnworlds-main-text', text: INTRO.subtitulo }),
    ]),
    el('div', { class: 'autodiag-progreso' }, [
      el('span', { class: 'autodiag-progreso-texto', text: 'Pregunta ' + (actual + 1) + ' de ' + total }),
      el('div', { class: 'autodiag-progreso-barra', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(actual + 1) }, [
        el('div', { class: 'autodiag-progreso-relleno', style: 'width:' + ((actual + 1) / total) * 100 + '%' }),
      ]),
    ]),
    el('h3', { id: 'autodiag-pregunta-' + actual, class: 'autodiag-pregunta', text: p.texto }),
    grupo,
    el('div', { class: 'autodiag-navegacion' }, [
      actual > 0 ? el('button', { type: 'button', class: 'autodiag-boton-texto', text: '← Anterior', onclick: anterior }) : el('span'),
    ]),
  );
}

let avanzando = false;
function responder(i) {
  if (avanzando) return;
  const primera = respuestas.every((r) => r === null);
  respuestas[actual] = i;
  pintarPregunta();
  if (primera) emitir('inicio', null);
  // Pausa breve para que se vea la opción elegida antes de pasar.
  avanzando = true;
  setTimeout(() => {
    avanzando = false;
    if (actual < PREGUNTAS.length - 1) {
      actual++;
      pintarPregunta();
      arriba();
    } else {
      const guardado = guardar(respuestas.slice());
      pintarResultado(guardado);
      arriba();
      emitir('completado', detalleResultado(guardado));
    }
  }, 220);
}

function anterior() {
  if (actual === 0) return;
  actual--;
  pintarPregunta();
  arriba();
}

// --- Ver y cambiar respuestas --------------------------------------------------------------------------------------

function pintarRespuestas(guardado) {
  const borrador = guardado.respuestas.slice();
  const botonGuardar = el('button', { type: 'button', class: 'autodiag-boton', text: 'Guardar cambios', disabled: true, onclick: () => {
    const nuevo = guardar(borrador.slice(), guardado);
    pintarResultado(nuevo);
    arriba();
    emitir('actualizado', detalleResultado(nuevo));
  } });
  const cambiado = () => borrador.some((r, i) => r !== guardado.respuestas[i]);

  // Una pregunta por fila: el enunciado y un desplegable con la respuesta elegida.
  const lista = el('ol', { class: 'autodiag-respuestas' }, PREGUNTAS.map((p, i) => {
    const opciones = p.tipo === 'escala' ? ESCALA : p.opciones.map((o) => o.texto);
    const select = el('select', { id: 'autodiag-respuesta-' + i, class: 'autodiag-select' },
      opciones.map((texto, k) => el('option', { value: String(k), text: texto, selected: borrador[i] === k })));
    select.addEventListener('change', () => {
      borrador[i] = Number(select.value);
      select.classList.toggle('is-cambiado', borrador[i] !== guardado.respuestas[i]);
      botonGuardar.disabled = !cambiado();
    });
    return el('li', { class: 'autodiag-respuesta' }, [
      el('label', { for: 'autodiag-respuesta-' + i, class: 'autodiag-respuesta-pregunta', text: i + 1 + '. ' + p.texto }),
      select,
    ]);
  }));

  pintar(
    el('div', { class: 'autodiag-cabecera' }, [
      el('p', { class: 'autodiag-eyebrow', text: T.eyebrow }),
      el('h2', { id: 'autodiag-titulo', class: 'autodiag-titulo learnworlds-subheading learnworlds-subheading-small', 'data-foco': true, tabindex: '-1', text: 'Tus respuestas' }),
      el('p', { class: 'autodiag-subtitulo learnworlds-main-text', text: 'Cambia las que quieras y guarda: el diagnóstico se recalcula con tus nuevas respuestas.' }),
    ]),
    lista,
    el('div', { class: 'autodiag-acciones autodiag-acciones-respuestas' }, [
      botonGuardar,
      el('button', { type: 'button', class: 'autodiag-boton-texto', text: 'Volver sin cambiar nada', onclick: () => {
        pintarResultado(guardado);
        arriba();
      } }),
    ]),
  );
}

// --- Resultado -----------------------------------------------------------------------------------------------------

function detalleResultado(guardado) {
  const r = resultadoDe(guardado.respuestas);
  return {
    fecha: guardado.fecha,
    respuestas: guardado.respuestas,
    puntuaciones: r.puntuaciones,
    arquetipo: r.arquetipo,
    arquetipoNombre: ARQUETIPOS[r.arquetipo].nombre,
    leadMagnet: ARQUETIPOS[r.arquetipo].leadMagnet.titulo,
    tamano: r.tamano,
  };
}

function fechaLarga(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

const NUMEROS = ['ningún', 'un', 'dos', 'tres'];

let idsSvg = 0;

// Distancia entre dos puntos.
function distancia(p, q) {
  return Math.hypot(p.x - q.x, p.y - q.y);
}

function triangulo(r) {
  const g = geometriaTriangulo(r.puntuaciones);
  const pts = (lista) => lista.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const esReto = (a) => r.retos.indexOf(a) !== -1;
  const orden = ['C', 'A', 'B']; // mismo orden que g.fortalezas
  const etiquetas = [
    { a: 'C', x: 200, y: 22, ancla: 'middle' },
    { a: 'A', x: 22, y: 318, ancla: 'start' },
    { a: 'B', x: 378, y: 318, ancla: 'end' },
  ];
  const descripcion =
    'Triángulo de las tres áreas. ' +
    ['A', 'B', 'C'].map((a) => AREAS[a].etiqueta + ': ' + (esReto(a) ? 'reto' : 'fortaleza')).join('. ') + '.';
  const id = 'autodiag-svg-' + ++idsSvg;
  const contorno = pts([VERTICES.C, VERTICES.A, VERTICES.B]);

  // Degradado solo en los vértices con reto, recortado al triángulo. Su radio llega justo hasta el vértice del
  // triángulo interior de fortalezas: cuanto más preocupa el área, más se adentra.
  const degradados = orden
    .map((a, k) => ({ a, radio: distancia(VERTICES[a], g.fortalezas[k]) }))
    .filter((d) => esReto(d.a) && d.radio > 0);

  const icono = (a) => {
    const { x, y } = VERTICES[a];
    return esReto(a)
      ? svg('g', { class: 'autodiag-tri-icono autodiag-tri-icono-reto', transform: 'translate(' + x + ',' + y + ')' }, [
          svg('line', { x1: 0, y1: -5.5, x2: 0, y2: 1.5 }),
          svg('circle', { class: 'autodiag-tri-icono-punto', cx: 0, cy: 5.5, r: 1.6 }),
        ])
      : svg('path', { class: 'autodiag-tri-icono', transform: 'translate(' + x + ',' + y + ')', d: 'M -5 0.5 L -1.5 4 L 5.5 -3.5' });
  };

  return svg('svg', { class: 'autodiag-triangulo', viewBox: '0 0 400 340', role: 'img', 'aria-label': descripcion }, [
    svg('defs', {}, [
      svg('clipPath', { id: id + '-recorte' }, [svg('polygon', { points: contorno })]),
      ...degradados.map((d) =>
        svg('radialGradient', { id: id + '-' + d.a, gradientUnits: 'userSpaceOnUse', cx: VERTICES[d.a].x, cy: VERTICES[d.a].y, r: d.radio.toFixed(1) }, [
          svg('stop', { offset: '0', class: 'autodiag-tri-degradado-inicio' }),
          svg('stop', { offset: '1', class: 'autodiag-tri-degradado-fin' }),
        ]),
      ),
    ]),
    svg('polygon', { class: 'autodiag-tri-base', points: contorno }),
    svg('g', { 'clip-path': 'url(#' + id + '-recorte)' }, degradados.map((d) =>
      svg('circle', { cx: VERTICES[d.a].x, cy: VERTICES[d.a].y, r: d.radio.toFixed(1), fill: 'url(#' + id + '-' + d.a + ')' }),
    )),
    svg('line', { class: 'autodiag-tri-guia', x1: VERTICES.C.x, y1: VERTICES.C.y, x2: 200, y2: 285 }),
    svg('line', { class: 'autodiag-tri-guia', x1: VERTICES.A.x, y1: VERTICES.A.y, x2: 270, y2: 165 }),
    svg('line', { class: 'autodiag-tri-guia', x1: VERTICES.B.x, y1: VERTICES.B.y, x2: 130, y2: 165 }),
    svg('polygon', { class: 'autodiag-tri-base autodiag-tri-borde', points: contorno }),
    svg('polygon', { class: 'autodiag-tri-fortalezas', points: pts(g.fortalezas) }),
    svg('circle', { class: 'autodiag-tri-centro', cx: CENTRO.x, cy: CENTRO.y, r: 3 }),
    ...['A', 'B', 'C'].map((a) => svg('circle', { class: 'autodiag-tri-vertice autodiag-tri-vertice-' + (esReto(a) ? 'reto' : 'fuerte'), cx: VERTICES[a].x, cy: VERTICES[a].y, r: 12 })),
    ...['A', 'B', 'C'].map(icono),
    ...etiquetas.map((e) => svg('text', { class: 'autodiag-tri-etiqueta', x: e.x, y: e.y, 'text-anchor': e.ancla, text: AREAS[e.a].etiqueta })),
  ]);
}

function mensajeFormulario() {
  return el('p', { class: 'autodiag-form-mensaje', role: 'status' });
}

function campoEmail(id, etiqueta) {
  return el('div', { class: 'autodiag-campo' }, [
    el('label', { for: id, class: 'autodiag-etiqueta-campo', text: etiqueta }),
    el('input', { id, type: 'email', class: 'autodiag-input', autocomplete: 'email', placeholder: 'tu.nombre@empresa.com', value: emailRecordado, required: true }),
  ]);
}

// Envío de un formulario del resultado (recurso o mensaje). manejador: la función de AutodiagnosticoConfig (si hay).
// alExito: en lugar de dejar el texto de éxito bajo el formulario, qué hacer cuando se envía bien.
function enviarFormulario(form, evento, datos, manejador, textoOk, sinManejador, alExito) {
  const mensaje = form.querySelector('.autodiag-form-mensaje');
  const boton = form.querySelector('button[type="submit"]');
  emitir(evento, datos);
  if (typeof manejador !== 'function') {
    if (sinManejador) sinManejador(mensaje);
    return;
  }
  boton.disabled = true;
  mensaje.textContent = 'Enviando…';
  Promise.resolve()
    .then(() => manejador(datos))
    .then(() => {
      if (alExito) alExito();
      else {
        mensaje.textContent = textoOk;
        form.classList.add('is-enviado');
      }
    })
    .catch(() => {
      mensaje.textContent = 'No se ha podido enviar. Inténtalo de nuevo en unos minutos.';
    })
    .finally(() => {
      boton.disabled = false;
    });
}

// Envío por defecto del «Escríbenos»: a POSSO Admin, que registra a la persona, su organización, la oportunidad y
// la tarea de seguimiento. Lanza si POSSO no responde «ok» (el formulario muestra el error).
function enviarAPosso(datos) {
  const utm = getUTMParams();
  const r = resultadoDe(datos.respuestas);
  const cuerpo = {
    nombre: datos.nombre,
    email: datos.email,
    empresa: datos.empresa,
    cargo: datos.cargo,
    mensaje: datos.mensaje,
    privacidad: true,
    privacidadTexto: T.privacidadTexto,
    marketing: datos.marketing,
    marketingTexto: datos.marketing ? T.marketingTexto : null,
    website: datos.website,
    url: window.location.href,
    utm_source: utm.utm_source || null,
    utm_medium: utm.utm_medium || null,
    utm_campaign: utm.utm_campaign || null,
    utm_content: utm.utm_content || null,
    utm_term: utm.utm_term || null,
    diagnostico: {
      // Cada respuesta con su pregunta y su texto: así POSSO no depende de los textos de este script.
      respuestas: datos.respuestas.map((v, i) => ({
        pregunta: PREGUNTAS[i].texto,
        respuesta: PREGUNTAS[i].tipo === 'escala' ? ESCALA[v] : PREGUNTAS[i].opciones[v].texto,
        valor: v,
      })),
      puntuaciones: r.puntuaciones,
      arquetipo: r.arquetipo,
      arquetipoNombre: ARQUETIPOS[r.arquetipo].nombre,
      tamano: r.tamano,
      fecha: datos.fecha,
    },
  };
  return fetch(config().possoUrl || POSSO_URL_POR_DEFECTO, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
    .then((res) => res.json().catch(() => ({})).then((j) => ({ ok: res.ok, j })))
    .then(({ ok, j }) => {
      if (!ok || !j.ok) throw new Error((j && j.error) || 'Error al enviar');
    });
}

// Confirmación del «Escríbenos» (sustituye al formulario una vez enviado).
function confirmacionContacto(c) {
  const nombre = (c.nombre || '').split(' ')[0];
  return el('div', { class: 'autodiag-confirmacion', role: 'status', tabindex: '-1' }, [
    el('span', { class: 'autodiag-confirmacion-icono', 'aria-hidden': 'true', text: '✓' }),
    el('div', {}, [
      el('p', { class: 'autodiag-confirmacion-titulo', text: nombre ? '¡Gracias, ' + nombre + '!' : '¡Gracias!' }),
      el('p', { class: 'autodiag-confirmacion-texto', text: 'Hemos recibido tu mensaje y tu diagnóstico. Te escribiremos muy pronto' + (c.email ? ' a ' + c.email : '') + '.' }),
      c.fecha ? el('p', { class: 'autodiag-confirmacion-fecha', text: 'Enviado el ' + fechaLarga(c.fecha) }) : null,
    ]),
  ]);
}

// «Política de Privacidad» dentro de un texto, como enlace a la página de privacidad del sitio.
function textoConPrivacidad(texto) {
  const i = texto.indexOf('Política de Privacidad');
  if (i === -1) return [document.createTextNode(texto)];
  return [
    document.createTextNode(texto.slice(0, i)),
    el('a', { href: '/privacy', target: '_blank', rel: 'noopener', text: 'Política de Privacidad' }),
    document.createTextNode(texto.slice(i + 'Política de Privacidad'.length)),
  ];
}

function validarEmail(form, input) {
  const email = input.value.trim();
  const ok = EMAIL_RE.test(email);
  input.classList.toggle('is-invalido', !ok);
  if (!ok) {
    form.querySelector('.autodiag-form-mensaje').textContent = 'Escribe un email válido.';
    input.focus();
    return null;
  }
  emailRecordado = email;
  return email;
}

function pintarResultado(guardado) {
  const r = resultadoDe(guardado.respuestas);
  const a = ARQUETIPOS[r.arquetipo];
  const caso = CASOS[r.arquetipo] || null;
  const n = r.retos.length;
  const detalle = detalleResultado(guardado);
  const fuertes = ['A', 'B', 'C'].filter((x) => r.retos.indexOf(x) === -1);

  // Recurso recomendado: portada A4 + email + Descargar.
  const formRecurso = el('form', { class: 'autodiag-form autodiag-form-recurso', novalidate: true }, [
    campoEmail('autodiag-email-recurso', 'Tu email'),
    el('button', { type: 'submit', class: 'autodiag-boton autodiag-boton-claro', text: T.recursoBoton }),
    mensajeFormulario(),
  ]);
  formRecurso.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = validarEmail(formRecurso, formRecurso.querySelector('input'));
    if (!email) return;
    enviarFormulario(formRecurso, 'lead-magnet', { ...detalle, email }, config().onLeadMagnet, 'Listo. Te lo hemos enviado a ' + email + '.', (m) => {
      m.textContent = 'El envío del recurso todavía no está conectado.';
    });
  });

  // Escribirnos: crea la oportunidad en POSSO (POST /api/public/leads/autodiagnostico) con el diagnóstico completo.
  const campoTexto = (id, etiqueta, attrs) =>
    el('div', { class: 'autodiag-campo' }, [
      el('label', { for: id, class: 'autodiag-etiqueta-campo', text: etiqueta }),
      el('input', { id, type: 'text', class: 'autodiag-input', maxlength: '160', ...attrs }),
    ]);
  // Mismo marcado que la casilla del formulario del dossier (template.js): LearnWorlds oculta el checkbox nativo y
  // pinta el suyo (.checkbox-box con el icono de check), así que se ve igual que en el resto de la web.
  const casilla = (id, texto, obligatoria) =>
    el('div', { class: 'lead-form__optin-checkbox autodiag-casilla' }, [
      el('label', { for: id, class: 'checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left' }, [
        el('input', { id, type: 'checkbox', class: 'checkbox flexible-part js-optin-checkbox', required: obligatoria || null }),
        el('div', { class: 'checkbox-box lw-border-color-fadeout80 flexible-part' }, [el('span', { class: 'learnworlds-icon learnworlds-heading3-small fas fa-check' })]),
        el('div', { class: 'flexible-part' }, [
          ...textoConPrivacidad(texto),
          obligatoria ? document.createTextNode(' *') : el('span', { class: 'autodiag-opcional', text: ' (opcional)' }),
        ]),
      ]),
    ]);
  const formContacto = el('form', { class: 'autodiag-form autodiag-form-contacto', novalidate: true, hidden: true }, [
    campoTexto('autodiag-nombre', 'Tu nombre', { autocomplete: 'name', maxlength: '120', required: true }),
    campoEmail('autodiag-email-contacto', 'Tu email'),
    campoTexto('autodiag-empresa', 'Empresa', { autocomplete: 'organization', required: true }),
    campoTexto('autodiag-cargo', 'Cargo (opcional)', { autocomplete: 'organization-title', maxlength: '120' }),
    el('div', { class: 'autodiag-campo autodiag-campo-ancho' }, [
      el('label', { for: 'autodiag-mensaje', class: 'autodiag-etiqueta-campo', text: 'Mensaje (opcional)' }),
      el('textarea', { id: 'autodiag-mensaje', class: 'autodiag-input', rows: '3', maxlength: '2000', placeholder: 'Cuéntanos lo que quieras sobre tu equipo' }),
    ]),
    // Campo trampa para bots: invisible, no lo rellena una persona.
    el('input', { type: 'text', name: 'website', class: 'autodiag-trampa', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
    casilla('autodiag-privacidad', T.privacidadTexto, true),
    casilla('autodiag-marketing', T.marketingTexto, false),
    el('button', { type: 'submit', class: 'autodiag-boton', text: 'Enviar' }),
    mensajeFormulario(),
  ]);
  formContacto.addEventListener('submit', (e) => {
    e.preventDefault();
    const aviso = formContacto.querySelector('.autodiag-form-mensaje');
    const obligatorio = (id, texto) => {
      const input = formContacto.querySelector('#' + id);
      const vacio = !input.value.trim();
      input.classList.toggle('is-invalido', vacio);
      if (vacio) {
        aviso.textContent = texto;
        input.focus();
      }
      return vacio ? null : input.value.trim();
    };
    const nombre = obligatorio('autodiag-nombre', 'Escribe tu nombre.');
    if (!nombre) return;
    const email = validarEmail(formContacto, formContacto.querySelector('input[type="email"]'));
    if (!email) return;
    const empresa = obligatorio('autodiag-empresa', 'Escribe el nombre de tu empresa.');
    if (!empresa) return;
    const privacidad = formContacto.querySelector('#autodiag-privacidad');
    if (!privacidad.checked) {
      aviso.textContent = 'Para poder responderte, acepta la Política de Privacidad.';
      privacidad.focus();
      return;
    }
    const datos = {
      ...detalle,
      nombre,
      email,
      empresa,
      cargo: formContacto.querySelector('#autodiag-cargo').value.trim(),
      mensaje: formContacto.querySelector('textarea').value.trim(),
      marketing: formContacto.querySelector('#autodiag-marketing').checked,
      website: formContacto.querySelector('.autodiag-trampa').value,
    };
    enviarFormulario(formContacto, 'contacto', datos, config().onContacto || enviarAPosso, '', null, () => {
      // Enviado: fuera el formulario y el botón, y la confirmación en su lugar (y recordada para la próxima vez).
      guardado.contacto = { fecha: new Date().toISOString(), nombre, email };
      escribirGuardado(guardado);
      const confirmacion = confirmacionContacto(guardado.contacto);
      formContacto.replaceWith(confirmacion);
      botonEscribir.remove();
      if (!calendly) textoInvitacion.remove();
      confirmacion.focus();
    });
  });

  const calendly = config().calendlyUrl;
  const textoInvitacion = el('p', { class: 'autodiag-texto', text: T.invitacionTexto });
  const botonEscribir = el('button', {
    type: 'button',
    // Si es la única acción (sin Calendly), es la principal: fondo oscuro.
    class: 'autodiag-boton autodiag-boton-grande' + (calendly ? ' autodiag-boton-secundario' : ''),
    'aria-expanded': 'false',
    'aria-controls': 'autodiag-form-contacto',
    text: T.botonEscribir,
    onclick: (e) => {
      formContacto.hidden = !formContacto.hidden;
      e.currentTarget.setAttribute('aria-expanded', String(!formContacto.hidden));
      if (!formContacto.hidden) {
        const input = formContacto.querySelector('input[type="email"]');
        if (!input.value) input.value = emailRecordado;
        formContacto.querySelector('#autodiag-nombre').focus();
      }
    },
  });

  pintar(
    el('div', { class: 'autodiag-cabecera' }, [
      el('p', { class: 'autodiag-eyebrow', text: T.eyebrow }),
      el('h2', { id: 'autodiag-titulo', class: 'autodiag-titulo learnworlds-subheading learnworlds-subheading-small', 'data-foco': true, tabindex: '-1', text: T.titulo }),
      el('p', { class: 'autodiag-fecha', text: 'Diagnóstico del ' + fechaLarga(guardado.fecha) }),
    ]),

    // Arquetipo + triángulo
    el('section', { class: 'autodiag-arquetipo' }, [
      el('figure', { class: 'autodiag-figura' }, [triangulo(r)]),
      el('div', { class: 'autodiag-arquetipo-texto' }, [
        el('p', { class: 'autodiag-arquetipo-eyebrow', text: 'Escenario actual de tu equipo' }),
        el('h3', { class: 'autodiag-arquetipo-nombre', text: a.nombre }),
        el('p', { class: 'autodiag-lema', text: a.lema }),
        el('p', { class: 'autodiag-texto', text: a.radiografia }),
      ]),
    ]),

    // Retos
    el('section', { class: 'autodiag-seccion' }, [
      el('h3', { class: 'autodiag-seccion-titulo', text: T.retosTitulo }),
      el('p', {
        class: 'autodiag-texto',
        text:
          n > 0
            ? 'Según tus respuestas hay ' + NUMEROS[n] + (n === 1 ? ' área en la' : ' áreas en las') + ' que podéis mejorar:'
            : 'Según tus respuestas no hay ningún área que necesite mejorar con urgencia. Vuestro reto es otro:',
      }),
      n > 0
        ? el('ol', { class: 'autodiag-retos' },
            r.retos.map((area, i) =>
              el('li', { class: 'autodiag-reto' }, [
                el('span', { class: 'autodiag-reto-numero', 'aria-hidden': 'true', text: String(i + 1) }),
                el('div', {}, [
                  el('p', { class: 'autodiag-reto-titulo' }, [
                    document.createTextNode(AREAS[area].reto.titulo),
                    i === 0 && n > 1 ? el('span', { class: 'autodiag-etiqueta', text: 'Prioritario' }) : null,
                  ]),
                  el('p', { class: 'autodiag-reto-texto', text: AREAS[area].reto.texto }),
                ]),
              ]),
            ),
          )
        : el('ul', { class: 'autodiag-lista' }, a.oportunidades.map((t) => el('li', { text: t }))),
      fuertes.length > 0 && n > 0
        ? el('div', { class: 'autodiag-fortalezas' }, [
            el('p', { class: 'autodiag-fortalezas-titulo', text: fuertes.length === 1 ? 'Tu punto fuerte' : 'Tus puntos fuertes' }),
            el('ul', {}, fuertes.map((x) => el('li', {}, [el('strong', { text: AREAS[x].nombre + '. ' }), document.createTextNode(AREAS[x].fortaleza)]))),
          ])
        : null,
    ]),

    caso ? tarjetaCaso(caso) : null,

    // Recurso recomendado (solo si está activo, ver leadMagnet.activo en datos.js)
    !a.leadMagnet.activo ? null : el('section', { class: 'autodiag-recurso' }, [
      el('div', { class: 'autodiag-portada', 'aria-hidden': 'true' }, a.leadMagnet.portada
        ? [el('img', { src: a.leadMagnet.portada, alt: '' })]
        : [
            el('span', { class: 'autodiag-portada-marca', text: 'POSSO' }),
            el('span', { class: 'autodiag-portada-titulo', text: a.leadMagnet.titulo }),
            el('span', { class: 'autodiag-portada-pie', text: 'by Mr.Marcel' }),
          ]),
      el('div', { class: 'autodiag-recurso-cuerpo' }, [
        el('p', { class: 'autodiag-eyebrow', text: T.recursoEyebrow }),
        el('h3', { class: 'autodiag-recurso-titulo', text: a.leadMagnet.titulo }),
        el('p', { class: 'autodiag-recurso-texto', text: a.leadMagnet.descripcion }),
        formRecurso,
      ]),
    ]),

    // Próximos pasos
    el('section', { class: 'autodiag-seccion autodiag-seccion-proximos' }, [
      el('h3', { class: 'autodiag-seccion-titulo', text: T.proximosPasos }),
      textoPropuesta(guardado.respuestas),
      // La invitación sobra una vez escrito (salvo que quede la llamada de Calendly, a la que acompaña).
      guardado.contacto && !calendly ? null : textoInvitacion,
      el('div', { class: 'autodiag-acciones autodiag-acciones-principales' }, [
        calendly
          ? el('a', { class: 'autodiag-boton autodiag-boton-grande', href: calendly, target: '_blank', rel: 'noopener', text: T.botonLlamada, onclick: () => emitir('llamada', detalle) })
          : null,
        guardado.contacto ? null : botonEscribir,
      ]),
      guardado.contacto ? confirmacionContacto(guardado.contacto) : formContacto,
    ]),

    // Discreto, al final
    el('div', { class: 'autodiag-pie' }, [
      el('button', { type: 'button', class: 'autodiag-enlace', text: 'Ver respuestas', onclick: () => {
        pintarRespuestas(guardado);
        arriba();
      } }),
      el('span', { 'aria-hidden': 'true', text: '·' }),
      el('button', { type: 'button', class: 'autodiag-enlace', text: 'Repetir el diagnóstico', onclick: () => {
        if (!window.confirm('¿Empezar de nuevo? Se borrarán tus respuestas.')) return;
        borrarGuardado();
        empezar();
        arriba();
      } }),
    ]),
  );
  formContacto.id = 'autodiag-form-contacto';
}

// «Próximos pasos»: la propuesta con cada foco en negrita (sin las comas ni la «y en» que los unen).
function textoPropuesta(respuestas) {
  const { solucion, introFocos, focos, cierre } = propuestaPartes(respuestas);
  const nodos = [document.createTextNode(solucion + ' ')];
  if (focos.length > 0) {
    nodos.push(document.createTextNode(introFocos));
    focos.forEach((f, i) => {
      if (i > 0) nodos.push(document.createTextNode(i === focos.length - 1 ? ' y en ' : ', en '));
      nodos.push(el('strong', { text: f }));
    });
    nodos.push(document.createTextNode('. '));
  }
  nodos.push(document.createTextNode(cierre));
  return el('p', { class: 'autodiag-texto' }, nodos);
}

// Caso real del arquetipo: título, personas formadas y logo; la descripción se despliega con «Ver detalles».
function tarjetaCaso(caso) {
  const idDetalle = 'autodiag-caso-detalle';
  const detalle = el('p', { id: idDetalle, class: 'autodiag-caso-texto', hidden: true, text: caso.descripcion });
  const logo = el('div', { class: 'autodiag-caso-logo' }, [el('span', { class: 'autodiag-caso-logo-nombre', text: caso.empresa })]);
  if (caso.logo) {
    const img = el('img', { src: LOGOS_CASOS + caso.logo, alt: caso.empresa });
    // Hasta que el PNG exista, se queda el nombre de la empresa.
    img.addEventListener('load', () => logo.replaceChildren(img));
  }
  return el('section', { class: 'autodiag-caso' }, [
    el('div', { class: 'autodiag-caso-cabecera' }, [
      el('div', { class: 'autodiag-caso-titular' }, [
        el('p', { class: 'autodiag-eyebrow', text: T.casoEyebrow }),
        el('h3', { class: 'autodiag-caso-titulo' }, [el('span', { class: 'autodiag-caso-empresa', text: caso.empresa + ' · ' }), document.createTextNode(caso.titulo)]),
        el('span', { class: 'autodiag-caso-tag', text: caso.personas + ' personas formadas' }),
      ]),
      logo,
    ]),
    el('button', {
      type: 'button', class: 'autodiag-caso-toggle', 'aria-expanded': 'false', 'aria-controls': idDetalle, text: 'Ver detalles',
      onclick: (e) => {
        detalle.hidden = !detalle.hidden;
        e.currentTarget.setAttribute('aria-expanded', String(!detalle.hidden));
        e.currentTarget.textContent = detalle.hidden ? 'Ver detalles' : 'Ocultar detalles';
      },
    }),
    detalle,
  ]);
}

// --- Arranque ------------------------------------------------------------------------------------------------------

function init() {
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('.' + CLASE_DISPARADOR + ', a[href$="' + ANCLA + '"]') : null;
    if (!t) return;
    e.preventDefault();
    abrir(t);
  });
  if (window.location.hash === ANCLA) abrir();
  window.addEventListener('hashchange', () => {
    if (window.location.hash === ANCLA && !estaAbierto()) abrir();
  });
}

window.PossoAutodiagnostico = { abrir, cerrar, borrar: borrarGuardado };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
