(() => {
  // src/autodiagnostico/datos.js
  var INTRO = {
    titulo: "Autodiagn\xF3stico",
    subtitulo: "Eval\xFAa c\xF3mo est\xE1 tu equipo en los tres territorios clave."
  };
  var AREAS = {
    A: {
      nombre: "Criterio y ejecuci\xF3n",
      reto: {
        titulo: "M\xE1s criterio, menos piloto autom\xE1tico",
        texto: "Tu equipo ejecuta, pero \xBFtambi\xE9n cuestiona, propone y toma decisiones? Aqu\xED hay margen para desarrollar un pensamiento m\xE1s estrat\xE9gico."
      },
      fortaleza: "Base t\xE9cnica s\xF3lida y criterio propio para resolver."
    },
    B: {
      nombre: "Colaboraci\xF3n, influencia y liderazgo",
      reto: {
        titulo: "Muchas reuniones. Pocas decisiones.",
        texto: "A veces los proyectos no avanzan por falta de liderazgo, comunicaci\xF3n o capacidad para ponerse de acuerdo."
      },
      fortaleza: "Saben coordinarse, decidir y defender sus ideas."
    },
    C: {
      nombre: "Cultura y estrategia",
      reto: {
        titulo: "Un equipo, no varias islas.",
        texto: "Cuando cada departamento va por su cuenta, cuesta compartir objetivos, coordinarse y avanzar juntos."
      },
      fortaleza: "El equipo entiende hacia d\xF3nde va la empresa."
    }
  };
  var ESCALA = ["No me preocupa", "Me preocupa un poco", "Me preocupa mucho"];
  var PREGUNTAS = [
    {
      tipo: "escala",
      area: "A",
      texto: "\xBFTe preocupa el nivel t\xE9cnico de tu equipo frente a las exigencias actuales y la adopci\xF3n de nuevas herramientas (como IA)?"
    },
    {
      tipo: "escala",
      area: "A",
      texto: "\xBFTe preocupa que tu equipo se perciba como un mero ejecutor en vez de proponer soluciones y aportar ideas propias?"
    },
    {
      tipo: "escala",
      area: "B",
      texto: "\xBFTe preocupa que los responsables de tu equipo no vayan al grano en las reuniones, les cueste tomar decisiones o no sepan defender sus ideas?"
    },
    {
      tipo: "escala",
      area: "B",
      texto: "\xBFTe preocupa la falta de autonom\xEDa y proactividad de tus equipos a la hora de aportar soluciones?"
    },
    {
      tipo: "escala",
      area: "C",
      texto: "\xBFTe preocupa que tu equipo no tenga claro c\xF3mo contribuye su trabajo a los objetivos de la empresa?"
    },
    {
      tipo: "escala",
      area: "C",
      texto: "\xBFTe preocupa la falta de colaboraci\xF3n entre departamentos o la resistencia a los cambios dentro de los equipos?"
    },
    {
      tipo: "tamano",
      texto: "Para aterrizar la propuesta a tu realidad organizativa, \xBFcu\xE1ntas personas forman parte del equipo o \xE1rea que tienes en mente?",
      opciones: [
        { texto: "Menos de 10 personas", valor: "pequeno" },
        { texto: "Entre 10 y 30 personas", valor: "mediano" },
        { texto: "M\xE1s de 30 personas", valor: "grande" }
      ]
    }
  ];
  var FORMATO_POR_TAMANO = {
    pequeno: "Con un equipo de menos de 10 personas, lo m\xE1s \xE1gil suele ser incorporar a los perfiles clave a nuestras formaciones abiertas o dise\xF1ar un itinerario individual.",
    mediano: "Para un equipo de entre 10 y 30 personas, el encaje natural es una edici\xF3n In Company exclusiva, con casos pr\xE1cticos sobre vuestros proyectos reales.",
    grande: "Con un \xE1rea de m\xE1s de 30 personas, lo que mejor funciona es una consultor\xEDa pedag\xF3gica y un plan formativo a medida, por fases."
  };
  var ARQUETIPOS = {
    1: {
      nombre: "Silo de ejecuci\xF3n",
      lema: "Mucho talento t\xE9cnico, cero peso en negocio ni visi\xF3n.",
      fuertes: ["A"],
      radiografia: "El equipo cuenta con un talento t\xE9cnico y un dominio del craft destacables, pero trabaja encerrado en su propia disciplina. Operan como un proveedor interno reactivo que recibe pedidos o resuelve tickets sin entender las prioridades del negocio ni tener presencia en los foros donde se toman las decisiones estrat\xE9gicas.",
      oportunidades: [
        "Desconexi\xF3n entre el esfuerzo t\xE9cnico y los objetivos de negocio: invierten energ\xEDa en detalles que no mueven las m\xE9tricas de la compa\xF1\xEDa.",
        "Rol pasivo de tomador de encargos que limita la proactividad del profesional y reduce su compromiso con el proyecto global.",
        "Infrautilizaci\xF3n del talento: la empresa paga salarios de perfil especialista o senior para resolver tareas mec\xE1nicas de bajo impacto."
      ],
      mensaje: "Pagar perfiles de primer nivel t\xE9cnico para que operen como meros tomadores de pedidos es el desperdicio de talento m\xE1s costoso de una compa\xF1\xEDa. Si tu equipo t\xE9cnico no sabe influir ni hablar el idioma del negocio, siempre ir\xE9is a remolque de las decisiones de otros.",
      leadMagnet: {
        titulo: "Playbook: De la Ejecuci\xF3n al Criterio Compartido",
        descripcion: "Marco de 4 fases para que perfiles t\xE9cnicos y creativos traduzcan el valor de su oficio en m\xE9tricas, argumentos e impacto visibles para negocio."
      },
      solucion: "Programas In Company de comunicaci\xF3n estrat\xE9gica, facilitaci\xF3n y stakeholder management, capacitando a perfiles t\xE9cnicos para intervenir activamente en las fases iniciales de los proyectos."
    },
    2: {
      nombre: "Coordinaci\xF3n sin oficio",
      lema: "Mucha reuni\xF3n y facilitaci\xF3n, pero t\xE9cnica desactualizada.",
      fuertes: ["B"],
      radiografia: "Los mandos intermedios y perfiles senior son articulados, facilitan bien y gestionan din\xE1micas de trabajo fluidas, pero el oficio de base ha quedado desfasado. Hay temor o adopci\xF3n puramente cosm\xE9tica de herramientas contempor\xE1neas (como la IA generativa) y falta criterio t\xE9cnico para juzgar la calidad de lo que se entrega.",
      oportunidades: [
        "P\xE9rdida de credibilidad t\xE9cnica ante la organizaci\xF3n al proponer soluciones desactualizadas o superficiales.",
        "Incapacidad para dirigir la automatizaci\xF3n y las nuevas tecnolog\xEDas con criterio, recurriendo a ellas solo para producir bulto y no para pensar mejor.",
        "Exceso de reuniones y ceremonias de gesti\xF3n que consumen tiempo pero no se traducen en entregables s\xF3lidos ni diferenciales."
      ],
      mensaje: "La capacidad relacional y la facilitaci\xF3n abren puertas, pero sin sustancia t\xE9cnica pierden la credibilidad ante el negocio. Un liderazgo que no domina la vanguardia de su propio oficio no puede guiar la transformaci\xF3n de un equipo.",
      leadMagnet: {
        titulo: "Framework: Liderar la Evoluci\xF3n T\xE9cnica",
        descripcion: "C\xF3mo los managers y leads creativos pueden orquestar el upskilling t\xE9cnico del equipo ante la automatizaci\xF3n sin perder el criterio ni el rigor."
      },
      solucion: "Programas intensivos de upskilling t\xE9cnico avanzado y criterio contempor\xE1neo (dise\xF1o de producto, IA con intenci\xF3n, datos aplicados) para dotar de profundidad al equipo."
    },
    3: {
      nombre: "Visi\xF3n sin tracci\xF3n",
      lema: "Mucho prop\xF3sito y estrategia, nada aterriza en el barro.",
      fuertes: ["C"],
      radiografia: "La direcci\xF3n comunica un prop\xF3sito inspirador, una narrativa de cambio clara y objetivos ambiciosos, pero las iniciativas encallan en la operativa. En el barro del d\xEDa a d\xEDa no existe la capacidad t\xE9cnica ni el liderazgo horizontal necesarios para traducir los discursos estrat\xE9gicos en entregables tangibles.",
      oportunidades: [
        "Cinismo y desgaste en la plantilla ante discursos de all-hands que nunca se traducen en mejoras tangibles para su trabajo diario.",
        "Brecha entre la ambici\xF3n declarada por el comit\xE9 de direcci\xF3n y el know-how real disponible en los equipos de ejecuci\xF3n.",
        "Ausencia de metodolog\xEDas para descomponer metas estrat\xE9gicas abstractas en criterios de decisi\xF3n diarios."
      ],
      mensaje: "Una visi\xF3n inspiradora que no aterriza en el barro diario solo genera desgaste y desconfianza en tus equipos. No te faltan ideas ni prop\xF3sito: te falta la arquitectura pedag\xF3gica y el saber hacer para convertir la estrategia en entregables reales.",
      leadMagnet: {
        titulo: "Playbook: Aterrizar la Visi\xF3n en la Pr\xE1ctica Diaria",
        descripcion: "4 ceremonias y protocolos de trabajo para conectar los OKRs abstractos de la compa\xF1\xEDa con las decisiones operativas y entregables del d\xEDa a d\xEDa."
      },
      solucion: "Consultor\xEDa pedag\xF3gica ad hoc para dise\xF1ar puentes formativos que capaciten a los equipos en las competencias t\xE9cnicas y relacionales requeridas para ejecutar la estrategia."
    },
    4: {
      nombre: "Esfuerzo disperso",
      lema: "Aut\xF3nomos y resolutivos, pero van por libre respecto al negocio.",
      fuertes: ["A", "B"],
      radiografia: "Profesionales aut\xF3nomos, de alto rendimiento t\xE9cnico y con excelente iniciativa para desbloquear proyectos internamente, pero que van por libre. Operan al margen de la estrategia de la compa\xF1\xEDa, invirtiendo tiempo en perfeccionismos t\xE9cnicos o iniciativas paralelas que no responden a las prioridades reales del negocio.",
      oportunidades: [
        "Desperdicio de recursos en proyectos de alta calidad t\xE9cnica que terminan descartados por no encajar en la agenda corporativa.",
        "Fricci\xF3n pol\xEDtica recurrente entre el equipo y la direcci\xF3n general por falta de alineamiento en prioridades y tiempos.",
        "Riesgo de fuga de perfiles clave desmotivados al sentir que la organizaci\xF3n frena o no valora sus iniciativas."
      ],
      mensaje: "Tu equipo tiene el talento y la autonom\xEDa para transformar productos, pero pedalean en una direcci\xF3n distinta a la de la empresa. Si no conectas su empuje con las prioridades reales del negocio, perder\xE1s a tus mejores profesionales por puro desgaste.",
      leadMagnet: {
        titulo: "Canvas: Alineamiento T\xE1ctico-Estrat\xE9gico",
        descripcion: "Herramienta para conectar la autonom\xEDa de equipos de alto rendimiento con los objetivos de negocio de la direcci\xF3n general."
      },
      solucion: "Sesiones de co-dise\xF1o estrat\xE9gico, facilitaci\xF3n directiva y programas de gesti\xF3n del cambio para sincronizar la velocidad del equipo con el rumbo global de la empresa."
    },
    5: {
      nombre: "Brecha t\xE9cnica",
      lema: "L\xEDderes y rumbo claros, pero la base no da el nivel requerido.",
      fuertes: ["B", "C"],
      radiografia: "Los l\xEDderes y la estrategia est\xE1n perfectamente alineados con el negocio y la cultura es sana, pero los perfiles que ejecutan no dan la talla t\xE9cnica contempor\xE1nea. La direcci\xF3n se ve obligada al micromanagement constante o a conformarse con resultados mediocres por falta de solvencia t\xE9cnica en la base.",
      oportunidades: [
        "Sobrecarga y cuello de botella en los mandos intermedios por tener que rehacer entregables y supervisar tareas b\xE1sicas.",
        "Uso torpe o inercial de herramientas modernas (como IA), perdiendo velocidad y competitividad frente al mercado.",
        "Inseguridad y lentitud en los contribuidores individuales al enfrentarse a proyectos de mayor complejidad."
      ],
      mensaje: "Tus l\xEDderes tienen el rumbo claro, pero la base t\xE9cnica del equipo no da el nivel necesario. Si no elevas el criterio de tus ejecutores, tus mejores mandos seguir\xE1n atrapados en el micromanagement apagando fuegos en lugar de liderar.",
      leadMagnet: {
        titulo: "Matriz de Diagn\xF3stico de Brecha T\xE9cnica (Upskilling Audit)",
        descripcion: "Checklist estructurado para identificar con precisi\xF3n qu\xE9 habilidades t\xE9cnicas y de criterio contempor\xE1neo necesita incorporar el equipo de ejecuci\xF3n hoy."
      },
      solucion: "Planes de capacitaci\xF3n modular e itinerarios combinados (formaciones abiertas para perfiles clave y ediciones ad hoc) enfocados en elevar el oficio t\xE9cnico y el criterio con IA de la base operativa."
    },
    6: {
      nombre: "Falta de influencia",
      lema: "Tienen el nivel y entienden la visi\xF3n, pero no tienen voz ni peso.",
      fuertes: ["A", "C"],
      radiografia: "El equipo cuenta con un nivel t\xE9cnico envidiable y comprende hacia d\xF3nde debe ir el negocio, pero carece de voz y peso pol\xEDtico en la organizaci\xF3n. En las mesas compartidas con Producto, Ventas o Direcci\xF3n sus argumentos no calan, quedando relegados a acatar decisiones ajenas que perjudican el producto.",
      oportunidades: [
        "Subordinaci\xF3n constante a decisiones de otras \xE1reas por incapacidad de articular y defender el criterio t\xE9cnico con asertividad.",
        "Sensaci\xF3n de frustraci\xF3n e invisibilidad profesional: el equipo sabe qu\xE9 hay que hacer, pero no logra convencer a los stakeholders.",
        "Falta de din\xE1micas de facilitaci\xF3n para desbloquear consensos y alinear intereses contrapuestos sin generar conflicto."
      ],
      mensaje: "Tu equipo sabe exactamente qu\xE9 hacer y hacia d\xF3nde ir, pero no tiene voz en la mesa donde se decide el rumbo. El mejor criterio t\xE9cnico es invisible si no se acompa\xF1a de habilidades de facilitaci\xF3n e influencia para liderar a otras \xE1reas.",
      leadMagnet: {
        titulo: "Kit de Influencia sin Autoridad para Perfiles T\xE9cnicos",
        descripcion: "T\xE1cticas de facilitaci\xF3n, argumentaci\xF3n ejecutiva y resoluci\xF3n de bloqueos entre departamentos para perfiles que necesitan ganar peso en la toma de decisiones."
      },
      solucion: "Programas In Company de liderazgo informal, facilitaci\xF3n de din\xE1micas complejas y persuasi\xF3n \xE9tica orientada a proyectos multidisciplinares."
    },
    7: {
      nombre: "Bloqueo sist\xE9mico",
      lema: "Todo preocupa. Saturaci\xF3n, desafecci\xF3n y falta de rumbo simult\xE1nea.",
      fuertes: [],
      radiografia: "El departamento atraviesa un colapso en los tres frentes a la vez: la base t\xE9cnica est\xE1 desactualizada, no hay liderazgo para coordinar al equipo y la cultura sufre de fatiga o desconexi\xF3n estrat\xE9gica. Es el escenario habitual tras reorganizaciones bruscas, fusiones o procesos de transformaci\xF3n digital fallidos.",
      oportunidades: [
        "Desafecci\xF3n generalizada, resistencia pasiva y riesgo de burnout ante la acumulaci\xF3n de cambios sin un prop\xF3sito claro.",
        "Fricci\xF3n constante en la operativa diaria con entregas deficientes, retrasos y reprocesos continuos.",
        "Ineficacia de soluciones aisladas: los cursos tradicionales no funcionan porque los problemas de oficio, personas y rumbo est\xE1n interconectados."
      ],
      mensaje: "Cuando fallan a la vez el oficio, el liderazgo y la cultura, comprar cursos sueltos de cat\xE1logo es tirar el dinero. Lo que tu organizaci\xF3n necesita no es formaci\xF3n puntual, sino una intervenci\xF3n pedag\xF3gica transversal que reestructure la forma de trabajar desde la ra\xEDz.",
      leadMagnet: {
        titulo: "Whitepaper: Arquitectura de la Intenci\xF3n en Tiempos de Cambio",
        descripcion: "Marco metodol\xF3gico para directivos sobre c\xF3mo intervenir en equipos colapsados reconectando oficio, liderazgo y cultura en momentos de disrupci\xF3n."
      },
      solucion: "Consultor\xEDa pedag\xF3gica integral ad hoc: auditor\xEDa cualitativa en profundidad, redise\xF1o de din\xE1micas de trabajo, capacitaci\xF3n modular por fases y acompa\xF1amiento continuado en la facilitaci\xF3n del cambio."
    },
    8: {
      nombre: "Salto de nivel",
      lema: "Todo bajo control. Equipo s\xF3lido listo para romper su techo.",
      fuertes: ["A", "B", "C"],
      radiografia: "El equipo opera de forma cohesionada, cuenta con solvencia t\xE9cnica, liderazgo maduro y alineamiento estrat\xE9gico con la compa\xF1\xEDa. No experimentan dolores operativos urgentes, pero afrontan el riesgo de la complacencia: han tocado su techo actual y corren peligro de acomodarse mientras el sector evoluciona.",
      oportunidades: [
        "Riesgo de complacencia operativa: cumplir con correcci\xF3n los objetivos del presente pero perder la capacidad de anticiparse a cambios disruptivos.",
        "Techo de innovaci\xF3n: tendencia a optimizar lo conocido mediante soluciones incrementales en lugar de plantear propuestas transformadoras.",
        "Endogamia metodol\xF3gica: desconexi\xF3n de las conversaciones y tendencias de vanguardia del sector por centrarse exclusivamente en la inercia diaria."
      ],
      mensaje: "El mayor riesgo de un equipo de alto rendimiento no es el error, sino la complacencia de acomodarse en su propio est\xE1ndar. Para liderar tu sector no basta con operar bien: necesitas exponer a tu talento a est\xEDmulos de vanguardia que desaf\xEDen su forma de pensar y abran nuevas fronteras.",
      leadMagnet: {
        titulo: "Radar: Se\xF1ales y Retos de Frontera en Dise\xF1o y Negocio",
        descripcion: "Selecci\xF3n curada de debates emergentes, implicaciones \xE9ticas y estrat\xE9gicas de la IA y pensamiento de futuros para organizaciones maduras."
      },
      solucion: "Chutes de inspiraci\xF3n, masterclasses retadoras y programas avanzados de vanguardia (Beyond the Prompt, Dise\xF1o de Futuros, Econom\xEDa Conductual) para inyectar disrupci\xF3n e impulsar al equipo a un nuevo nivel."
    }
  };

  // src/autodiagnostico/calculo.js
  var UMBRAL_MEJORAR = 2;
  function puntuaciones(respuestas2) {
    const p = { A: 0, B: 0, C: 0 };
    PREGUNTAS.forEach((pregunta, i) => {
      if (pregunta.tipo === "escala") p[pregunta.area] += respuestas2[i];
    });
    return p;
  }
  function arquetipoDe(p) {
    const fuertes = ["A", "B", "C"].filter((a) => p[a] < UMBRAL_MEJORAR).join("");
    const clave = Object.keys(ARQUETIPOS).find((k) => ARQUETIPOS[k].fuertes.join("") === fuertes);
    return Number(clave);
  }
  function retosOrdenados(p) {
    return ["A", "B", "C"].filter((a) => p[a] >= UMBRAL_MEJORAR).sort((x, y) => p[y] - p[x]);
  }
  function respuestasValidas(respuestas2) {
    return Array.isArray(respuestas2) && respuestas2.length === PREGUNTAS.length && respuestas2.every((r, i) => Number.isInteger(r) && r >= 0 && r < (PREGUNTAS[i].tipo === "escala" ? 3 : PREGUNTAS[i].opciones.length));
  }
  function resultadoDe(respuestas2) {
    const p = puntuaciones(respuestas2);
    return {
      puntuaciones: p,
      arquetipo: arquetipoDe(p),
      retos: retosOrdenados(p),
      tamano: PREGUNTAS[6].opciones[respuestas2[6]].valor
    };
  }

  // src/autodiagnostico/autodiagnostico.js
  var CLAVE_ALMACEN = "posso_autodiagnostico_incompany";
  var VERSION = 1;
  var CLASE_DISPARADOR = "btn-autodiagnostico";
  var ANCLA = "#autodiagnostico";
  var EMAIL_CONTACTO_POR_DEFECTO = "incompany@posso.es";
  var modal = null;
  var contenido = null;
  var disparador = null;
  var respuestas = [];
  var actual = 0;
  function config() {
    return window.AutodiagnosticoConfig || {};
  }
  function el(tag, attrs, hijos) {
    const nodo = document.createElement(tag);
    Object.keys(attrs || {}).forEach((k) => {
      const v = attrs[k];
      if (v === void 0 || v === null || v === false) return;
      if (k === "text") nodo.textContent = v;
      else if (k === "class") nodo.className = v;
      else if (k.startsWith("on")) nodo.addEventListener(k.slice(2), v);
      else nodo.setAttribute(k, v === true ? "" : v);
    });
    (hijos || []).forEach((h) => h && nodo.append(h));
    return nodo;
  }
  function leerGuardado() {
    try {
      const g = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN) || "null");
      if (g && g.version === VERSION && respuestasValidas(g.respuestas) && !isNaN(new Date(g.fecha))) return g;
    } catch (e) {
    }
    return null;
  }
  function guardar(resps) {
    const r = resultadoDe(resps);
    const g = { version: VERSION, fecha: (/* @__PURE__ */ new Date()).toISOString(), respuestas: resps, arquetipo: r.arquetipo, puntuaciones: r.puntuaciones };
    try {
      window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(g));
    } catch (e) {
    }
    return g;
  }
  function borrarGuardado() {
    try {
      window.localStorage.removeItem(CLAVE_ALMACEN);
    } catch (e) {
    }
  }
  function emitir(nombre, detalle) {
    document.dispatchEvent(new CustomEvent("posso:autodiagnostico:" + nombre, { detail: detalle }));
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "autodiagnostico_" + nombre.replace(/-/g, "_"), autodiagnostico_arquetipo: detalle && detalle.arquetipoNombre });
    }
  }
  function crearModal() {
    if (modal) return;
    contenido = el("div", { class: "autodiag-contenido", "aria-live": "polite" });
    modal = el("div", { id: "autodiagModal", class: "dossier-modal-container autodiag-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "autodiag-titulo" }, [
      el("div", { class: "dossier-modal-box autodiag-box" }, [
        el("button", { type: "button", class: "dossier-modal-close autodiag-cerrar", "aria-label": "Cerrar", text: "\xD7", onclick: cerrar }),
        contenido
      ])
    ]);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && estaAbierto()) cerrar();
    });
    document.body.appendChild(modal);
  }
  function estaAbierto() {
    return !!modal && modal.style.display === "block";
  }
  function abrir(origen) {
    crearModal();
    disparador = origen || document.activeElement;
    const guardado = leerGuardado();
    if (guardado) pintarResultado(guardado);
    else empezar();
    modal.style.display = "block";
    modal.scrollTop = 0;
    enfocarInicio();
  }
  function cerrar() {
    if (!modal) return;
    modal.style.display = "none";
    if (disparador && typeof disparador.focus === "function") disparador.focus();
  }
  function enfocarInicio() {
    const destino = contenido.querySelector("[data-foco]") || modal.querySelector(".autodiag-cerrar");
    if (destino) destino.focus({ preventScroll: true });
  }
  function empezar() {
    respuestas = new Array(PREGUNTAS.length).fill(null);
    actual = 0;
    pintarPregunta();
  }
  function pintarPregunta() {
    const p = PREGUNTAS[actual];
    const total = PREGUNTAS.length;
    const opciones = p.tipo === "escala" ? ESCALA.map((texto, i) => ({ texto, i })) : p.opciones.map((o, i) => ({ texto: o.texto, i }));
    const grupo = el(
      "div",
      { class: "autodiag-opciones autodiag-opciones-" + (p.tipo === "escala" ? "escala" : "lista"), role: "radiogroup", "aria-labelledby": "autodiag-pregunta" },
      opciones.map(
        (o) => el("button", {
          type: "button",
          class: "autodiag-opcion" + (respuestas[actual] === o.i ? " is-elegida" : ""),
          role: "radio",
          "aria-checked": respuestas[actual] === o.i ? "true" : "false",
          "data-foco": o.i === (respuestas[actual] ?? 0) ? true : null,
          text: o.texto,
          onclick: () => responder(o.i)
        })
      )
    );
    contenido.replaceChildren(
      el("div", { class: "autodiag-cabecera" }, [
        el("p", { class: "autodiag-eyebrow", text: "POSSO In Company" }),
        el("h2", { id: "autodiag-titulo", class: "autodiag-titulo learnworlds-subheading learnworlds-subheading-small", text: INTRO.titulo }),
        el("p", { class: "autodiag-subtitulo learnworlds-main-text", text: INTRO.subtitulo })
      ]),
      el("div", { class: "autodiag-progreso" }, [
        el("span", { class: "autodiag-progreso-texto", text: "Pregunta " + (actual + 1) + " de " + total }),
        el("div", { class: "autodiag-progreso-barra", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(actual + 1) }, [
          el("div", { class: "autodiag-progreso-relleno", style: "width:" + (actual + 1) / total * 100 + "%" })
        ])
      ]),
      el("h3", { id: "autodiag-pregunta", class: "autodiag-pregunta", text: p.texto }),
      grupo,
      el("div", { class: "autodiag-navegacion" }, [
        actual > 0 ? el("button", { type: "button", class: "autodiag-boton-texto", text: "\u2190 Anterior", onclick: anterior }) : el("span")
      ])
    );
    grupo.addEventListener("keydown", (e) => {
      const botones = Array.from(grupo.querySelectorAll(".autodiag-opcion"));
      const i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!delta) return;
      e.preventDefault();
      botones[(i + delta + botones.length) % botones.length].focus();
    });
  }
  var avanzando = false;
  function responder(i) {
    if (avanzando) return;
    respuestas[actual] = i;
    pintarPregunta();
    if (actual === 0 && respuestas.filter((r) => r !== null).length === 1) emitir("inicio", null);
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
        emitir("completado", detalleResultado(guardado));
      }
    }, 220);
  }
  function anterior() {
    if (actual === 0) return;
    actual--;
    pintarPregunta();
    enfocarInicio();
  }
  function detalleResultado(guardado) {
    const r = resultadoDe(guardado.respuestas);
    return {
      fecha: guardado.fecha,
      respuestas: guardado.respuestas,
      puntuaciones: r.puntuaciones,
      arquetipo: r.arquetipo,
      arquetipoNombre: ARQUETIPOS[r.arquetipo].nombre,
      leadMagnet: ARQUETIPOS[r.arquetipo].leadMagnet.titulo,
      tamano: r.tamano
    };
  }
  function fechaLarga(iso) {
    try {
      return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return "";
    }
  }
  function pintarResultado(guardado) {
    const r = resultadoDe(guardado.respuestas);
    const a = ARQUETIPOS[r.arquetipo];
    const n = r.retos.length;
    const intro = n === 0 ? "Seg\xFAn tus respuestas, ninguna de las tres \xE1reas te preocupa especialmente. Tu reto es otro: no acomodarse." : "Seg\xFAn tus respuestas, hay " + (n === 1 ? "un \xE1rea" : n === 2 ? "dos \xE1reas" : "tres \xE1reas") + " en " + (n === 1 ? "la" : "las") + " que pod\xE9is mejorar. Te contamos cu\xE1les son, por qu\xE9 importan y por d\xF3nde empezar.";
    const retos = n > 0 ? el(
      "ol",
      { class: "autodiag-retos" },
      r.retos.map(
        (area, i) => el("li", { class: "autodiag-reto" }, [
          el("span", { class: "autodiag-reto-numero", "aria-hidden": "true", text: String(i + 1) }),
          el("div", {}, [
            el("p", { class: "autodiag-reto-titulo" }, [
              document.createTextNode(AREAS[area].reto.titulo),
              i === 0 && n > 1 ? el("span", { class: "autodiag-etiqueta", text: "Prioritario" }) : null
            ]),
            el("p", { class: "autodiag-reto-area", text: AREAS[area].nombre }),
            el("p", { class: "autodiag-reto-texto", text: AREAS[area].reto.texto })
          ])
        ])
      )
    ) : el("ul", { class: "autodiag-lista" }, a.oportunidades.map((t) => el("li", { text: t })));
    const fuertes = ["A", "B", "C"].filter((x) => r.retos.indexOf(x) === -1);
    contenido.replaceChildren(
      el("div", { class: "autodiag-cabecera" }, [
        el("p", { class: "autodiag-eyebrow", text: "Tu diagn\xF3stico POSSO" }),
        el("h2", { id: "autodiag-titulo", class: "autodiag-titulo learnworlds-subheading learnworlds-subheading-small", "data-foco": true, tabindex: "-1", text: a.nombre }),
        el("p", { class: "autodiag-lema", text: a.lema }),
        el("p", { class: "autodiag-fecha", text: "Diagn\xF3stico del " + fechaLarga(guardado.fecha) })
      ]),
      el("p", { class: "autodiag-texto learnworlds-main-text", text: a.radiografia }),
      el("section", { class: "autodiag-seccion" }, [
        el("h3", { class: "autodiag-seccion-titulo", text: n > 0 ? "Tus principales retos" : "Tu reto" }),
        el("p", { class: "autodiag-texto", text: intro }),
        retos,
        fuertes.length > 0 && n > 0 ? el("div", { class: "autodiag-fortalezas" }, [
          el("p", { class: "autodiag-fortalezas-titulo", text: fuertes.length === 1 ? "Tu punto fuerte" : "Tus puntos fuertes" }),
          el("ul", {}, fuertes.map((x) => el("li", {}, [el("strong", { text: AREAS[x].nombre + ". " }), document.createTextNode(AREAS[x].fortaleza)])))
        ]) : null
      ]),
      el("blockquote", { class: "autodiag-mensaje", text: "\xAB" + a.mensaje + "\xBB" }),
      el("section", { class: "autodiag-recurso" }, [
        el("p", { class: "autodiag-eyebrow", text: "\xBFQuieres entender mejor estos retos?" }),
        el("h3", { class: "autodiag-recurso-titulo", text: a.leadMagnet.titulo }),
        el("p", { class: "autodiag-recurso-texto", text: a.leadMagnet.descripcion }),
        el("button", {
          type: "button",
          class: "autodiag-boton autodiag-boton-claro",
          text: "Desc\xE1rgalo aqu\xED \u2192",
          onclick: () => {
            const detalle = detalleResultado(guardado);
            emitir("lead-magnet", detalle);
            if (typeof config().onLeadMagnet === "function") config().onLeadMagnet(detalle);
          }
        })
      ]),
      el("section", { class: "autodiag-seccion autodiag-solucion" }, [
        el("h3", { class: "autodiag-seccion-titulo", text: "C\xF3mo te ayudar\xEDamos" }),
        el("p", { class: "autodiag-texto", text: a.solucion }),
        el("p", { class: "autodiag-texto", text: FORMATO_POR_TAMANO[r.tamano] }),
        el("div", { class: "autodiag-acciones" }, [
          el("a", {
            class: "autodiag-boton",
            href: "mailto:" + (config().contactoEmail || EMAIL_CONTACTO_POR_DEFECTO) + "?subject=" + encodeURIComponent("Autodiagn\xF3stico In Company: " + a.nombre),
            text: "Hablemos de tu equipo"
          }),
          el("button", {
            type: "button",
            class: "autodiag-boton-texto",
            text: "Repetir el diagn\xF3stico",
            onclick: () => {
              borrarGuardado();
              empezar();
              modal.scrollTop = 0;
              enfocarInicio();
            }
          })
        ])
      ])
    );
  }
  function init() {
    document.addEventListener("click", (e) => {
      const t = e.target && e.target.closest ? e.target.closest("." + CLASE_DISPARADOR + ', a[href$="' + ANCLA + '"]') : null;
      if (!t) return;
      e.preventDefault();
      abrir(t);
    });
    if (window.location.hash === ANCLA) abrir();
    window.addEventListener("hashchange", () => {
      if (window.location.hash === ANCLA && !estaAbierto()) abrir();
    });
  }
  window.PossoAutodiagnostico = { abrir, cerrar, borrar: borrarGuardado };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
