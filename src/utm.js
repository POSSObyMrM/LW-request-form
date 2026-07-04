const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'posso_utms';

export function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utms = {};
  let foundAny = false;

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utms[key] = value;
      foundAny = true;
    }
  });

  if (foundAny) {
    // Hay UTMs en esta URL: pasan a ser la atribución vigente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
    return utms;
  }

  // No hay UTMs en esta página: usamos los últimos guardados, si existen
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}
