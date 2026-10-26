import { ARQUETIPOS, PREGUNTAS } from './datos.js';

// Cálculo del arquetipo. Sin DOM: se puede probar con node.
//
// Cada área suma sus dos preguntas de escala (0 = no me preocupa, 1 = un poco, 2 = mucho), de 0 a 4. Un área
// «necesita mejorar» si suma 2 o más (las dos preguntas preocupan un poco, o una preocupa mucho); si no, es «fuerte».
// Las tres áreas dan 2 × 2 × 2 = 8 combinaciones, una por arquetipo (tabla «Mapa de arquetipos» del documento).
export const UMBRAL_MEJORAR = 2;

export function puntuaciones(respuestas) {
  const p = { A: 0, B: 0, C: 0 };
  PREGUNTAS.forEach((pregunta, i) => {
    if (pregunta.tipo === 'escala') p[pregunta.area] += respuestas[i];
  });
  return p;
}

export function arquetipoDe(p) {
  const fuertes = ['A', 'B', 'C'].filter((a) => p[a] < UMBRAL_MEJORAR).join('');
  const clave = Object.keys(ARQUETIPOS).find((k) => ARQUETIPOS[k].fuertes.join('') === fuertes);
  return Number(clave);
}

// Áreas a mejorar, de la que más preocupa a la que menos (a igualdad, en el orden A, B, C).
export function retosOrdenados(p) {
  return ['A', 'B', 'C'].filter((a) => p[a] >= UMBRAL_MEJORAR).sort((x, y) => p[y] - p[x]);
}

export function respuestasValidas(respuestas) {
  return (
    Array.isArray(respuestas) &&
    respuestas.length === PREGUNTAS.length &&
    respuestas.every((r, i) => Number.isInteger(r) && r >= 0 && r < (PREGUNTAS[i].tipo === 'escala' ? 3 : PREGUNTAS[i].opciones.length))
  );
}

export function resultadoDe(respuestas) {
  const p = puntuaciones(respuestas);
  return {
    puntuaciones: p,
    arquetipo: arquetipoDe(p),
    retos: retosOrdenados(p),
    tamano: PREGUNTAS[6].opciones[respuestas[6]].valor,
  };
}

// --- Triángulo de áreas ---------------------------------------------------------------------------------------------
// Mismo triángulo que el HTML de ejemplo (viewBox 0 0 400 340): Cultura y estrategia arriba, Criterio y ejecución
// abajo a la izquierda, Influencia y liderazgo abajo a la derecha. Dentro, el triángulo de fortalezas: hacia cada
// vértice llega tanto como fuerte es esa área (4 − puntuación de preocupación), desde el centro (nada) hasta el
// vértice (sin ninguna preocupación).
export const VERTICES = { C: { x: 200, y: 45 }, A: { x: 60, y: 285 }, B: { x: 340, y: 285 } };
export const CENTRO = { x: 200, y: 205 };

export function geometriaTriangulo(p) {
  const fuerza = { A: 4 - p.A, B: 4 - p.B, C: 4 - p.C };
  // En el orden C, A, B (el del contorno).
  const fortalezas = ['C', 'A', 'B'].map((a) => ({
    x: CENTRO.x + ((VERTICES[a].x - CENTRO.x) * fuerza[a]) / 4,
    y: CENTRO.y + ((VERTICES[a].y - CENTRO.y) * fuerza[a]) / 4,
  }));
  return { fortalezas, fuerza };
}

// --- Propuesta de «Próximos pasos» -------------------------------------------------------------------------------------
// Cómo solemos trabajar con equipos de ese arquetipo (su «solucion», ya redactada como frase) + hasta tres focos
// sacados de las preguntas que más preocupan («mucho»; si no hay ninguna, las de «un poco»), empezando por el área
// prioritaria + un cierre que invita a concretarlo juntos. Tono de partner: nunca afirma cómo es su equipo.
export const MAX_FOCOS = 3;

function unirConY(partes) {
  if (partes.length <= 1) return partes.join('');
  return partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1];
}

export function focosDe(respuestas) {
  const p = puntuaciones(respuestas);
  const ordenAreas = retosOrdenados(p).concat(['A', 'B', 'C'].filter((a) => p[a] < UMBRAL_MEJORAR));
  const preguntasEscala = PREGUNTAS.map((q, i) => ({ q, i })).filter((x) => x.q.tipo === 'escala');
  for (const nivel of [2, 1]) {
    const elegidas = ordenAreas.flatMap((a) => preguntasEscala.filter((x) => x.q.area === a && respuestas[x.i] === nivel));
    if (elegidas.length > 0) return { nivel, focos: elegidas.slice(0, MAX_FOCOS).map((x) => x.q.foco) };
  }
  return { nivel: 0, focos: [] };
}

export const CIERRE_PROPUESTA = 'Lo concretaríamos contigo, a partir de lo que de verdad necesita tu equipo.';

// Partes de la propuesta, para poder pintar los focos en negrita: solucion + introFocos + focos (unidos con «, en …»
// y «y en …») + '.' + cierre. Sin focos, introFocos es '' y focos [].
export function propuestaPartes(respuestas) {
  const r = resultadoDe(respuestas);
  const { nivel, focos } = focosDe(respuestas);
  return {
    solucion: ARQUETIPOS[r.arquetipo].solucion,
    introFocos: focos.length === 0 ? '' : nivel === 2 ? 'Por lo que más te preocupa, pondríamos el foco en ' : 'Por lo que nos cuentas, pondríamos el foco en ',
    focos,
    cierre: CIERRE_PROPUESTA,
  };
}

export function propuestaDe(respuestas) {
  const { solucion, introFocos, focos, cierre } = propuestaPartes(respuestas);
  const conFocos = focos.length > 0 ? ' ' + introFocos + unirConY(focos.map((f, i) => (i === 0 ? f : 'en ' + f))) + '.' : '';
  return solucion + conFocos + ' ' + cierre;
}
