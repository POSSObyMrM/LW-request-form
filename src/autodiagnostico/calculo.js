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
