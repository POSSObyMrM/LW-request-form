export const dossierModalTemplate = `
<div id="dossierModal" class="dossier-modal-container">
  <div class="dossier-modal-box">
    <span class="dossier-modal-close">&times;</span>
    <h2 id="dossier-course-title" class="lw-widget-in learnworlds-subheading learnworlds-element learnworlds-subheading-small">Descargar Dossier</h2>
    <div id="dossier-course-subtitle" class="lw-widget-in learnworlds-main-text learnworlds-main-text-large learnworlds-element" data-element-id="textLarge" data-node-type="text">Revisa tu correo, te acabamos de enviar lo que nos has pedido.</div>

    <form id="dossierForm" novalidate>
      <input type="hidden" id="modal-course-id">
      <input type="hidden" id="modal-course-name">
      <input type="hidden" id="modal-page-url">

      <div class="dossier-input-group">
        <label for="dossier-nombre">Nombre completo *</label>
        <input type="text" id="dossier-nombre" required placeholder="Ej. Andrea Pérez">
        <span class="dossier-field-error" id="dossier-nombre-error"></span>
      </div>

      <div class="dossier-input-group">
        <label for="dossier-email">Correo electrónico *</label>
        <input type="email" id="dossier-email" required placeholder="ejemplo@correo.com">
        <span class="dossier-field-error" id="dossier-email-error"></span>
      </div>

      <div class="dossier-input-group" id="dossier-empresa-group" hidden>
        <label for="dossier-empresa">Empresa</label>
        <input type="text" id="dossier-empresa" placeholder="Ej. Acme S.L.">
      </div>

      <div class="dossier-input-group" id="dossier-cargo-group" hidden>
        <label for="dossier-cargo">Cargo</label>
        <input type="text" id="dossier-cargo" placeholder="Ej. Responsable de formación">
      </div>

      <!-- Campo trampa para bots (solicitudes a POSSO): invisible, no lo quites -->
      <input type="text" id="dossier-website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">

      <div class="lead-form__optin-checkbox">
          <label for="dossier-terms" class="checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left">
              <input class="checkbox flexible-part js-optin-checkbox" type="checkbox" data-gtm-form-interact-field-id="0" id="dossier-terms" required>
              <div class="checkbox-box lw-border-color-fadeout80 flexible-part">
                  <span class="learnworlds-icon learnworlds-heading3-small fas fa-check"></span>
              </div>
              <div class="flexible-part" id="dossier-terms-label">
                  Acepto los <a href="/terms" target="_blank" rel="noopener">Términos y Condiciones</a> y la <a href="/privacy" target="_blank" rel="noopener">Política de Privacidad</a> *
              </div>
          </label>
          <span class="dossier-field-error" id="dossier-terms-error"></span>
      </div>

      <button type="submit" id="dossier-submit-btn" class="learnworlds-button">Solicitar Dossier</button>
    </form>
  </div>
</div>
`;
