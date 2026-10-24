# LW Request Form

Injects a request modal/form into a LearnWorlds page and wires up all its
behavior (course auto-detection, UTM capture, logged-in vs logged-out flow,
webhook submission) from a single embeddable script. The same modal and
webhook serve multiple request "flavors" — e.g. requesting a dossier vs.
asking to be notified when one becomes available — distinguished purely by
the trigger button's CSS class and a small config object.

CSS is **not** included here — it's handled in a separate project and is
expected to already define styles for the classes/ids used below
(`dossier-modal-container`, `dossier-modal-box`, `dossier-modal-close`,
`dossier-input-group`, `#dossier-submit-btn`, etc). That separate project
also needs to style the newer additions:
- `dossier-checkbox-group` — wraps the terms/privacy checkbox + its label.
- `dossier-field-error` — the (empty-by-default) error message span under
  each field; populated with text by JS when validation fails.
- `dossier-input-invalid` — toggled on an `<input>` by JS when it fails
  validation, for an error state (e.g. red border).

## How it works

- Each request flavor ("request type") is defined in `src/request-types.js`
  and keyed by the CSS class of the button that triggers it. Ships with two:
  - `btn-dossier-request` — "Descargar Dossier" flow.
  - `btn-info-request` — "avísame de novedades" flow, for courses that don't
    have a dossier yet.
  - `btn-incompany-request` — recurso descargable de POSSO Admin (dossier InCompany).
  - `btn-beca-request` — solicitud de beca (formulario construido con la configuración de POSSO, ver más abajo).
- Clicking any element with one of those classes opens the (shared) modal
  with that type's title/subtitle/button copy, or — if a LearnWorlds user is
  logged in (`window.LearnWorlds.analytics.user`) — sends the request
  straight to the webhook with no popup, using that type's alert copy.
- The webhook payload includes `request_type` (`"dossier"` or `"info"`) so
  the receiving automation (Make/Zapier) can branch on which flow fired.
- The course id/name are auto-detected from the URL path and the page's
  `og:title` meta tag (falling back to `document.title`). The page URL
  (`window.location.href`) is captured the same way and sent as `page_url`.
- UTM params are captured from the URL and persisted in `localStorage` so
  attribution survives navigation.
