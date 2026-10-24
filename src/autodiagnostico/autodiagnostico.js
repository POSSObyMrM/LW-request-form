import { AREAS, ARQUETIPOS, ESCALA, FORMATO_POR_TAMANO, INTRO, PREGUNTAS } from './datos.js';
import { resultadoDe, respuestasValidas } from './calculo.js';

// Autodiagnóstico InCompany. Script independiente de request-form.js: se enlaza aparte en LearnWorlds.
//
// Se abre con cualquier elemento con la clase «btn-autodiagnostico» (o un enlace a «#autodiagnostico»), o desde
// código con window.PossoAutodiagnostico.abrir(). Si en este navegador ya se respondió, abre directamente el
// resultado; si no, la primera pregunta. El resultado (respuestas + fecha) se guarda en localStorage: no viaja en
// cada petición como una cookie y no caduca solo; «Repetir el diagnóstico» lo borra.
//
// Configuración opcional, antes de cargar el script:
//   window.AutodiagnosticoConfig = {
//     contactoEmail: 'incompany@posso.es',             // botón «Hablemos de tu equipo»
//     onLeadMagnet: function (resultado) { ... },      // botón del recurso recomendado (siguiente fase)
//   };
// Eventos: «posso:autodiagnostico:completado» y «posso:autodiagnostico:lead-magnet» en document (detail = resultado),
// y los mismos en window.dataLayer (Google Tag Manager) si existe.
//
// Estilos: LW-styles, src/partials/dynamic/_autodiagnostico.less (clases autodiag-*, sobre el modal dossier-*).

const CLAVE_ALMACEN = 'posso_autodiagnostico_incompany';
const VERSION = 1;
const CLASE_DISPARADOR = 'btn-autodiagnostico';
const ANCLA = '#autodiagnostico';
const EMAIL_CONTACTO_POR_DEFECTO = 'incompany@posso.es';

let modal = null;
let contenido = null;
let disparador = null;
let respuestas = [];
let actual = 0;

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

function guardar(resps) {
  const r = resultadoDe(resps);
  const g = { version: VERSION, fecha: new Date().toISOString(), respuestas: resps, arquetipo: r.arquetipo, puntuaciones: r.puntuaciones };
  try {
    window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(g));
  } catch (e) {
    /* sin almacenamiento: el resultado se ve igual, solo no se recordará */
  }
  return g;
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
  modal.scrollTop = 0;
  enfocarInicio();
}

function cerrar() {
  if (!modal) return;
  modal.style.display = 'none';
  if (disparador && typeof disparador.focus === 'function') disparador.focus();
}

function enfocarInicio() {
  const destino = contenido.querySelector('[data-foco]') || modal.querySelector('.autodiag-cerrar');
  if (destino) destino.focus({ preventScroll: true });
}

// --- Preguntas -----------------------------------------------------------------------------------------------------

function empezar() {
  respuestas = new Array(PREGUNTAS.length).fill(null);
  actual = 0;
  pintarPregunta();
}

function pintarPregunta() {
  const p = PREGUNTAS[actual];
  const total = PREGUNTAS.length;
  const opciones = p.tipo === 'escala' ? ESCALA.map((texto, i) => ({ texto, i })) : p.opciones.map((o, i) => ({ texto: o.texto, i }));

  const grupo = el(
    'div',
    { class: 'autodiag-opciones autodiag-opciones-' + (p.tipo === 'escala' ? 'escala' : 'lista'), role: 'radiogroup', 'aria-labelledby': 'autodiag-pregunta' },
    opciones.map((o) =>
      el('button', {
        type: 'button',
        class: 'autodiag-opcion' + (respuestas[actual] === o.i ? ' is-elegida' : ''),
        role: 'radio',
        'aria-checked': respuestas[actual] === o.i ? 'true' : 'false',
        'data-foco': o.i === (respuestas[actual] ?? 0) ? true : null,
        text: o.texto,
        onclick: () => responder(o.i),
      }),
    ),
  );

  contenido.replaceChildren(
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
    el('h3', { id: 'autodiag-pregunta', class: 'autodiag-pregunta', text: p.texto }),
    grupo,
    el('div', { class: 'autodiag-navegacion' }, [
      actual > 0 ? el('button', { type: 'button', class: 'autodiag-boton-texto', text: '← Anterior', onclick: anterior }) : el('span'),
    ]),
  );

  // Flechas para moverse entre opciones (patrón de radiogroup).
  grupo.addEventListener('keydown', (e) => {
    const botones = Array.from(grupo.querySelectorAll('.autodiag-opcion'));
    const i = botones.indexOf(document.activeElement);
    if (i < 0) return;
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    botones[(i + delta + botones.length) % botones.length].focus();
  });
}

