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

      <div class="dossier-input-group dossier-checkbox-group">
        <label for="dossier-terms">
          <input type="checkbox" id="dossier-terms" required>
          Acepto los <a href="https://posso.es/terms" target="_blank" rel="noopener">Términos y Condiciones</a> y la <a href="https://posso.es/privacy" target="_blank" rel="noopener">Política de Privacidad</a> *
        </label>
        <span class="dossier-field-error" id="dossier-terms-error"></span>
      </div>

      <button type="submit" id="dossier-submit-btn" class="learnworlds-button">Solicitar Dossier</button>
    </form>
  </div>
</div>
`;