- The popup form requires a name, a valid-looking email, and acceptance of
  the [Terms](https://posso.es/terms) and [Privacy Policy](https://posso.es/privacy)
  checkbox before it will submit. Failing validation shows an inline error
  under the offending field(s) and blocks the webhook call — nothing is
  sent until all three pass. (The logged-in, no-popup flow skips this,
  since there's no form to validate — it uses the account's existing
  email/name.)

## Project layout

- `src/request-form.js` — main logic, auto-runs on load.
- `src/beca-form.js` — formulario de solicitud de beca (se construye con la configuración que da POSSO).
- `src/request-types.js` — per-flow copy/config (titles, labels, alerts) and
  the merge logic for overriding/extending it.
- `src/template.js` — the modal's HTML markup (flavor-agnostic).
- `src/utm.js` — UTM capture/persistence helper.
- `dist/request-form.js` — bundled, single-file output for embedding.

## Build

```bash
npm install
npm run build       # dist/request-form.js
npm run build:min   # dist/request-form.min.js
npm run watch        # rebuild on change, for local development
```

## Embedding in LearnWorlds

Add this to the site's custom code / footer scripts. Set the webhook URL
via a config object **before** loading the bundle, so the URL doesn't need
to live in the committed/publicly-served JS file:

```html
<script>
  window.RequestFormConfig = {
    webhookUrl: 'https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxxxxxx'
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@main/dist/request-form.js"></script>
```

(Any static host works for the second `<script src>` — jsDelivr against
this GitHub repo, GitHub Pages, etc. — as long as it serves
`dist/request-form.js` over HTTPS.)

If `window.RequestFormConfig.webhookUrl` is missing, the script logs an
error to the console and the form/button flow will not be able to submit.

On any page, add a button/link with class `btn-dossier-request` or
`btn-info-request` to trigger the corresponding flow — no other markup or
JS is required, the script injects the modal itself.

### Solicitud de beca (`btn-beca-request`)

A diferencia de los demás tipos, el formulario de beca **no tiene los campos escritos aquí**: se construye con la
configuración de la convocatoria que da POSSO Admin (`GET /api/public/becas/{codigo}`): cursos con su plazo de solicitud
(los ya cerrados salen deshabilitados), preguntas y textos legales. Una convocatoria nueva (otra beca, otras fechas, otras
preguntas) se da de alta en POSSO Admin → Becas, sin tocar este repositorio. El formulario envía la solicitud a
`POST /api/public/becas/solicitar`; POSSO registra a la persona, guarda la solicitud y le manda la confirmación desde
`dinos@posso.es`.

Botón (en cualquier página; funciona también si el clic cae en un hijo del botón, como un icono):

```html
<button class="btn-beca-request" data-beca="becas-50-2026">Solicitar beca</button>
<!-- Con un curso ya elegido (código del curso en la configuración de la convocatoria): -->
<button class="btn-beca-request" data-beca="becas-50-2026" data-curso="sistemas-de-diseno">Solicitar beca</button>
```

- `data-beca` — código de la convocatoria (si falta, se usa `RequestFormConfig.becaCodigo`).
- `data-curso` — opcional: abre el formulario con ese curso seleccionado (si su plazo sigue abierto).
- `RequestFormConfig.possoBaseUrl` — opcional, `https://admin.posso.es` por defecto (también se deduce del origen de
  `possoUrl` si está definido). Para probar en local, el origen de la página debe estar permitido por POSSO
  (`localhost` solo en dev/preview).
- Los requisitos técnicos del curso elegido salen entre el enunciado de la pregunta que lo pida (opción «Mostrar aquí los
  requisitos técnicos del curso» en POSSO Admin) y sus opciones; sin esa pregunta, bajo el selector del curso.
- Si la convocatoria define `textoMarketing`, se añade una casilla **opcional** de comunicaciones comerciales (sin marcar,
  sin asterisco, no condiciona el envío); se manda como `marketing: true|false`.
- Nombre y email van cada uno en su fila (el script añade la clase `beca-form` al formulario mientras está abierto).
- Siempre abre el popup (hace falta el consentimiento explícito), con nombre y email ya rellenos si hay sesión de
  LearnWorlds.

Lógica en `src/beca-form.js`; todo el contenido que viene del servidor se inserta con `textContent`, nunca como HTML.

CSS que el proyecto de estilos debe cubrir además de lo anterior: `select` y `textarea` dentro de `.dossier-input-group`,
`.dossier-char-count` (contador de caracteres de un texto largo), `.dossier-field-hint` (ayuda bajo un campo),
`.dossier-radio-group` / `.dossier-radio-option` (opciones tipo radio), `.dossier-requisitos` (requisitos del curso bajo la pregunta), `form.beca-form` y `#beca-extra-fields` (contenedor de los campos
de beca dentro del formulario). El resto reutiliza las clases del modal de siempre.

### Customizing texts, or adding new request types

Override or extend the defaults from `src/request-types.js` via
`window.RequestFormConfig.requestTypes`, keyed by the same type name
(`dossier`, `info`, or a new one). Any field you omit falls back to the
default. `{{course}}` in `subtitleTemplate` is replaced with the detected
course name:

```html
<script>
  window.RequestFormConfig = {
    webhookUrl: 'https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxxxxxx',
    requestTypes: {
      info: {
        modalTitle: 'Quiero saber cuándo esté disponible',
        subtitleTemplate: 'Te escribiremos en cuanto el {{course}} esté listo.',
      },
      // A brand-new flavor, matched by class "btn-waitlist-request":
      waitlist: {
        triggerClass: 'btn-waitlist-request',
        payloadType: 'waitlist',
        modalTitle: 'Únete a la lista de espera',
        subtitleTemplate: 'Te avisaremos apenas abramos cupos para el {{course}}.',
        submitLabel: 'Unirme',
        sendingLabel: 'Enviando...',
        successAlert: '¡Listo! Estás en la lista de espera.',
        errorAlert: 'Ocurrió un error. Por favor inténtalo de nuevo.',
        loggedIn: {
          processingLabel: 'Procesando...',
          sentLabel: '¡Enviado!',
          successAlert: '¡Listo! Te avisaremos por correo.',
          errorAlert: 'Hubo un problema. Por favor, inténtalo de nuevo.',
        },
      },
    },
  };
</script>
```

## Autodiagnóstico InCompany (`dist/autodiagnostico.js`)

Script independiente (no necesita `request-form.js`). Cuestionario de 7 preguntas que asigna uno de los 8 arquetipos
del documento «Test Incompany» y recomienda un recurso.

```html
<script src="https://cdn.jsdelivr.net/gh/POSSObyMrM/LW-request-form@main/dist/autodiagnostico.min.js"></script>
```

- Se abre con cualquier botón/enlace con la clase `btn-autodiagnostico`, con un enlace a `#autodiagnostico`, o con
  `window.PossoAutodiagnostico.abrir()`.
- Si el navegador ya lo respondió (localStorage `posso_autodiagnostico_incompany`: respuestas + fecha), abre directamente
  el resultado. «Repetir el diagnóstico» lo borra.
- Contenidos en `src/autodiagnostico/datos.js`; cálculo en `src/autodiagnostico/calculo.js` (un área «a mejorar» si sus
  dos preguntas suman 2 o más sobre 4); estilos en LW-styles, `src/partials/dynamic/_autodiagnostico.less`.
- Pantalla final: triángulo de áreas (posición calculada con las respuestas, ver `geometriaTriangulo`), retos, punto
  fuerte, recurso recomendado (portada A4 + email + Descargar), «Próximos pasos» (propuesta compuesta con `propuestaDe` +
  invitación a llamada o a escribir con nombre, email y mensaje) y, al pie, «Ver respuestas» (editar y guardar) y
  «Repetir el diagnóstico».
- Opcional, antes del script: `window.AutodiagnosticoConfig = { calendlyUrl, contactoEmail, onLeadMagnet(datos),
  onContacto(datos) }` (los `on…` pueden devolver una promesa). Sin `calendlyUrl` no se muestra «Reservar una llamada»;
  sin `onContacto`, «Enviar» abre el correo de la persona. Eventos en `document`: `posso:autodiagnostico:` + `inicio`,
  `completado`, `actualizado`, `lead-magnet`, `contacto`, `llamada` (también a `dataLayer` si existe).