let avanzando = false;
function responder(i) {
  if (avanzando) return;
  respuestas[actual] = i;
  pintarPregunta();
  if (actual === 0 && respuestas.filter((r) => r !== null).length === 1) emitir('inicio', null);
  // Pausa breve para que se vea la opción elegida antes de pasar.
  avanzando = true;
  setTimeout(() => {
    avanzando = false;
    if (actual < PREGUNTAS.length - 1) {
      actual++;
      pintarPregunta();
      enfocarInicio();
    } else {
      const guardado = guardar(respuestas.slice());
      pintarResultado(guardado);
      modal.scrollTop = 0;
      enfocarInicio();
      emitir('completado', detalleResultado(guardado));
    }
  }, 220);
}

function anterior() {
  if (actual === 0) return;
  actual--;
  pintarPregunta();
  enfocarInicio();
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

function pintarResultado(guardado) {
  const r = resultadoDe(guardado.respuestas);
  const a = ARQUETIPOS[r.arquetipo];
  const n = r.retos.length;
  const intro =
    n === 0
      ? 'Según tus respuestas, ninguna de las tres áreas te preocupa especialmente. Tu reto es otro: no acomodarse.'
      : 'Según tus respuestas, hay ' + (n === 1 ? 'un área' : n === 2 ? 'dos áreas' : 'tres áreas') + ' en ' + (n === 1 ? 'la' : 'las') +
        ' que podéis mejorar. Te contamos cuáles son, por qué importan y por dónde empezar.';

  const retos =
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
                el('p', { class: 'autodiag-reto-area', text: AREAS[area].nombre }),
                el('p', { class: 'autodiag-reto-texto', text: AREAS[area].reto.texto }),
              ]),
            ]),
          ),
        )
      : el('ul', { class: 'autodiag-lista' }, a.oportunidades.map((t) => el('li', { text: t })));

  const fuertes = ['A', 'B', 'C'].filter((x) => r.retos.indexOf(x) === -1);

  contenido.replaceChildren(
    el('div', { class: 'autodiag-cabecera' }, [
      el('p', { class: 'autodiag-eyebrow', text: 'Tu diagnóstico POSSO' }),
      el('h2', { id: 'autodiag-titulo', class: 'autodiag-titulo learnworlds-subheading learnworlds-subheading-small', 'data-foco': true, tabindex: '-1', text: a.nombre }),
      el('p', { class: 'autodiag-lema', text: a.lema }),
      el('p', { class: 'autodiag-fecha', text: 'Diagnóstico del ' + fechaLarga(guardado.fecha) }),
    ]),
    el('p', { class: 'autodiag-texto learnworlds-main-text', text: a.radiografia }),

    el('section', { class: 'autodiag-seccion' }, [
      el('h3', { class: 'autodiag-seccion-titulo', text: n > 0 ? 'Tus principales retos' : 'Tu reto' }),
      el('p', { class: 'autodiag-texto', text: intro }),
      retos,
      fuertes.length > 0 && n > 0
        ? el('div', { class: 'autodiag-fortalezas' }, [
            el('p', { class: 'autodiag-fortalezas-titulo', text: fuertes.length === 1 ? 'Tu punto fuerte' : 'Tus puntos fuertes' }),
            el('ul', {}, fuertes.map((x) => el('li', {}, [el('strong', { text: AREAS[x].nombre + '. ' }), document.createTextNode(AREAS[x].fortaleza)]))),
          ])
        : null,
    ]),

    el('blockquote', { class: 'autodiag-mensaje', text: '«' + a.mensaje + '»' }),

    el('section', { class: 'autodiag-recurso' }, [
      el('p', { class: 'autodiag-eyebrow', text: '¿Quieres entender mejor estos retos?' }),
      el('h3', { class: 'autodiag-recurso-titulo', text: a.leadMagnet.titulo }),
      el('p', { class: 'autodiag-recurso-texto', text: a.leadMagnet.descripcion }),
      el('button', {
        type: 'button',
        class: 'autodiag-boton autodiag-boton-claro',
        text: 'Descárgalo aquí →',
        onclick: () => {
          const detalle = detalleResultado(guardado);
          emitir('lead-magnet', detalle);
          if (typeof config().onLeadMagnet === 'function') config().onLeadMagnet(detalle);
        },
      }),
    ]),

    el('section', { class: 'autodiag-seccion autodiag-solucion' }, [
      el('h3', { class: 'autodiag-seccion-titulo', text: 'Cómo te ayudaríamos' }),
      el('p', { class: 'autodiag-texto', text: a.solucion }),
      el('p', { class: 'autodiag-texto', text: FORMATO_POR_TAMANO[r.tamano] }),
      el('div', { class: 'autodiag-acciones' }, [
        el('a', {
          class: 'autodiag-boton',
          href:
            'mailto:' + (config().contactoEmail || EMAIL_CONTACTO_POR_DEFECTO) +
            '?subject=' + encodeURIComponent('Autodiagnóstico In Company: ' + a.nombre),
          text: 'Hablemos de tu equipo',
        }),
        el('button', {
          type: 'button',
          class: 'autodiag-boton-texto',
          text: 'Repetir el diagnóstico',
          onclick: () => {
            borrarGuardado();
            empezar();
            modal.scrollTop = 0;
            enfocarInicio();
          },
        }),
      ]),
    ]),
  );
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
