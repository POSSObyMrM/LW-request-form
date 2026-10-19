(() => {
  // src/template.js
  var dossierModalTemplate = `
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
        <input type="text" id="dossier-nombre" required placeholder="Ej. Andrea P\xE9rez">
        <span class="dossier-field-error" id="dossier-nombre-error"></span>
      </div>

      <div class="dossier-input-group">
        <label for="dossier-email">Correo electr\xF3nico *</label>
        <input type="email" id="dossier-email" required placeholder="ejemplo@correo.com">
        <span class="dossier-field-error" id="dossier-email-error"></span>
      </div>

      <div class="dossier-input-group" id="dossier-empresa-group" hidden>
        <label for="dossier-empresa">Empresa</label>
        <input type="text" id="dossier-empresa" placeholder="Ej. Acme S.L.">
      </div>

      <div class="dossier-input-group" id="dossier-cargo-group" hidden>
        <label for="dossier-cargo">Cargo</label>
        <input type="text" id="dossier-cargo" placeholder="Ej. Responsable de formaci\xF3n">
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
                  Acepto los <a href="/terms" target="_blank" rel="noopener">T\xE9rminos y Condiciones</a> y la <a href="/privacy" target="_blank" rel="noopener">Pol\xEDtica de Privacidad</a> *
              </div>
          </label>
          <span class="dossier-field-error" id="dossier-terms-error"></span>
      </div>

      <button type="submit" id="dossier-submit-btn" class="learnworlds-button">Solicitar Dossier</button>
    </form>
  </div>
</div>
`;

  // src/utm.js
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var STORAGE_KEY = "posso_utms";
  function getUTMParams() {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
      return utms;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // src/request-types.js
  var PLACEHOLDER = /\{\{\s*course\s*\}\}/g;
  function renderTemplate(template, courseName) {
    return template.replace(PLACEHOLDER, courseName);
  }
  var DEFAULT_REQUEST_TYPES = {
    dossier: {
      triggerClass: "btn-dossier-request",
      payloadType: "dossier",
      modalTitle: "Descargar Dossier",
      subtitleTemplate: "Te enviaremos el dossier del {{course}}.",
      submitLabel: "Solicitar Dossier",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Revisa tu bandeja de entrada, el dossier va en camino.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {
        processingLabel: "Procesando...",
        sentLabel: "\xA1Enviado!",
        successAlert: "\xA1Listo! Te acabamos de enviar el dossier a tu correo electr\xF3nico.",
        errorAlert: "Hubo un problema. Por favor, int\xE9ntalo de nuevo."
      }
    },
    // Recursos que gestiona POSSO Admin (no Make): el formulario llama a
    // RequestFormConfig.possoUrl con el código "recurso" dado de alta en
    // POSSO → Configuración → Recursos descargables. Siempre abre el popup
    // (hace falta el consentimiento explícito, también con sesión iniciada).
    // "textoConsentimiento" debe ser el MISMO texto configurado en POSSO.
    incompany: {
      triggerClass: "btn-incompany-request",
      recurso: "dossier-incompany",
      camposEmpresa: true,
      textoConsentimiento: "Acepto que POSSO trate mis datos para enviarme este recurso y contactarme con informaci\xF3n sobre sus formaciones. Puedo darme de baja en cualquier momento.",
      modalTitle: "Descargar Dossier InCompany",
      subtitleTemplate: "Te enviaremos por email el dossier de formaci\xF3n InCompany.",
      submitLabel: "Solicitar Dossier",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Revisa tu bandeja de entrada, el dossier va en camino.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {}
    },
    // Solicitud de beca (POSSO Admin → Becas). Los campos NO están aquí: se construyen con la configuración de la
    // convocatoria que da POSSO (GET /api/public/becas/{codigo}). El botón indica la convocatoria con data-beca="codigo" (o
    // RequestFormConfig.becaCodigo) y, si se quiere, un curso ya elegido con data-curso="codigo-del-curso".
    beca: {
      triggerClass: "btn-beca-request",
      beca: true,
      modalTitle: "Solicitud de beca",
      subtitleTemplate: "",
      submitLabel: "Enviar solicitud",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Hemos recibido tu solicitud. Te hemos enviado un email de confirmaci\xF3n con la fecha de resoluci\xF3n.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {}
    },
    info: {
      triggerClass: "btn-info-request",
      payloadType: "info",
      modalTitle: "Avisarme de Novedades",
      subtitleTemplate: "Te avisaremos en cuanto haya novedades sobre el {{course}}.",
      submitLabel: "Avisarme",
      sendingLabel: "Enviando...",
      successAlert: "\xA1Gracias! Te avisaremos en cuanto tengamos novedades.",
      errorAlert: "Ocurri\xF3 un error. Por favor int\xE9ntalo de nuevo.",
      loggedIn: {
        processingLabel: "Procesando...",
        sentLabel: "\xA1Enviado!",
        successAlert: "\xA1Listo! Te avisaremos por correo en cuanto haya novedades.",
        errorAlert: "Hubo un problema. Por favor, int\xE9ntalo de nuevo."
      }
    }
  };
  function mergeRequestTypes(defaults, overrides) {
    const result = {};
    const keys = /* @__PURE__ */ new Set([...Object.keys(defaults), ...Object.keys(overrides || {})]);
    keys.forEach((key) => {
      const base = defaults[key] || {};
      const override = overrides && overrides[key] || {};
      result[key] = {
        ...base,
        ...override,
        loggedIn: { ...base.loggedIn || {}, ...override.loggedIn || {} }
      };
    });
    return result;
  }

  // src/beca-form.js
  var LOG_PREFIX = "[RequestForm:beca]";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var POSSO_BASE_POR_DEFECTO = "https://admin.posso.es";
  var URL_RE = /(https?:\/\/[^\s)]+)/g;
  var estado = null;
  var etiquetaNombreOriginal = null;
  function el(tag, attrs, hijos) {
    const nodo = document.createElement(tag);
    Object.keys(attrs || {}).forEach((k) => {
      if (k === "text") nodo.textContent = attrs[k];
      else if (k === "class") nodo.className = attrs[k];
      else nodo.setAttribute(k, attrs[k]);
    });
    (hijos || []).forEach((h) => nodo.append(h));
    return nodo;
  }
  function possoBase(config) {
    let base = config.possoBaseUrl;
    if (!base && config.possoUrl) {
      try {
        base = new URL(config.possoUrl).origin;
      } catch (e) {
        base = null;
      }
    }
    return (base || POSSO_BASE_POR_DEFECTO).replace(/\/+$/, "");
  }
  function conEnlaces(texto) {
    const nodos = [];
    let ultimo = 0;
    texto.replace(URL_RE, (url, _g, indice) => {
      if (indice > ultimo) nodos.push(texto.slice(ultimo, indice));
      nodos.push(el("a", { href: url, target: "_blank", rel: "noopener", text: url }));
      ultimo = indice + url.length;
      return url;
    });
    if (ultimo < texto.length) nodos.push(texto.slice(ultimo));
    return nodos;
  }
  function fechaCorta(iso) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" });
  }
  function fechaHoraCorta(iso) {
    return new Date(iso).toLocaleString("es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
  }
  function setError(campo, mensaje) {
    const error = document.getElementById(campo.errorId);
    if (error) error.textContent = mensaje || "";
    (campo.marcar || []).forEach((id) => {
      const nodo = document.getElementById(id);
      if (nodo) nodo.classList.toggle("dossier-input-invalid", !!mensaje);
    });
  }
  function grupo(campo, etiquetaTexto, control, ayuda) {
    const label = el("label", { for: campo.id, text: etiquetaTexto + (campo.obligatorio ? " *" : "") });
    const hijos = [label, control];
    if (ayuda) hijos.push(el("small", { class: "dossier-field-hint", id: campo.id + "-hint", text: ayuda }));
    hijos.push(el("span", { class: "dossier-field-error", id: campo.errorId }));
    return el("div", { class: "dossier-input-group" }, hijos);
  }
  function conRequisitos(campo, nodo) {
    if (campo.requisitosId) nodo.querySelector("label").after(el("div", { class: "dossier-requisitos", id: campo.requisitosId }));
    return nodo;
  }
  function pintarPregunta(p) {
    const id = "beca-q-" + p.clave;
    const campo = {
      requisitosId: p.mostrarRequisitosCurso ? id + "-requisitos" : null,
      id,
      errorId: id + "-error",
      clave: p.clave,
      tipo: p.tipo,
      obligatorio: !!p.obligatorio,
      maxCaracteres: p.maxCaracteres || null,
      opciones: p.opciones || [],
      etiqueta: p.etiqueta,
      marcar: [id]
    };
    if (p.tipo === "select") {
      const select = el("select", { id }, [el("option", { value: "", text: "Selecciona una opci\xF3n" })]);
      campo.opciones.forEach((o) => select.append(el("option", { value: o, text: o })));
      return { campo, nodo: conRequisitos(campo, grupo(campo, p.etiqueta, select, p.ayuda)) };
    }
    if (p.tipo === "radio") {
      const opciones = el("div", { class: "dossier-radio-group", id, role: "radiogroup" });
      campo.opciones.forEach((o, i) => {
        const input2 = el("input", { type: "radio", name: id, id: id + "-" + i, value: o });
        opciones.append(el("label", { class: "dossier-radio-option", for: id + "-" + i }, [input2, " " + o]));
      });
      campo.marcar = [];
      const g = grupo(campo, p.etiqueta, opciones, p.ayuda);
      g.querySelector("label").removeAttribute("for");
      return { campo, nodo: conRequisitos(campo, g) };
    }
    if (p.tipo === "textarea") {
      const area = el("textarea", { id, rows: "4" });
      if (campo.maxCaracteres) area.setAttribute("maxlength", String(campo.maxCaracteres));
      const g = grupo(campo, p.etiqueta, area, p.ayuda);
      if (campo.maxCaracteres) {
        const contador = el("span", { class: "dossier-char-count", id: id + "-count", text: "0/" + campo.maxCaracteres });
        area.addEventListener("input", () => {
          contador.textContent = area.value.length + "/" + campo.maxCaracteres;
        });
        g.insertBefore(contador, g.querySelector(".dossier-field-error"));
      }
      return { campo, nodo: conRequisitos(campo, g) };
    }
    const input = el("input", { type: "text", id });
    if (campo.maxCaracteres) input.setAttribute("maxlength", String(campo.maxCaracteres));
    return { campo, nodo: conRequisitos(campo, grupo(campo, p.etiqueta, input, p.ayuda)) };
  }
  function valorCampo(campo) {
    if (campo.tipo === "radio") {
      const marcado = document.querySelector('input[name="' + campo.id + '"]:checked');
      return marcado ? marcado.value : "";
    }
    const nodo = document.getElementById(campo.id);
    return nodo ? nodo.value.trim() : "";
  }
  function contenedor() {
    const form = document.getElementById("dossierForm");
    let caja = document.getElementById("beca-extra-fields");
    if (!caja) {
      caja = el("div", { id: "beca-extra-fields" });
      const trampa = document.getElementById("dossier-website");
      form.insertBefore(caja, trampa);
    }
    return caja;
  }
  function pintar(config, becaConfig, cursoPreseleccionado) {
    const caja = contenedor();
    caja.hidden = false;
    caja.replaceChildren();
    const campos = [];
    const etiquetaNombre = document.querySelector('label[for="dossier-nombre"]');
    if (etiquetaNombre) {
      if (etiquetaNombreOriginal === null) etiquetaNombreOriginal = etiquetaNombre.textContent;
      etiquetaNombre.textContent = "Nombre y apellidos *";
    }
    const telefono = { id: "beca-telefono", errorId: "beca-telefono-error", clave: "telefono", tipo: "tel", obligatorio: true, marcar: ["beca-telefono"], etiqueta: "Tel\xE9fono" };
    caja.append(grupo(telefono, "Tel\xE9fono", el("input", { type: "tel", id: "beca-telefono", autocomplete: "tel" })));
    campos.push(telefono);
    const curso = { id: "beca-curso", errorId: "beca-curso-error", clave: "curso", tipo: "select", obligatorio: true, marcar: ["beca-curso"], etiqueta: "Curso" };
    const select = el("select", { id: "beca-curso" }, [el("option", { value: "", text: "Selecciona un curso" })]);
    becaConfig.cursos.forEach((c) => {
      const opcion = el("option", { value: c.codigo, text: c.nombre + (c.abierto ? " (cierre " + fechaCorta(c.cierre) + ")" : " (plazo cerrado)") });
      if (!c.abierto) opcion.disabled = true;
      select.append(opcion);
    });
    const grupoCurso = grupo(curso, "Curso al que solicitas la beca", select);
    const info = el("div", { class: "dossier-field-hint", id: "beca-curso-info" });
    grupoCurso.insertBefore(info, grupoCurso.querySelector(".dossier-field-error"));
    caja.append(grupoCurso);
    campos.push(curso);
    const preguntasConRequisitos = becaConfig.preguntas.filter((p) => p.mostrarRequisitosCurso);
    select.addEventListener("change", () => {
      const c = becaConfig.cursos.find((x) => x.codigo === select.value);
      const partes = [];
      if (c) {
        partes.push("Cierre de solicitudes: " + fechaHoraCorta(c.cierre) + ". Resoluci\xF3n: " + fechaCorta(c.fechaResolucion) + ".");
        if (c.requisitos && preguntasConRequisitos.length === 0) partes.push("Requisitos t\xE9cnicos: " + c.requisitos);
      }
      info.textContent = partes.join(" ");
      preguntasConRequisitos.forEach((p) => {
        const caja3 = document.getElementById("beca-q-" + p.clave + "-requisitos");
        if (caja3) caja3.textContent = c && c.requisitos ? "Requisitos t\xE9cnicos del curso: " + c.requisitos : "";
      });
    });
    becaConfig.preguntas.forEach((p) => {
      const { campo, nodo } = pintarPregunta(p);
      caja.append(nodo);
      campos.push(campo);
    });
    const declaracion = { id: "beca-declaracion", errorId: "beca-declaracion-error", clave: "declaracion", tipo: "checkbox", obligatorio: true, marcar: [], etiqueta: "Declaraci\xF3n responsable" };
    const caja2 = el("div", { class: "lead-form__optin-checkbox" }, [
      el("label", { for: "beca-declaracion", class: "checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left" }, [
        el("input", { class: "checkbox flexible-part js-optin-checkbox", type: "checkbox", id: "beca-declaracion" }),
        el("div", { class: "checkbox-box lw-border-color-fadeout80 flexible-part" }, [el("span", { class: "learnworlds-icon learnworlds-heading3-small fas fa-check" })]),
        el("div", { class: "flexible-part" }, [...conEnlaces(becaConfig.textoDeclaracion), " *"])
      ]),
      el("span", { class: "dossier-field-error", id: "beca-declaracion-error" })
    ]);
    caja.append(caja2);
    campos.push(declaracion);
    const etiquetaTerminos = document.getElementById("dossier-terms-label");
    etiquetaTerminos.replaceChildren(...conEnlaces(becaConfig.textoConsentimiento), " *");
    campos.push({ id: "dossier-terms", errorId: "dossier-terms-error", clave: "consentimiento", tipo: "checkbox", obligatorio: true, marcar: [] });
    quitarMarketing();
    if (becaConfig.textoMarketing) {
      const marketing = el("div", { class: "lead-form__optin-checkbox", id: "beca-marketing-wrapper" }, [
        el("label", { for: "beca-marketing", class: "checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left" }, [
          el("input", { class: "checkbox flexible-part js-optin-checkbox", type: "checkbox", id: "beca-marketing" }),
          el("div", { class: "checkbox-box lw-border-color-fadeout80 flexible-part" }, [el("span", { class: "learnworlds-icon learnworlds-heading3-small fas fa-check" })]),
          el("div", { class: "flexible-part" }, conEnlaces(becaConfig.textoMarketing))
        ])
      ]);
      document.getElementById("dossier-terms").closest(".lead-form__optin-checkbox").after(marketing);
    }
    if (cursoPreseleccionado) {
      const c = becaConfig.cursos.find((x) => x.codigo === cursoPreseleccionado);
      if (c && c.abierto) {
        select.value = c.codigo;
        select.dispatchEvent(new Event("change"));
      }
    }
    estado = { config: becaConfig, campos };
  }
  function quitarMarketing() {
    const m = document.getElementById("beca-marketing-wrapper");
    if (m) m.remove();
  }
  function limpiarFormularioBeca() {
    quitarMarketing();
    const formulario = document.getElementById("dossierForm");
    if (formulario) formulario.classList.remove("beca-form");
    const caja = document.getElementById("beca-extra-fields");
    if (caja) {
      caja.replaceChildren();
      caja.hidden = true;
    }
    const etiquetaNombre = document.querySelector('label[for="dossier-nombre"]');
    if (etiquetaNombre && etiquetaNombreOriginal !== null) etiquetaNombre.textContent = etiquetaNombreOriginal;
    ["dossier-terms-error", "dossier-nombre-error", "dossier-email-error"].forEach((id) => {
      const e = document.getElementById(id);
      if (e) e.textContent = "";
    });
    estado = null;
  }
  function abrirBeca({ config, typeConfig, boton, modal, titleEl, subtitleEl, submitBtn, loggedInUser }) {
    const codigo = (boton.getAttribute("data-beca") || config.becaCodigo || "").trim();
    const cursoPre = (boton.getAttribute("data-curso") || "").trim();
    if (!codigo) {
      console.error(LOG_PREFIX, "Falta data-beca en el bot\xF3n (o RequestFormConfig.becaCodigo): no se sabe de qu\xE9 convocatoria es.");
      alert("No hemos podido abrir el formulario. Por favor, int\xE9ntalo de nuevo m\xE1s tarde.");
      return;
    }
    limpiarFormularioBeca();
    document.getElementById("dossierForm").classList.add("beca-form");
    titleEl.textContent = typeConfig.modalTitle;
    subtitleEl.textContent = "Cargando el formulario\u2026";
    submitBtn.textContent = typeConfig.submitLabel;
    submitBtn.disabled = true;
    modal.style.display = "block";
    fetch(possoBase(config) + "/api/public/becas/" + encodeURIComponent(codigo), { headers: { Accept: "application/json" } }).then((res) => res.json().then((cuerpo) => ({ ok: res.ok, cuerpo }))).then(({ ok, cuerpo }) => {
      if (!ok || !cuerpo || !cuerpo.config) throw new Error("config no disponible");
      const becaConfig = cuerpo.config;
      becaConfig.codigo = becaConfig.codigo || codigo;
      titleEl.textContent = becaConfig.titulo;
      subtitleEl.textContent = becaConfig.introduccion || "";
      pintar(config, becaConfig, cursoPre);
      estado.codigo = becaConfig.codigo;
      if (loggedInUser && loggedInUser.email) {
        document.getElementById("dossier-email").value = loggedInUser.email;
        const nombre = loggedInUser.name || [loggedInUser.first_name, loggedInUser.last_name].filter(Boolean).join(" ");
        if (nombre) document.getElementById("dossier-nombre").value = nombre;
      }
      const hayAbiertos = becaConfig.cursos.some((c) => c.abierto);
      if (!hayAbiertos) {
        subtitleEl.textContent = "El plazo de solicitud de todos los cursos de esta convocatoria ha terminado.";
        submitBtn.disabled = true;
      } else {
        submitBtn.disabled = false;
      }
    }).catch((err) => {
      console.error(LOG_PREFIX, "no se pudo cargar la convocatoria", err);
      subtitleEl.textContent = "No hemos podido cargar el formulario. Int\xE9ntalo de nuevo en unos minutos.";
    });
  }
  function becaCargada() {
    return !!estado;
  }
  function validarBeca() {
    if (!estado) return false;
    let valido = true;
    const nombre = document.getElementById("dossier-nombre").value.trim();
    const email = document.getElementById("dossier-email").value.trim();
    const fallo = (campo, mensaje) => {
      setError(campo, mensaje);
      if (mensaje) valido = false;
    };
    fallo({ errorId: "dossier-nombre-error", marcar: ["dossier-nombre"] }, nombre.length < 2 ? "Este campo es obligatorio." : "");
    fallo({ errorId: "dossier-email-error", marcar: ["dossier-email"] }, !email ? "Este campo es obligatorio." : !EMAIL_RE.test(email) ? "Introduce un correo electr\xF3nico v\xE1lido." : "");
    estado.campos.forEach((c) => {
      if (c.clave === "consentimiento") {
        fallo(c, document.getElementById("dossier-terms").checked ? "" : "Debes aceptar la protecci\xF3n de datos para continuar.");
        return;
      }
      if (c.clave === "declaracion") {
        fallo(c, document.getElementById("beca-declaracion").checked ? "" : "Debes aceptar la declaraci\xF3n responsable.");
        return;
      }
      const valor = c.tipo === "tel" || c.tipo === "select" || c.tipo === "radio" || c.tipo === "textarea" || c.tipo === "texto" ? valorCampo(c) : "";
      if (!valor) {
        fallo(c, c.obligatorio ? c.tipo === "select" || c.tipo === "radio" ? "Selecciona una opci\xF3n." : "Este campo es obligatorio." : "");
        return;
      }
      if (c.clave === "telefono" && valor.replace(/[^\d]/g, "").length < 6) return fallo(c, "Introduce un tel\xE9fono v\xE1lido.");
      if (c.maxCaracteres && valor.length > c.maxCaracteres) return fallo(c, "M\xE1ximo " + c.maxCaracteres + " caracteres.");
      fallo(c, "");
    });
    console.log(LOG_PREFIX, "validaci\xF3n", { valido });
    return valido;
  }
  function postJson(url, payload) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then((res) => res.json().catch(() => ({})).then((cuerpo) => ({ ok: res.ok, status: res.status, cuerpo }))).catch((err) => {
      console.error(LOG_PREFIX, "error de red", err);
      return { ok: false, status: 0, cuerpo: {} };
    });
  }
  async function enviarBeca({ config, utms, pageUrl, tracking }) {
    const respuestas = {};
    estado.campos.forEach((c) => {
      if (c.clave === "telefono" || c.clave === "curso" || c.clave === "declaracion" || c.clave === "consentimiento") return;
      const v = valorCampo(c);
      if (v) respuestas[c.clave] = v;
    });
    const payload = Object.assign(
      {
        convocatoria: estado.codigo,
        curso: document.getElementById("beca-curso").value,
        nombre: document.getElementById("dossier-nombre").value.trim(),
        email: document.getElementById("dossier-email").value.trim(),
        telefono: document.getElementById("beca-telefono").value.trim(),
        respuestas,
        declaracion: document.getElementById("beca-declaracion").checked,
        consentimiento: document.getElementById("dossier-terms").checked,
        marketing: !!(document.getElementById("beca-marketing") && document.getElementById("beca-marketing").checked),
        website: document.getElementById("dossier-website").value,
        url: pageUrl,
        utm_source: utms.utm_source || "",
        utm_medium: utms.utm_medium || "",
        utm_campaign: utms.utm_campaign || "",
        utm_term: utms.utm_term || "",
        utm_content: utms.utm_content || ""
      },
      tracking
    );
    console.log(LOG_PREFIX, "enviando solicitud", payload.convocatoria, payload.curso);
    const r = await postJson(possoBase(config) + "/api/public/becas/solicitar", payload);
    if (r.ok) return { ok: true };
    if (r.status === 409) return { ok: false, mensaje: r.cuerpo && r.cuerpo.error || "El plazo de solicitud de este curso ha terminado." };
    if (r.status === 400) {
      const claves = r.cuerpo && r.cuerpo.campos || [];
      estado.campos.forEach((c) => {
        if (claves.indexOf(c.clave) !== -1) setError(c, "Revisa este campo.");
      });
      return { ok: false, mensaje: "Revisa los campos marcados e int\xE9ntalo de nuevo." };
    }
    return { ok: false, mensaje: null };
  }

  // src/request-form.js
  var LOG_PREFIX2 = "[RequestForm]";
  var EMAIL_RE2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var POSSO_URL_POR_DEFECTO = "https://admin.posso.es/api/public/recursos/solicitar";
  console.log(LOG_PREFIX2, "script parsed, readyState =", document.readyState);
  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message || "";
    if (input) input.classList.toggle("dossier-input-invalid", !!message);
  }
  function validateDossierForm() {
    const nombre = document.getElementById("dossier-nombre").value.trim();
    const email = document.getElementById("dossier-email").value.trim();
    const termsAccepted = document.getElementById("dossier-terms").checked;
    let isValid = true;
    if (!nombre) {
      setFieldError("dossier-nombre", "dossier-nombre-error", "Este campo es obligatorio.");
      isValid = false;
    } else {
      setFieldError("dossier-nombre", "dossier-nombre-error", "");
    }
    if (!email) {
      setFieldError("dossier-email", "dossier-email-error", "Este campo es obligatorio.");
      isValid = false;
    } else if (!EMAIL_RE2.test(email)) {
      setFieldError("dossier-email", "dossier-email-error", "Introduce un correo electr\xF3nico v\xE1lido.");
      isValid = false;
    } else {
      setFieldError("dossier-email", "dossier-email-error", "");
    }
    if (!termsAccepted) {
      setFieldError("dossier-terms", "dossier-terms-error", "Debes aceptar los T\xE9rminos y la Pol\xEDtica de Privacidad.");
      isValid = false;
    } else {
      setFieldError("dossier-terms", "dossier-terms-error", "");
    }
    console.log(LOG_PREFIX2, "form validation", { nombreOk: !!nombre, emailOk: EMAIL_RE2.test(email), termsAccepted, isValid });
    return isValid;
  }
  function injectModal() {
    if (document.getElementById("dossierModal")) {
      console.log(LOG_PREFIX2, "#dossierModal already present, skipping injection");
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = dossierModalTemplate.trim();
    document.body.appendChild(wrapper.firstElementChild);
    console.log(LOG_PREFIX2, "modal injected:", !!document.getElementById("dossierModal"));
  }
  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }
  function generateEventId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  function getTrackingFields() {
    return {
      event_id: generateEventId(),
      user_agent: navigator.userAgent || "",
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc")
    };
  }
  function sendToWebhook(webhookUrl, payload, callback) {
    payload = Object.assign({}, payload, getTrackingFields());
    console.log(LOG_PREFIX2, "sending to webhook", webhookUrl, payload);
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((res) => {
      console.log(LOG_PREFIX2, "webhook response", res.status, res.ok);
      callback(res.ok);
    }).catch((err) => {
      console.error(LOG_PREFIX2, "error webhook:", err);
      callback(false);
    });
  }
  function detectCourse() {
    let courseId = "curso-desconocido";
    const pathSegments = window.location.pathname.split("/");
    const courseIdx = pathSegments.indexOf("course");
    if (courseIdx !== -1 && pathSegments[courseIdx + 1]) {
      courseId = pathSegments[courseIdx + 1];
    }
    let courseName = "";
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle && metaOgTitle.getAttribute("content")) {
      courseName = metaOgTitle.getAttribute("content");
    } else {
      courseName = document.title.split("|")[0].trim();
    }
    console.log(LOG_PREFIX2, "detected course", { courseId, courseName });
    return { courseId, courseName };
  }
  var textoTerminosOriginal = null;
  function prepararCamposRecurso(typeConfig) {
    const conEmpresa = !!(typeConfig.recurso && typeConfig.camposEmpresa);
    document.getElementById("dossier-empresa-group").hidden = !conEmpresa;
    document.getElementById("dossier-cargo-group").hidden = !conEmpresa;
    const etiqueta = document.getElementById("dossier-terms-label");
    if (textoTerminosOriginal === null) textoTerminosOriginal = etiqueta.innerHTML;
    if (typeConfig.recurso && typeConfig.textoConsentimiento) {
      etiqueta.textContent = typeConfig.textoConsentimiento + " ";
      const enlace = document.createElement("a");
      enlace.href = "/privacy";
      enlace.target = "_blank";
      enlace.rel = "noopener";
      enlace.textContent = "Pol\xEDtica de Privacidad";
      etiqueta.append("(", enlace, ") *");
    } else {
      etiqueta.innerHTML = textoTerminosOriginal;
    }
  }
  function findRequestType(requestTypes, target) {
    const key = Object.keys(requestTypes).find(
      (typeKey) => target.classList.contains(requestTypes[typeKey].triggerClass)
    );
    if (key) return { key, config: requestTypes[key], element: target };
    const keyBeca = Object.keys(requestTypes).find(
      (typeKey) => requestTypes[typeKey].beca && target.closest("." + requestTypes[typeKey].triggerClass)
    );
    return keyBeca ? { key: keyBeca, config: requestTypes[keyBeca], element: target.closest("." + requestTypes[keyBeca].triggerClass) } : null;
  }
  function init() {
    console.log(LOG_PREFIX2, "init() running");
    const config = window.RequestFormConfig || {};
    const webhookUrl = config.webhookUrl;
    const requestTypes = mergeRequestTypes(DEFAULT_REQUEST_TYPES, config.requestTypes);
    console.log(LOG_PREFIX2, "config read", {
      hasWebhookUrl: !!webhookUrl,
      triggerClasses: Object.values(requestTypes).map((t) => t.triggerClass)
    });
    if (!webhookUrl) {
      console.error(LOG_PREFIX2, "Falta window.RequestFormConfig.webhookUrl antes de cargar este script. El formulario no podr\xE1 enviarse.");
    }
    injectModal();
    const modal = document.getElementById("dossierModal");
    const closeBtn = modal ? modal.querySelector(".dossier-modal-close") : null;
    const form = document.getElementById("dossierForm");
    const titleEl = document.getElementById("dossier-course-title");
    const subtitleEl = document.getElementById("dossier-course-subtitle");
    const submitBtn = document.getElementById("dossier-submit-btn");
    console.log(LOG_PREFIX2, "element lookup", {
      modal: !!modal,
      closeBtn: !!closeBtn,
      form: !!form,
      titleEl: !!titleEl,
      subtitleEl: !!subtitleEl,
      submitBtn: !!submitBtn
    });
    if (!modal) {
      console.error(LOG_PREFIX2, "#dossierModal not found in DOM after injection, aborting init()");
      return;
    }
    let activeRequestKey = null;
    document.body.addEventListener("click", function(e) {
      if (!e.target) return;
      const triggerSelector = Object.values(requestTypes).map((t) => "." + t.triggerClass).join(", ");
      const closestTrigger = e.target.closest(triggerSelector);
      console.log(LOG_PREFIX2, "click detected", {
        tag: e.target.tagName,
        classes: e.target.className,
        exactMatch: !!findRequestType(requestTypes, e.target),
        closestMatch: !!closestTrigger
      });
      const match = findRequestType(requestTypes, e.target);
      if (!match) {
        if (closestTrigger) {
          console.warn(
            LOG_PREFIX2,
            "click landed on a child of a trigger element (e.g. an icon/span inside the button) \u2014 exact e.target match failed. Trigger element was:",
            closestTrigger
          );
        }
        return;
      }
      e.preventDefault();
      const btn = match.element;
      const { key: requestKey, config: typeConfig } = match;
      console.log(LOG_PREFIX2, "matched request type", requestKey);
      const { courseId, courseName } = detectCourse();
      const pageUrl = window.location.href;
      let loggedInUser = null;
      const utms = getUTMParams();
      if (window.LearnWorlds && window.LearnWorlds.analytics && window.LearnWorlds.analytics.user) {
        loggedInUser = window.LearnWorlds.analytics.user;
      }
      console.log(LOG_PREFIX2, "logged in user?", loggedInUser);
      if (typeConfig.beca) {
        activeRequestKey = requestKey;
        document.getElementById("modal-course-id").value = courseId;
        document.getElementById("modal-course-name").value = courseName;
        document.getElementById("modal-page-url").value = pageUrl;
        prepararCamposRecurso(typeConfig);
        abrirBeca({ config, typeConfig, boton: btn, modal, titleEl, subtitleEl, submitBtn, loggedInUser });
        return;
      }
      limpiarFormularioBeca();
      if (typeConfig.recurso) {
        activeRequestKey = requestKey;
        document.getElementById("modal-course-id").value = courseId;
        document.getElementById("modal-course-name").value = courseName;
        document.getElementById("modal-page-url").value = pageUrl;
        if (loggedInUser && loggedInUser.email) {
          document.getElementById("dossier-email").value = loggedInUser.email;
          const nombreSesion = loggedInUser.name || [loggedInUser.first_name, loggedInUser.last_name].filter(Boolean).join(" ");
          if (nombreSesion) document.getElementById("dossier-nombre").value = nombreSesion;
        }
        prepararCamposRecurso(typeConfig);
        titleEl.textContent = typeConfig.modalTitle;
        subtitleEl.innerText = renderTemplate(typeConfig.subtitleTemplate, courseName);
        submitBtn.textContent = typeConfig.submitLabel;
        modal.style.display = "block";
        return;
      }
      if (loggedInUser && loggedInUser.email) {
        const originalText = btn.innerText;
        btn.innerText = typeConfig.loggedIn.processingLabel;
        btn.disabled = true;
        const payload = {
          email: loggedInUser.email,
          nombre: loggedInUser.name || (loggedInUser.first_name ? loggedInUser.first_name + " " + (loggedInUser.last_name || "") : "Usuario Registrado"),
          course_id: courseId,
          course_name: courseName,
          page_url: pageUrl,
          request_type: typeConfig.payloadType,
          logged_in: true,
          utm_source: utms.utm_source || "",
          utm_medium: utms.utm_medium || "",
          utm_campaign: utms.utm_campaign || "",
          utm_term: utms.utm_term || "",
          utm_content: utms.utm_content || ""
        };
        sendToWebhook(webhookUrl, payload, function(esExitoso) {
          if (esExitoso) {
            btn.innerText = typeConfig.loggedIn.sentLabel;
            alert(typeConfig.loggedIn.successAlert);
          } else {
            btn.innerText = originalText;
            btn.disabled = false;
            alert(typeConfig.loggedIn.errorAlert);
          }
        });
      } else {
        activeRequestKey = requestKey;
        document.getElementById("modal-course-id").value = courseId;
        document.getElementById("modal-course-name").value = courseName;
        document.getElementById("modal-page-url").value = pageUrl;
        prepararCamposRecurso(typeConfig);
        titleEl.textContent = typeConfig.modalTitle;
        subtitleEl.innerText = renderTemplate(typeConfig.subtitleTemplate, courseName);
        submitBtn.textContent = typeConfig.submitLabel;
        modal.style.display = "block";
        console.log(LOG_PREFIX2, "modal opened, display =", modal.style.display);
      }
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
      });
    }
    window.addEventListener("click", function(e) {
      if (e.target === modal) modal.style.display = "none";
    });
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        const typeConfig = requestTypes[activeRequestKey];
        if (!typeConfig) return;
        if (typeConfig.beca) {
          if (!becaCargada()) return;
          if (!validarBeca()) {
            console.warn(LOG_PREFIX2, "submit blocked by validation (beca)");
            return;
          }
          submitBtn.textContent = typeConfig.sendingLabel;
          submitBtn.disabled = true;
          enviarBeca({ config, utms: getUTMParams(), pageUrl: document.getElementById("modal-page-url").value, tracking: getTrackingFields() }).then((r) => {
            submitBtn.disabled = false;
            submitBtn.textContent = typeConfig.submitLabel;
            if (r.ok) {
              modal.style.display = "none";
              form.reset();
              limpiarFormularioBeca();
              alert(typeConfig.successAlert);
            } else {
              alert(r.mensaje || typeConfig.errorAlert);
            }
          });
          return;
        }
        if (!validateDossierForm()) {
          console.warn(LOG_PREFIX2, "submit blocked by validation");
          return;
        }
        submitBtn.textContent = typeConfig.sendingLabel;
        submitBtn.disabled = true;
        const utms = getUTMParams();
        const alTerminar = function(esExitoso) {
          submitBtn.disabled = false;
          submitBtn.textContent = typeConfig.submitLabel;
          if (esExitoso) {
            modal.style.display = "none";
            form.reset();
            alert(typeConfig.successAlert);
          } else {
            alert(typeConfig.errorAlert);
          }
        };
        if (typeConfig.recurso) {
          const valor = (id) => document.getElementById(id).value.trim();
          sendToWebhook(
            config.possoUrl || POSSO_URL_POR_DEFECTO,
            {
              recurso: typeConfig.recurso,
              nombre: valor("dossier-nombre"),
              email: valor("dossier-email"),
              empresa: typeConfig.camposEmpresa ? valor("dossier-empresa") : "",
              cargo: typeConfig.camposEmpresa ? valor("dossier-cargo") : "",
              consentimiento: document.getElementById("dossier-terms").checked,
              website: document.getElementById("dossier-website").value,
              url: valor("modal-page-url"),
              utm_source: utms.utm_source || "",
              utm_medium: utms.utm_medium || "",
              utm_campaign: utms.utm_campaign || "",
              utm_term: utms.utm_term || "",
              utm_content: utms.utm_content || ""
            },
            alTerminar
          );
          return;
        }
        const payload = {
          email: document.getElementById("dossier-email").value,
          nombre: document.getElementById("dossier-nombre").value,
          course_id: document.getElementById("modal-course-id").value,
          course_name: document.getElementById("modal-course-name").value,
          page_url: document.getElementById("modal-page-url").value,
          request_type: typeConfig.payloadType,
          logged_in: false,
          utm_source: utms.utm_source || "",
          utm_medium: utms.utm_medium || "",
          utm_campaign: utms.utm_campaign || "",
          utm_term: utms.utm_term || "",
          utm_content: utms.utm_content || ""
        };
        sendToWebhook(webhookUrl, payload, function(esExitoso) {
          submitBtn.disabled = false;
          submitBtn.textContent = typeConfig.submitLabel;
          if (esExitoso) {
            modal.style.display = "none";
            form.reset();
            alert(typeConfig.successAlert);
          } else {
            alert(typeConfig.errorAlert);
          }
        });
      });
    }
    console.log(LOG_PREFIX2, "init() complete, listeners attached");
  }
  if (document.readyState === "loading") {
    console.log(LOG_PREFIX2, "deferring init() until DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
