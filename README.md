# LW Dossier Request Form

Injects a request modal/form into a LearnWorlds page and wires up all its
behavior (course auto-detection, UTM capture, logged-in vs logged-out flow,
webhook submission) from a single embeddable script. The same modal and
webhook serve multiple request "flavors" — e.g. requesting a dossier vs.
asking to be notified when one becomes available — distinguished purely by
the trigger button's CSS class and a small config object.

CSS is **not** included here — it's handled in a separate project and is
expected to already define styles for the classes/ids used below
(`dossier-modal-container`, `dossier-modal-box`, `dossier-modal-close`,
`dossier-input-group`, `#dossier-submit-btn`, etc).

## How it works

- Each request flavor ("request type") is defined in `src/request-types.js`
  and keyed by the CSS class of the button that triggers it. Ships with two:
  - `btn-dossier-request` — "Descargar Dossier" flow.
  - `btn-info-request` — "avísame de novedades" flow, for courses that don't
    have a dossier yet.
- Clicking any element with one of those classes opens the (shared) modal
  with that type's title/subtitle/button copy, or — if a LearnWorlds user is
  logged in (`window.LearnWorlds.analytics.user`) — sends the request
  straight to the webhook with no popup, using that type's alert copy.
- The webhook payload includes `request_type` (`"dossier"` or `"info"`) so
  the receiving automation (Make/Zapier) can branch on which flow fired.
- The course id/name are auto-detected from the URL path and the page's
  `og:title` meta tag (falling back to `document.title`).
- UTM params are captured from the URL and persisted in `localStorage` so
  attribution survives navigation.

## Project layout

- `src/dossier-form.js` — main logic, auto-runs on load.
- `src/request-types.js` — per-flow copy/config (titles, labels, alerts) and
  the merge logic for overriding/extending it.
- `src/template.js` — the modal's HTML markup (flavor-agnostic).
- `src/utm.js` — UTM capture/persistence helper.
- `dist/dossier-form.js` — bundled, single-file output for embedding.

## Build

```bash
npm install
npm run build       # dist/dossier-form.js
npm run build:min   # dist/dossier-form.min.js
npm run watch        # rebuild on change, for local development
```

## Embedding in LearnWorlds

Add this to the site's custom code / footer scripts. Set the webhook URL
via a config object **before** loading the bundle, so the URL doesn't need
to live in the committed/publicly-served JS file:

```html
<script>
  window.DossierFormConfig = {
    webhookUrl: 'https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxxxxxx'
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@main/dist/dossier-form.js"></script>
```

(Any static host works for the second `<script src>` — jsDelivr against
this GitHub repo, GitHub Pages, etc. — as long as it serves
`dist/dossier-form.js` over HTTPS.)

If `window.DossierFormConfig.webhookUrl` is missing, the script logs an
error to the console and the form/button flow will not be able to submit.

On any page, add a button/link with class `btn-dossier-request` or
`btn-info-request` to trigger the corresponding flow — no other markup or
JS is required, the script injects the modal itself.

### Customizing texts, or adding new request types

Override or extend the defaults from `src/request-types.js` via
`window.DossierFormConfig.requestTypes`, keyed by the same type name
(`dossier`, `info`, or a new one). Any field you omit falls back to the
default. `{{course}}` in `subtitleTemplate` is replaced with the detected
course name:

```html
<script>
  window.DossierFormConfig = {
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
