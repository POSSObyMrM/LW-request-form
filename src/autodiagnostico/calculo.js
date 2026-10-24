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
// abajo a la izquierda, Influencia y liderazgo abajo a la derecha. El ejemplo colocaba el punto en una coordenada fija
// por arquetipo; aquí sale de las respuestas: la fortaleza de cada área (4 − puntuación de preocupación) tira del punto
// hacia su vértice (media ponderada), así que coincide con la «Posición» de cada arquetipo en el documento (vértice
// dominante, arista o centro) y además se mueve dentro de él según cuánto preocupa cada área. Si las tres áreas pesan
// lo mismo (o ninguna es fuerte), queda en el centro.
export const VERTICES = { C: { x: 200, y: 45 }, A: { x: 60, y: 285 }, B: { x: 340, y: 285 } };
export const CENTRO = { x: 200, y: 205 };
const ACERCAMIENTO = 0.82;

export function geometriaTriangulo(p) {
  const fuerza = { A: 4 - p.A, B: 4 - p.B, C: 4 - p.C };
  const total = fuerza.A + fuerza.B + fuerza.C;
  const media =
    total === 0
      ? { ...CENTRO }
      : {
          x: (fuerza.A * VERTICES.A.x + fuerza.B * VERTICES.B.x + fuerza.C * VERTICES.C.x) / total,
          y: (fuerza.A * VERTICES.A.y + fuerza.B * VERTICES.B.y + fuerza.C * VERTICES.C.y) / total,
        };
  // Un poco hacia el centro, para que el punto nunca tape el vértice ni se salga del borde.
  const punto = { x: CENTRO.x + (media.x - CENTRO.x) * ACERCAMIENTO, y: CENTRO.y + (media.y - CENTRO.y) * ACERCAMIENTO };
  // Triángulo interior: hacia cada vértice, tanto como fuerte es esa área (radar de fortalezas).
  const fortalezas = ['C', 'A', 'B'].map((a) => ({
    x: CENTRO.x + ((VERTICES[a].x - CENTRO.x) * fuerza[a]) / 4,
    y: CENTRO.y + ((VERTICES[a].y - CENTRO.y) * fuerza[a]) / 4,
  }));
  return { punto, fortalezas, fuerza };
}

// --- Propuesta de «Próximos pasos» -------------------------------------------------------------------------------------
// Se compone con: la solución del arquetipo + hasta tres focos sacados de las preguntas que más preocupan
// («mucho»; si no hay ninguna, las de «un poco»), empezando por el área prioritaria.
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

export function propuestaDe(respuestas) {
  const r = resultadoDe(respuestas);
  const a = ARQUETIPOS[r.arquetipo];
  const solucion = a.solucion.charAt(0).toLowerCase() + a.solucion.slice(1).replace(/\.\s*$/, '');
  const { nivel, focos } = focosDe(respuestas);
  let texto = 'Para un equipo como el tuyo, te proponemos ' + solucion + '.';
  if (focos.length > 0) {
    texto += (nivel === 2 ? ' Según lo que más te preocupa, pondríamos el foco en ' : ' Pondríamos el foco en ') +
      unirConY(focos.map((f, i) => (i === 0 ? f : 'en ' + f))) + '.';
  }
  return texto;
}
