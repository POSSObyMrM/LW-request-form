(() => {
  // src/autodiagnostico/datos.js
  var INTRO = {
    titulo: "Autodiagn\xF3stico",
    subtitulo: "Eval\xFAa c\xF3mo est\xE1 tu equipo en los tres territorios clave."
  };
  var AREAS = {
    A: {
      etiqueta: "Criterio y ejecuci\xF3n",
      nombre: "Criterio y ejecuci\xF3n",
      reto: {
        titulo: "M\xE1s criterio, menos piloto autom\xE1tico",
        texto: "Pasar de ejecutar a cuestionar, proponer y decidir, tambi\xE9n al incorporar la IA, es uno de los retos que m\xE1s vemos hoy. Lo trabajamos a menudo con equipos t\xE9cnicos y creativos."
      },
      fortaleza: "Tus respuestas apuntan a una base t\xE9cnica s\xF3lida y criterio propio."
    },
    B: {
      etiqueta: "Influencia y liderazgo",
      nombre: "Colaboraci\xF3n, influencia y liderazgo",
      reto: {
        titulo: "Decidir y avanzar juntos.",
        texto: "Cuando a los proyectos les cuesta avanzar, suele haber margen en liderazgo, comunicaci\xF3n y capacidad para ponerse de acuerdo. Es un terreno en el que acompa\xF1amos a muchos equipos."
      },
      fortaleza: "Tus respuestas apuntan a un equipo que sabe coordinarse, decidir y defender sus ideas."
    },
    C: {
      etiqueta: "Cultura y estrategia",
      nombre: "Cultura y estrategia",
      reto: {
        titulo: "Un equipo, no varias islas.",
        texto: "Conectar el trabajo diario con los objetivos de la empresa, y a los departamentos entre s\xED, es clave para avanzar juntos. Es un reto muy habitual y sabemos c\xF3mo abordarlo."
      },
      fortaleza: "Tus respuestas apuntan a un equipo que tiene claro hacia d\xF3nde va la empresa."
    }
  };
  var TEXTOS_RESULTADO = {
    eyebrow: "Tu diagn\xF3stico POSSO",
    titulo: "Ya sabemos qu\xE9 puede estar frenando a tu equipo",
    retosTitulo: "Tus principales retos",
    recursoEyebrow: "\xBFQuieres entender mejor estos retos?",
    recursoBoton: "Descargar",
    proximosPasos: "Pr\xF3ximos pasos",
    invitacionTexto: "En 20 minutos repasamos tu diagn\xF3stico y te contamos c\xF3mo lo abordar\xEDamos con un equipo como el tuyo. Sin compromiso.",
    botonLlamada: "Reservar una llamada",
    botonEscribir: "Escribirnos",
    // Casillas del «Escríbenos»: el texto se guarda en POSSO como prueba de lo aceptado.
    privacidadTexto: "He le\xEDdo la Pol\xEDtica de Privacidad y acepto que POSSO use estos datos para responder a mi solicitud.",
    marketingTexto: "Quiero recibir comunicaciones de POSSO sobre formaci\xF3n y novedades."
  };
  var ESCALA = ["No me preocupa", "Me preocupa un poco", "Me preocupa mucho"];
  var PREGUNTAS = [
    {
      tipo: "escala",
      area: "A",
      texto: "\xBFTe preocupa el nivel t\xE9cnico de tu equipo frente a las exigencias actuales y la adopci\xF3n de nuevas herramientas (como IA)?",
      foco: "poner al d\xEDa el oficio, con la IA como aliada"
    },
    {
      tipo: "escala",
      area: "A",
      texto: "\xBFTe preocupa que tu equipo se perciba como un mero ejecutor en vez de proponer soluciones y aportar ideas propias?",
      foco: "que el equipo proponga m\xE1s ideas y soluciones propias"
    },
    {
      tipo: "escala",
      area: "B",
      texto: "\xBFTe preocupa que los responsables de tu equipo no vayan al grano en las reuniones, les cueste tomar decisiones o no sepan defender sus ideas?",
      foco: "reforzar la capacidad de decisi\xF3n de los responsables"
    },
    {
      tipo: "escala",
      area: "B",
      texto: "\xBFTe preocupa la falta de autonom\xEDa y proactividad de tus equipos a la hora de aportar soluciones?",
      foco: "ganar autonom\xEDa y proactividad"
    },
    {
      tipo: "escala",
      area: "C",
      texto: "\xBFTe preocupa que tu equipo no tenga claro c\xF3mo contribuye su trabajo a los objetivos de la empresa?",
      foco: "conectar el trabajo diario con los objetivos de la empresa"
    },
    {
      tipo: "escala",
      area: "C",
      texto: "\xBFTe preocupa la falta de colaboraci\xF3n entre departamentos o la resistencia a los cambios dentro de los equipos?",
      foco: "reforzar la colaboraci\xF3n entre departamentos ante el cambio"
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
  var ARQUETIPOS = {
    1: {
      nombre: "Silo de ejecuci\xF3n",
      lema: "Mucho talento t\xE9cnico que podr\xEDa pesar m\xE1s en el negocio.",
      fuertes: ["A"],
      radiografia: "En equipos con este perfil solemos encontrar mucho talento t\xE9cnico trabajando algo encerrado en su disciplina: resuelven bien los encargos, pero les cuesta conectar con las prioridades del negocio.",
      oportunidades: [
        "Desconexi\xF3n entre el esfuerzo t\xE9cnico y los objetivos de negocio: invierten energ\xEDa en detalles que no mueven las m\xE9tricas de la compa\xF1\xEDa.",
        "Rol pasivo de tomador de encargos que limita la proactividad del profesional y reduce su compromiso con el proyecto global.",
        "Infrautilizaci\xF3n del talento: la empresa paga salarios de perfil especialista o senior para resolver tareas mec\xE1nicas de bajo impacto."
      ],
      mensaje: "Pagar perfiles de primer nivel t\xE9cnico para que operen como meros tomadores de pedidos es el desperdicio de talento m\xE1s costoso de una compa\xF1\xEDa. Si tu equipo t\xE9cnico no sabe influir ni hablar el idioma del negocio, siempre ir\xE9is a remolque de las decisiones de otros.",
      leadMagnet: {
        activo: false,
        titulo: "Playbook: De la Ejecuci\xF3n al Criterio Compartido",
        descripcion: "Marco de 4 fases para que perfiles t\xE9cnicos y creativos traduzcan el valor de su oficio en m\xE9tricas, argumentos e impacto visibles para negocio."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos trabajar la comunicaci\xF3n estrat\xE9gica, la facilitaci\xF3n y la relaci\xF3n con negocio, para que los perfiles t\xE9cnicos participen desde el inicio de los proyectos."
    },
    2: {
      nombre: "Coordinaci\xF3n sin oficio",
      lema: "Buena coordinaci\xF3n, con un oficio que pide ponerse al d\xEDa.",
      fuertes: ["B"],
      radiografia: "Con este perfil solemos ver mandos que coordinan y facilitan bien, mientras el oficio de base se ha quedado atr\xE1s y la IA se usa m\xE1s por inercia que con criterio.",
      oportunidades: [
        "P\xE9rdida de credibilidad t\xE9cnica ante la organizaci\xF3n al proponer soluciones desactualizadas o superficiales.",
        "Incapacidad para dirigir la automatizaci\xF3n y las nuevas tecnolog\xEDas con criterio, recurriendo a ellas solo para producir bulto y no para pensar mejor.",
        "Exceso de reuniones y ceremonias de gesti\xF3n que consumen tiempo pero no se traducen en entregables s\xF3lidos ni diferenciales."
      ],
      mensaje: "La capacidad relacional y la facilitaci\xF3n abren puertas, pero sin sustancia t\xE9cnica pierden la credibilidad ante el negocio. Un liderazgo que no domina la vanguardia de su propio oficio no puede guiar la transformaci\xF3n de un equipo.",
      leadMagnet: {
        activo: false,
        titulo: "Framework: Liderar la Evoluci\xF3n T\xE9cnica",
        descripcion: "C\xF3mo los managers y leads creativos pueden orquestar el upskilling t\xE9cnico del equipo ante la automatizaci\xF3n sin perder el criterio ni el rigor."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos plantear un programa pr\xE1ctico para poner al d\xEDa el oficio (dise\xF1o de producto, IA con intenci\xF3n, datos aplicados) y dar m\xE1s profundidad al trabajo diario."
    },
    3: {
      nombre: "Visi\xF3n sin tracci\xF3n",
      lema: "Un rumbo claro que cuesta llevar al d\xEDa a d\xEDa.",
      fuertes: ["C"],
      radiografia: "Es habitual encontrar un prop\xF3sito claro y objetivos ambiciosos que luego encallan en el d\xEDa a d\xEDa, por falta de oficio y de liderazgo horizontal para aterrizarlos.",
      oportunidades: [
        "Cinismo y desgaste en la plantilla ante discursos de all-hands que nunca se traducen en mejoras tangibles para su trabajo diario.",
        "Brecha entre la ambici\xF3n declarada por el comit\xE9 de direcci\xF3n y el know-how real disponible en los equipos de ejecuci\xF3n.",
        "Ausencia de metodolog\xEDas para descomponer metas estrat\xE9gicas abstractas en criterios de decisi\xF3n diarios."
      ],
      mensaje: "Una visi\xF3n inspiradora que no aterriza en el barro diario solo genera desgaste y desconfianza en tus equipos. No te faltan ideas ni prop\xF3sito: te falta la arquitectura pedag\xF3gica y el saber hacer para convertir la estrategia en entregables reales.",
      leadMagnet: {
        activo: false,
        titulo: "Playbook: Aterrizar la Visi\xF3n en la Pr\xE1ctica Diaria",
        descripcion: "4 ceremonias y protocolos de trabajo para conectar los OKRs abstractos de la compa\xF1\xEDa con las decisiones operativas y entregables del d\xEDa a d\xEDa."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos dise\xF1ar un itinerario a medida que conecte la estrategia con las capacidades t\xE9cnicas y relacionales necesarias para llevarla a la pr\xE1ctica."
    },
    4: {
      nombre: "Esfuerzo disperso",
      lema: "Autonom\xEDa y empuje que piden m\xE1s alineamiento con el negocio.",
      fuertes: ["A", "B"],
      radiografia: "Solemos ver profesionales aut\xF3nomos y resolutivos que desbloquean proyectos con facilidad, pero que avanzan por libre, a veces lejos de lo que el negocio prioriza.",
      oportunidades: [
        "Desperdicio de recursos en proyectos de alta calidad t\xE9cnica que terminan descartados por no encajar en la agenda corporativa.",
        "Fricci\xF3n pol\xEDtica recurrente entre el equipo y la direcci\xF3n general por falta de alineamiento en prioridades y tiempos.",
        "Riesgo de fuga de perfiles clave desmotivados al sentir que la organizaci\xF3n frena o no valora sus iniciativas."
      ],
      mensaje: "Tu equipo tiene el talento y la autonom\xEDa para transformar productos, pero pedalean en una direcci\xF3n distinta a la de la empresa. Si no conectas su empuje con las prioridades reales del negocio, perder\xE1s a tus mejores profesionales por puro desgaste.",
      leadMagnet: {
        activo: false,
        titulo: "Canvas: Alineamiento T\xE1ctico-Estrat\xE9gico",
        descripcion: "Herramienta para conectar la autonom\xEDa de equipos de alto rendimiento con los objetivos de negocio de la direcci\xF3n general."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos empezar con sesiones de co-dise\xF1o junto a la direcci\xF3n, para alinear prioridades, y despu\xE9s reforzar lo necesario para avanzar en la misma direcci\xF3n."
    },
    5: {
      nombre: "Brecha t\xE9cnica",
      lema: "L\xEDderes y rumbo claros, con una base que necesita crecer en oficio.",
      fuertes: ["B", "C"],
      radiografia: "En equipos as\xED suele haber l\xEDderes con el rumbo claro y una cultura sana, pero una base que a\xFAn no llega al nivel t\xE9cnico necesario y obliga a supervisar de cerca.",
      oportunidades: [
        "Sobrecarga y cuello de botella en los mandos intermedios por tener que rehacer entregables y supervisar tareas b\xE1sicas.",
        "Uso torpe o inercial de herramientas modernas (como IA), perdiendo velocidad y competitividad frente al mercado.",
        "Inseguridad y lentitud en los contribuidores individuales al enfrentarse a proyectos de mayor complejidad."
      ],
      mensaje: "Tus l\xEDderes tienen el rumbo claro, pero la base t\xE9cnica del equipo no da el nivel necesario. Si no elevas el criterio de tus ejecutores, tus mejores mandos seguir\xE1n atrapados en el micromanagement apagando fuegos en lugar de liderar.",
      leadMagnet: {
        activo: false,
        titulo: "Matriz de Diagn\xF3stico de Brecha T\xE9cnica (Upskilling Audit)",
        descripcion: "Checklist estructurado para identificar con precisi\xF3n qu\xE9 habilidades t\xE9cnicas y de criterio contempor\xE1neo necesita incorporar el equipo de ejecuci\xF3n hoy."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos combinar formaci\xF3n modular a medida y plazas en nuestras formaciones abiertas para elevar el oficio y el criterio con IA de quienes ejecutan."
    },
    6: {
      nombre: "Falta de influencia",
      lema: "Nivel y visi\xF3n que todav\xEDa no se traducen en voz e influencia.",
      fuertes: ["A", "C"],
      radiografia: "Con este perfil es frecuente encontrar buen nivel t\xE9cnico y visi\xF3n compartida, pero poca voz: en las mesas con Producto, Ventas o Direcci\xF3n sus argumentos no siempre calan.",
      oportunidades: [
        "Subordinaci\xF3n constante a decisiones de otras \xE1reas por incapacidad de articular y defender el criterio t\xE9cnico con asertividad.",
        "Sensaci\xF3n de frustraci\xF3n e invisibilidad profesional: el equipo sabe qu\xE9 hay que hacer, pero no logra convencer a los stakeholders.",
        "Falta de din\xE1micas de facilitaci\xF3n para desbloquear consensos y alinear intereses contrapuestos sin generar conflicto."
      ],
      mensaje: "Tu equipo sabe exactamente qu\xE9 hacer y hacia d\xF3nde ir, pero no tiene voz en la mesa donde se decide el rumbo. El mejor criterio t\xE9cnico es invisible si no se acompa\xF1a de habilidades de facilitaci\xF3n e influencia para liderar a otras \xE1reas.",
      leadMagnet: {
        activo: false,
        titulo: "Kit de Influencia sin Autoridad para Perfiles T\xE9cnicos",
        descripcion: "T\xE1cticas de facilitaci\xF3n, argumentaci\xF3n ejecutiva y resoluci\xF3n de bloqueos entre departamentos para perfiles que necesitan ganar peso en la toma de decisiones."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos trabajar el liderazgo sin autoridad formal, la facilitaci\xF3n y la argumentaci\xF3n, para que su criterio pese m\xE1s en las decisiones compartidas."
    },
    7: {
      nombre: "Bloqueo sist\xE9mico",
      lema: "Varios frentes abiertos a la vez, que conviene abordar juntos.",
      fuertes: [],
      radiografia: "Cuando todo preocupa a la vez, solemos ver equipos tensionados en varios frentes. Es habitual tras reorganizaciones, fusiones o transformaciones que no han terminado de cuajar.",
      oportunidades: [
        "Desafecci\xF3n generalizada, resistencia pasiva y riesgo de burnout ante la acumulaci\xF3n de cambios sin un prop\xF3sito claro.",
        "Fricci\xF3n constante en la operativa diaria con entregas deficientes, retrasos y reprocesos continuos.",
        "Ineficacia de soluciones aisladas: los cursos tradicionales no funcionan porque los problemas de oficio, personas y rumbo est\xE1n interconectados."
      ],
      mensaje: "Cuando fallan a la vez el oficio, el liderazgo y la cultura, comprar cursos sueltos de cat\xE1logo es tirar el dinero. Lo que tu organizaci\xF3n necesita no es formaci\xF3n puntual, sino una intervenci\xF3n pedag\xF3gica transversal que reestructure la forma de trabajar desde la ra\xEDz.",
      leadMagnet: {
        activo: false,
        titulo: "Whitepaper: Arquitectura de la Intenci\xF3n en Tiempos de Cambio",
        descripcion: "Marco metodol\xF3gico para directivos sobre c\xF3mo intervenir en equipos colapsados reconectando oficio, liderazgo y cultura en momentos de disrupci\xF3n."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED no solemos empezar por un curso: primero conversamos con los distintos niveles para entender bien la situaci\xF3n y, a partir de ah\xED, proponemos una intervenci\xF3n por fases."
    },
    8: {
      nombre: "Salto de nivel",
      lema: "Un equipo s\xF3lido, listo para dar el siguiente paso.",
      fuertes: ["A", "B", "C"],
      radiografia: "Solemos encontrar equipos cohesionados, solventes y bien alineados. El reto suele ser no acomodarse: cuando todo funciona, es f\xE1cil dejar de mirar hacia d\xF3nde va el sector.",
      oportunidades: [
        "Mantener la capacidad de anticiparse cuando el d\xEDa a d\xEDa ya funciona bien.",
        "Pasar de las mejoras incrementales a propuestas que transformen.",
        "Seguir conectados con las conversaciones y tendencias de frontera del sector."
      ],
      mensaje: "El mayor riesgo de un equipo de alto rendimiento no es el error, sino la complacencia de acomodarse en su propio est\xE1ndar. Para liderar tu sector no basta con operar bien: necesitas exponer a tu talento a est\xEDmulos de vanguardia que desaf\xEDen su forma de pensar y abran nuevas fronteras.",
      leadMagnet: {
        activo: false,
        titulo: "Radar: Se\xF1ales y Retos de Frontera en Dise\xF1o y Negocio",
        descripcion: "Selecci\xF3n curada de debates emergentes, implicaciones \xE9ticas y estrat\xE9gicas de la IA y pensamiento de futuros para organizaciones maduras."
      },
      // Primera frase de «Próximos pasos» (ver propuestaDe en calculo.js).
      solucion: "Con equipos as\xED solemos proponer est\xEDmulos de frontera, como masterclasses y programas avanzados (Beyond the Prompt, Dise\xF1o de Futuros, Econom\xEDa Conductual), que abran nuevas preguntas."
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
  var VERTICES = { C: { x: 200, y: 45 }, A: { x: 60, y: 285 }, B: { x: 340, y: 285 } };
  var CENTRO = { x: 200, y: 205 };
  function geometriaTriangulo(p) {
    const fuerza = { A: 4 - p.A, B: 4 - p.B, C: 4 - p.C };
    const fortalezas = ["C", "A", "B"].map((a) => ({
      x: CENTRO.x + (VERTICES[a].x - CENTRO.x) * fuerza[a] / 4,
      y: CENTRO.y + (VERTICES[a].y - CENTRO.y) * fuerza[a] / 4
    }));
    return { fortalezas, fuerza };
  }
  var MAX_FOCOS = 3;
  function unirConY(partes) {
    if (partes.length <= 1) return partes.join("");
    return partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1];
  }
  function focosDe(respuestas2) {
    const p = puntuaciones(respuestas2);
    const ordenAreas = retosOrdenados(p).concat(["A", "B", "C"].filter((a) => p[a] < UMBRAL_MEJORAR));
    const preguntasEscala = PREGUNTAS.map((q, i) => ({ q, i })).filter((x) => x.q.tipo === "escala");
    for (const nivel of [2, 1]) {
      const elegidas = ordenAreas.flatMap((a) => preguntasEscala.filter((x) => x.q.area === a && respuestas2[x.i] === nivel));
      if (elegidas.length > 0) return { nivel, focos: elegidas.slice(0, MAX_FOCOS).map((x) => x.q.foco) };
    }
    return { nivel: 0, focos: [] };
  }
  var CIERRE_PROPUESTA = "Lo concretar\xEDamos contigo, a partir de lo que de verdad necesita tu equipo.";
  function propuestaDe(respuestas2) {
    const r = resultadoDe(respuestas2);
    const a = ARQUETIPOS[r.arquetipo];
    const { nivel, focos } = focosDe(respuestas2);
    let texto = a.solucion;
    if (focos.length > 0) {
      texto += (nivel === 2 ? " Por lo que m\xE1s te preocupa, pondr\xEDamos el foco en " : " Por lo que nos cuentas, pondr\xEDamos el foco en ") + unirConY(focos.map((f, i) => i === 0 ? f : "en " + f)) + ".";
    }
    return texto + " " + CIERRE_PROPUESTA;
  }

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

  // src/autodiagnostico/autodiagnostico.js
  var CLAVE_ALMACEN = "posso_autodiagnostico_incompany";
  var VERSION = 1;
  var CLASE_DISPARADOR = "btn-autodiagnostico";
  var ANCLA = "#autodiagnostico";
  var POSSO_URL_POR_DEFECTO = "https://admin.posso.es/api/public/leads/autodiagnostico";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var SVG = "http://www.w3.org/2000/svg";
  var modal = null;
  var contenido = null;
  var disparador = null;
  var respuestas = [];
  var actual = 0;
  var emailRecordado = "";
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
  function svg(tag, attrs, hijos) {
    const nodo = document.createElementNS(SVG, tag);
    Object.keys(attrs || {}).forEach((k) => {
      if (k === "text") nodo.textContent = attrs[k];
      else nodo.setAttribute(k, attrs[k]);
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
  function guardar(resps, previo) {
    const r = resultadoDe(resps);
    const g = { version: VERSION, fecha: (/* @__PURE__ */ new Date()).toISOString(), respuestas: resps, arquetipo: r.arquetipo, puntuaciones: r.puntuaciones };
    if (previo && previo.contacto) g.contacto = previo.contacto;
    escribirGuardado(g);
    return g;
  }
  function escribirGuardado(g) {
    try {
      window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(g));
    } catch (e) {
    }
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
  function pintar(...bloques) {
    contenido.replaceChildren(...bloques.filter(Boolean));
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
    arriba();
  }
  function cerrar() {
    if (!modal) return;
    modal.style.display = "none";
    if (disparador && typeof disparador.focus === "function") disparador.focus();
  }
  function arriba() {
    modal.scrollTop = 0;
    const destino = contenido.querySelector("[data-foco]") || modal.querySelector(".autodiag-cerrar");
    if (destino) destino.focus({ preventScroll: true });
  }
  function empezar() {
    respuestas = new Array(PREGUNTAS.length).fill(null);
    actual = 0;
    pintarPregunta();
  }
  function grupoOpciones(indice, elegida, alElegir) {
    const p = PREGUNTAS[indice];
    const opciones = p.tipo === "escala" ? ESCALA : p.opciones.map((o) => o.texto);
    const grupo = el(
      "div",
      {
        class: "autodiag-opciones autodiag-opciones-" + (p.tipo === "escala" ? "escala" : "lista"),
        role: "radiogroup",
        "aria-labelledby": "autodiag-pregunta-" + indice
      },
      opciones.map(
        (texto, i) => el("button", {
          type: "button",
          class: "autodiag-opcion" + (elegida === i ? " is-elegida" : ""),
          role: "radio",
          "aria-checked": elegida === i ? "true" : "false",
          "data-indice": String(i),
          text: texto,
          onclick: () => alElegir(i)
        })
      )
    );
    grupo.addEventListener("keydown", (e) => {
      const botones = Array.from(grupo.querySelectorAll(".autodiag-opcion"));
      const i = botones.indexOf(document.activeElement);
      const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (i < 0 || !delta) return;
      e.preventDefault();
      botones[(i + delta + botones.length) % botones.length].focus();
    });
    return grupo;
  }
  function pintarPregunta() {
    const p = PREGUNTAS[actual];
    const total = PREGUNTAS.length;
    const grupo = grupoOpciones(actual, respuestas[actual], responder);
    const foco = grupo.querySelectorAll(".autodiag-opcion")[respuestas[actual] ?? 0];
    if (foco) foco.setAttribute("data-foco", "");
    pintar(
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
      el("h3", { id: "autodiag-pregunta-" + actual, class: "autodiag-pregunta", text: p.texto }),
      grupo,
      el("div", { class: "autodiag-navegacion" }, [
        actual > 0 ? el("button", { type: "button", class: "autodiag-boton-texto", text: "\u2190 Anterior", onclick: anterior }) : el("span")
      ])
    );
  }
  var avanzando = false;
  function responder(i) {
    if (avanzando) return;
    const primera = respuestas.every((r) => r === null);
    respuestas[actual] = i;
    pintarPregunta();
    if (primera) emitir("inicio", null);
    avanzando = true;
    setTimeout(() => {
      avanzando = false;
      if (actual < PREGUNTAS.length - 1) {
        actual++;
        pintarPregunta();
        arriba();
      } else {
        const guardado = guardar(respuestas.slice());
        pintarResultado(guardado);
        arriba();
        emitir("completado", detalleResultado(guardado));
      }
    }, 220);
  }
  function anterior() {
    if (actual === 0) return;
    actual--;
    pintarPregunta();
    arriba();
  }
  function pintarRespuestas(guardado) {
    const borrador = guardado.respuestas.slice();
    const botonGuardar = el("button", { type: "button", class: "autodiag-boton", text: "Guardar cambios", disabled: true, onclick: () => {
      const nuevo = guardar(borrador.slice(), guardado);
      pintarResultado(nuevo);
      arriba();
      emitir("actualizado", detalleResultado(nuevo));
    } });
    const cambiado = () => borrador.some((r, i) => r !== guardado.respuestas[i]);
    const lista = el("ol", { class: "autodiag-respuestas" }, PREGUNTAS.map((p, i) => {
      const opciones = p.tipo === "escala" ? ESCALA : p.opciones.map((o) => o.texto);
      const select = el(
        "select",
        { id: "autodiag-respuesta-" + i, class: "autodiag-select" },
        opciones.map((texto, k) => el("option", { value: String(k), text: texto, selected: borrador[i] === k }))
      );
      select.addEventListener("change", () => {
        borrador[i] = Number(select.value);
        select.classList.toggle("is-cambiado", borrador[i] !== guardado.respuestas[i]);
        botonGuardar.disabled = !cambiado();
      });
      return el("li", { class: "autodiag-respuesta" }, [
        el("label", { for: "autodiag-respuesta-" + i, class: "autodiag-respuesta-pregunta", text: i + 1 + ". " + p.texto }),
        select
      ]);
    }));
    pintar(
      el("div", { class: "autodiag-cabecera" }, [
        el("p", { class: "autodiag-eyebrow", text: TEXTOS_RESULTADO.eyebrow }),
        el("h2", { id: "autodiag-titulo", class: "autodiag-titulo learnworlds-subheading learnworlds-subheading-small", "data-foco": true, tabindex: "-1", text: "Tus respuestas" }),
        el("p", { class: "autodiag-subtitulo learnworlds-main-text", text: "Cambia las que quieras y guarda: el diagn\xF3stico se recalcula con tus nuevas respuestas." })
      ]),
      lista,
      el("div", { class: "autodiag-acciones autodiag-acciones-respuestas" }, [
        botonGuardar,
        el("button", { type: "button", class: "autodiag-boton-texto", text: "Volver sin cambiar nada", onclick: () => {
          pintarResultado(guardado);
          arriba();
        } })
      ])
    );
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
  var NUMEROS = ["ning\xFAn", "un", "dos", "tres"];
  var idsSvg = 0;
  function distancia(p, q) {
    return Math.hypot(p.x - q.x, p.y - q.y);
  }
  function triangulo(r) {
    const g = geometriaTriangulo(r.puntuaciones);
    const pts = (lista) => lista.map((p) => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");
    const esReto = (a) => r.retos.indexOf(a) !== -1;
    const orden = ["C", "A", "B"];
    const etiquetas = [
      { a: "C", x: 200, y: 22, ancla: "middle" },
      { a: "A", x: 22, y: 318, ancla: "start" },
      { a: "B", x: 378, y: 318, ancla: "end" }
    ];
    const descripcion = "Tri\xE1ngulo de las tres \xE1reas. " + ["A", "B", "C"].map((a) => AREAS[a].etiqueta + ": " + (esReto(a) ? "reto" : "fortaleza")).join(". ") + ".";
    const id = "autodiag-svg-" + ++idsSvg;
    const contorno = pts([VERTICES.C, VERTICES.A, VERTICES.B]);
    const degradados = orden.map((a, k) => ({ a, radio: distancia(VERTICES[a], g.fortalezas[k]) })).filter((d) => esReto(d.a) && d.radio > 0);
    const icono = (a) => {
      const { x, y } = VERTICES[a];
      return esReto(a) ? svg("g", { class: "autodiag-tri-icono autodiag-tri-icono-reto", transform: "translate(" + x + "," + y + ")" }, [
        svg("line", { x1: 0, y1: -5.5, x2: 0, y2: 1.5 }),
        svg("circle", { class: "autodiag-tri-icono-punto", cx: 0, cy: 5.5, r: 1.6 })
      ]) : svg("path", { class: "autodiag-tri-icono", transform: "translate(" + x + "," + y + ")", d: "M -5 0.5 L -1.5 4 L 5.5 -3.5" });
    };
    return svg("svg", { class: "autodiag-triangulo", viewBox: "0 0 400 340", role: "img", "aria-label": descripcion }, [
      svg("defs", {}, [
        svg("clipPath", { id: id + "-recorte" }, [svg("polygon", { points: contorno })]),
        ...degradados.map(
          (d) => svg("radialGradient", { id: id + "-" + d.a, gradientUnits: "userSpaceOnUse", cx: VERTICES[d.a].x, cy: VERTICES[d.a].y, r: d.radio.toFixed(1) }, [
            svg("stop", { offset: "0", class: "autodiag-tri-degradado-inicio" }),
            svg("stop", { offset: "1", class: "autodiag-tri-degradado-fin" })
          ])
        )
      ]),
      svg("polygon", { class: "autodiag-tri-base", points: contorno }),
      svg("g", { "clip-path": "url(#" + id + "-recorte)" }, degradados.map(
        (d) => svg("circle", { cx: VERTICES[d.a].x, cy: VERTICES[d.a].y, r: d.radio.toFixed(1), fill: "url(#" + id + "-" + d.a + ")" })
      )),
      svg("line", { class: "autodiag-tri-guia", x1: VERTICES.C.x, y1: VERTICES.C.y, x2: 200, y2: 285 }),
      svg("line", { class: "autodiag-tri-guia", x1: VERTICES.A.x, y1: VERTICES.A.y, x2: 270, y2: 165 }),
      svg("line", { class: "autodiag-tri-guia", x1: VERTICES.B.x, y1: VERTICES.B.y, x2: 130, y2: 165 }),
      svg("polygon", { class: "autodiag-tri-base autodiag-tri-borde", points: contorno }),
      svg("polygon", { class: "autodiag-tri-fortalezas", points: pts(g.fortalezas) }),
      svg("circle", { class: "autodiag-tri-centro", cx: CENTRO.x, cy: CENTRO.y, r: 3 }),
      ...["A", "B", "C"].map((a) => svg("circle", { class: "autodiag-tri-vertice autodiag-tri-vertice-" + (esReto(a) ? "reto" : "fuerte"), cx: VERTICES[a].x, cy: VERTICES[a].y, r: 12 })),
      ...["A", "B", "C"].map(icono),
      ...etiquetas.map((e) => svg("text", { class: "autodiag-tri-etiqueta", x: e.x, y: e.y, "text-anchor": e.ancla, text: AREAS[e.a].etiqueta }))
    ]);
  }
  function mensajeFormulario() {
    return el("p", { class: "autodiag-form-mensaje", role: "status" });
  }
  function campoEmail(id, etiqueta) {
    return el("div", { class: "autodiag-campo" }, [
      el("label", { for: id, class: "autodiag-etiqueta-campo", text: etiqueta }),
      el("input", { id, type: "email", class: "autodiag-input", autocomplete: "email", placeholder: "tu.nombre@empresa.com", value: emailRecordado, required: true })
    ]);
  }
  function enviarFormulario(form, evento, datos, manejador, textoOk, sinManejador, alExito) {
    const mensaje = form.querySelector(".autodiag-form-mensaje");
    const boton = form.querySelector('button[type="submit"]');
    emitir(evento, datos);
    if (typeof manejador !== "function") {
      if (sinManejador) sinManejador(mensaje);
      return;
    }
    boton.disabled = true;
    mensaje.textContent = "Enviando\u2026";
    Promise.resolve().then(() => manejador(datos)).then(() => {
      if (alExito) alExito();
      else {
        mensaje.textContent = textoOk;
        form.classList.add("is-enviado");
      }
    }).catch(() => {
      mensaje.textContent = "No se ha podido enviar. Int\xE9ntalo de nuevo en unos minutos.";
    }).finally(() => {
      boton.disabled = false;
    });
  }
  function enviarAPosso(datos) {
    const utm = getUTMParams();
    const r = resultadoDe(datos.respuestas);
    const cuerpo = {
      nombre: datos.nombre,
      email: datos.email,
      empresa: datos.empresa,
      cargo: datos.cargo,
      mensaje: datos.mensaje,
      privacidad: true,
      privacidadTexto: TEXTOS_RESULTADO.privacidadTexto,
      marketing: datos.marketing,
      marketingTexto: datos.marketing ? TEXTOS_RESULTADO.marketingTexto : null,
      website: datos.website,
      url: window.location.href,
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
      utm_content: utm.utm_content || null,
      utm_term: utm.utm_term || null,
      diagnostico: {
        // Cada respuesta con su pregunta y su texto: así POSSO no depende de los textos de este script.
        respuestas: datos.respuestas.map((v, i) => ({
          pregunta: PREGUNTAS[i].texto,
          respuesta: PREGUNTAS[i].tipo === "escala" ? ESCALA[v] : PREGUNTAS[i].opciones[v].texto,
          valor: v
        })),
        puntuaciones: r.puntuaciones,
        arquetipo: r.arquetipo,
        arquetipoNombre: ARQUETIPOS[r.arquetipo].nombre,
        tamano: r.tamano,
        fecha: datos.fecha
      }
    };
    return fetch(config().possoUrl || POSSO_URL_POR_DEFECTO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    }).then((res) => res.json().catch(() => ({})).then((j) => ({ ok: res.ok, j }))).then(({ ok, j }) => {
      if (!ok || !j.ok) throw new Error(j && j.error || "Error al enviar");
    });
  }
  function confirmacionContacto(c) {
    const nombre = (c.nombre || "").split(" ")[0];
    return el("div", { class: "autodiag-confirmacion", role: "status", tabindex: "-1" }, [
      el("span", { class: "autodiag-confirmacion-icono", "aria-hidden": "true", text: "\u2713" }),
      el("div", {}, [
        el("p", { class: "autodiag-confirmacion-titulo", text: nombre ? "\xA1Gracias, " + nombre + "!" : "\xA1Gracias!" }),
        el("p", { class: "autodiag-confirmacion-texto", text: "Hemos recibido tu mensaje y tu diagn\xF3stico. Te escribiremos muy pronto" + (c.email ? " a " + c.email : "") + "." }),
        c.fecha ? el("p", { class: "autodiag-confirmacion-fecha", text: "Enviado el " + fechaLarga(c.fecha) }) : null
      ])
    ]);
  }
  function textoConPrivacidad(texto) {
    const i = texto.indexOf("Pol\xEDtica de Privacidad");
    if (i === -1) return [document.createTextNode(texto)];
    return [
      document.createTextNode(texto.slice(0, i)),
      el("a", { href: "/privacy", target: "_blank", rel: "noopener", text: "Pol\xEDtica de Privacidad" }),
      document.createTextNode(texto.slice(i + "Pol\xEDtica de Privacidad".length))
    ];
  }
  function validarEmail(form, input) {
    const email = input.value.trim();
    const ok = EMAIL_RE.test(email);
    input.classList.toggle("is-invalido", !ok);
    if (!ok) {
      form.querySelector(".autodiag-form-mensaje").textContent = "Escribe un email v\xE1lido.";
      input.focus();
      return null;
    }
    emailRecordado = email;
    return email;
  }
  function pintarResultado(guardado) {
    const r = resultadoDe(guardado.respuestas);
    const a = ARQUETIPOS[r.arquetipo];
    const n = r.retos.length;
    const detalle = detalleResultado(guardado);
    const fuertes = ["A", "B", "C"].filter((x) => r.retos.indexOf(x) === -1);
    const formRecurso = el("form", { class: "autodiag-form autodiag-form-recurso", novalidate: true }, [
      campoEmail("autodiag-email-recurso", "Tu email"),
      el("button", { type: "submit", class: "autodiag-boton autodiag-boton-claro", text: TEXTOS_RESULTADO.recursoBoton }),
      mensajeFormulario()
    ]);
    formRecurso.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = validarEmail(formRecurso, formRecurso.querySelector("input"));
      if (!email) return;
      enviarFormulario(formRecurso, "lead-magnet", { ...detalle, email }, config().onLeadMagnet, "Listo. Te lo hemos enviado a " + email + ".", (m) => {
        m.textContent = "El env\xEDo del recurso todav\xEDa no est\xE1 conectado.";
      });
    });
    const campoTexto = (id, etiqueta, attrs) => el("div", { class: "autodiag-campo" }, [
      el("label", { for: id, class: "autodiag-etiqueta-campo", text: etiqueta }),
      el("input", { id, type: "text", class: "autodiag-input", maxlength: "160", ...attrs })
    ]);
    const casilla = (id, texto, obligatoria) => el("div", { class: "lead-form__optin-checkbox autodiag-casilla" }, [
      el("label", { for: id, class: "checkbox-label with-flexible-parts lw-checkbox learnworlds-align-left" }, [
        el("input", { id, type: "checkbox", class: "checkbox flexible-part js-optin-checkbox", required: obligatoria || null }),
        el("div", { class: "checkbox-box lw-border-color-fadeout80 flexible-part" }, [el("span", { class: "learnworlds-icon learnworlds-heading3-small fas fa-check" })]),
        el("div", { class: "flexible-part" }, [
          ...textoConPrivacidad(texto),
          obligatoria ? document.createTextNode(" *") : el("span", { class: "autodiag-opcional", text: " (opcional)" })
        ])
      ])
    ]);
    const formContacto = el("form", { class: "autodiag-form autodiag-form-contacto", novalidate: true, hidden: true }, [
      campoTexto("autodiag-nombre", "Tu nombre", { autocomplete: "name", maxlength: "120", required: true }),
      campoEmail("autodiag-email-contacto", "Tu email"),
      campoTexto("autodiag-empresa", "Empresa", { autocomplete: "organization", required: true }),
      campoTexto("autodiag-cargo", "Cargo (opcional)", { autocomplete: "organization-title", maxlength: "120" }),
      el("div", { class: "autodiag-campo autodiag-campo-ancho" }, [
        el("label", { for: "autodiag-mensaje", class: "autodiag-etiqueta-campo", text: "Mensaje (opcional)" }),
        el("textarea", { id: "autodiag-mensaje", class: "autodiag-input", rows: "3", maxlength: "2000", placeholder: "Cu\xE9ntanos lo que quieras sobre tu equipo" })
      ]),
      // Campo trampa para bots: invisible, no lo rellena una persona.
      el("input", { type: "text", name: "website", class: "autodiag-trampa", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" }),
      casilla("autodiag-privacidad", TEXTOS_RESULTADO.privacidadTexto, true),
      casilla("autodiag-marketing", TEXTOS_RESULTADO.marketingTexto, false),
      el("button", { type: "submit", class: "autodiag-boton", text: "Enviar" }),
      mensajeFormulario()
    ]);
    formContacto.addEventListener("submit", (e) => {
      e.preventDefault();
      const aviso = formContacto.querySelector(".autodiag-form-mensaje");
      const obligatorio = (id, texto) => {
        const input = formContacto.querySelector("#" + id);
        const vacio = !input.value.trim();
        input.classList.toggle("is-invalido", vacio);
        if (vacio) {
          aviso.textContent = texto;
          input.focus();
        }
        return vacio ? null : input.value.trim();
      };
      const nombre = obligatorio("autodiag-nombre", "Escribe tu nombre.");
      if (!nombre) return;
      const email = validarEmail(formContacto, formContacto.querySelector('input[type="email"]'));
      if (!email) return;
      const empresa = obligatorio("autodiag-empresa", "Escribe el nombre de tu empresa.");
      if (!empresa) return;
      const privacidad = formContacto.querySelector("#autodiag-privacidad");
      if (!privacidad.checked) {
        aviso.textContent = "Para poder responderte, acepta la Pol\xEDtica de Privacidad.";
        privacidad.focus();
        return;
      }
      const datos = {
        ...detalle,
        nombre,
        email,
        empresa,
        cargo: formContacto.querySelector("#autodiag-cargo").value.trim(),
        mensaje: formContacto.querySelector("textarea").value.trim(),
        marketing: formContacto.querySelector("#autodiag-marketing").checked,
        website: formContacto.querySelector(".autodiag-trampa").value
      };
      enviarFormulario(formContacto, "contacto", datos, config().onContacto || enviarAPosso, "", null, () => {
        guardado.contacto = { fecha: (/* @__PURE__ */ new Date()).toISOString(), nombre, email };
        escribirGuardado(guardado);
        const confirmacion = confirmacionContacto(guardado.contacto);
        formContacto.replaceWith(confirmacion);
        botonEscribir.remove();
        if (!calendly) textoInvitacion.remove();
        confirmacion.focus();
      });
    });
    const calendly = config().calendlyUrl;
    const textoInvitacion = el("p", { class: "autodiag-texto", text: TEXTOS_RESULTADO.invitacionTexto });
    const botonEscribir = el("button", {
      type: "button",
      // Si es la única acción (sin Calendly), es la principal: fondo oscuro.
      class: "autodiag-boton autodiag-boton-grande" + (calendly ? " autodiag-boton-secundario" : ""),
      "aria-expanded": "false",
      "aria-controls": "autodiag-form-contacto",
      text: TEXTOS_RESULTADO.botonEscribir,
      onclick: (e) => {
        formContacto.hidden = !formContacto.hidden;
        e.currentTarget.setAttribute("aria-expanded", String(!formContacto.hidden));
        if (!formContacto.hidden) {
          const input = formContacto.querySelector('input[type="email"]');
          if (!input.value) input.value = emailRecordado;
          formContacto.querySelector("#autodiag-nombre").focus();
        }
      }
    });
    pintar(
      el("div", { class: "autodiag-cabecera" }, [
        el("p", { class: "autodiag-eyebrow", text: TEXTOS_RESULTADO.eyebrow }),
        el("h2", { id: "autodiag-titulo", class: "autodiag-titulo learnworlds-subheading learnworlds-subheading-small", "data-foco": true, tabindex: "-1", text: TEXTOS_RESULTADO.titulo }),
        el("p", { class: "autodiag-fecha", text: "Diagn\xF3stico del " + fechaLarga(guardado.fecha) })
      ]),
      // Arquetipo + triángulo
      el("section", { class: "autodiag-arquetipo" }, [
        el("figure", { class: "autodiag-figura" }, [triangulo(r)]),
        el("div", { class: "autodiag-arquetipo-texto" }, [
          el("p", { class: "autodiag-arquetipo-eyebrow", text: "Escenario actual de tu equipo" }),
          el("h3", { class: "autodiag-arquetipo-nombre", text: a.nombre }),
          el("p", { class: "autodiag-lema", text: a.lema }),
          el("p", { class: "autodiag-texto", text: a.radiografia })
        ])
      ]),
      // Retos
      el("section", { class: "autodiag-seccion" }, [
        el("h3", { class: "autodiag-seccion-titulo", text: TEXTOS_RESULTADO.retosTitulo }),
        el("p", {
          class: "autodiag-texto",
          text: n > 0 ? "Seg\xFAn tus respuestas hay " + NUMEROS[n] + (n === 1 ? " \xE1rea en la" : " \xE1reas en las") + " que pod\xE9is mejorar:" : "Seg\xFAn tus respuestas no hay ning\xFAn \xE1rea que necesite mejorar con urgencia. Vuestro reto es otro:"
        }),
        n > 0 ? el(
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
        ) : el("ul", { class: "autodiag-lista" }, a.oportunidades.map((t) => el("li", { text: t }))),
        fuertes.length > 0 && n > 0 ? el("div", { class: "autodiag-fortalezas" }, [
          el("p", { class: "autodiag-fortalezas-titulo", text: fuertes.length === 1 ? "Tu punto fuerte" : "Tus puntos fuertes" }),
          el("ul", {}, fuertes.map((x) => el("li", {}, [el("strong", { text: AREAS[x].nombre + ". " }), document.createTextNode(AREAS[x].fortaleza)])))
        ]) : null
      ]),
      // Recurso recomendado (solo si está activo, ver leadMagnet.activo en datos.js)
      !a.leadMagnet.activo ? null : el("section", { class: "autodiag-recurso" }, [
        el("div", { class: "autodiag-portada", "aria-hidden": "true" }, a.leadMagnet.portada ? [el("img", { src: a.leadMagnet.portada, alt: "" })] : [
          el("span", { class: "autodiag-portada-marca", text: "POSSO" }),
          el("span", { class: "autodiag-portada-titulo", text: a.leadMagnet.titulo }),
          el("span", { class: "autodiag-portada-pie", text: "by Mr.Marcel" })
        ]),
        el("div", { class: "autodiag-recurso-cuerpo" }, [
          el("p", { class: "autodiag-eyebrow", text: TEXTOS_RESULTADO.recursoEyebrow }),
          el("h3", { class: "autodiag-recurso-titulo", text: a.leadMagnet.titulo }),
          el("p", { class: "autodiag-recurso-texto", text: a.leadMagnet.descripcion }),
          formRecurso
        ])
      ]),
      // Próximos pasos
      el("section", { class: "autodiag-seccion autodiag-seccion-proximos" }, [
        el("h3", { class: "autodiag-seccion-titulo", text: TEXTOS_RESULTADO.proximosPasos }),
        el("p", { class: "autodiag-texto", text: propuestaDe(guardado.respuestas) }),
        // La invitación sobra una vez escrito (salvo que quede la llamada de Calendly, a la que acompaña).
        guardado.contacto && !calendly ? null : textoInvitacion,
        el("div", { class: "autodiag-acciones autodiag-acciones-principales" }, [
          calendly ? el("a", { class: "autodiag-boton autodiag-boton-grande", href: calendly, target: "_blank", rel: "noopener", text: TEXTOS_RESULTADO.botonLlamada, onclick: () => emitir("llamada", detalle) }) : null,
          guardado.contacto ? null : botonEscribir
        ]),
        guardado.contacto ? confirmacionContacto(guardado.contacto) : formContacto
      ]),
      // Discreto, al final
      el("div", { class: "autodiag-pie" }, [
        el("button", { type: "button", class: "autodiag-enlace", text: "Ver respuestas", onclick: () => {
          pintarRespuestas(guardado);
          arriba();
        } }),
        el("span", { "aria-hidden": "true", text: "\xB7" }),
        el("button", { type: "button", class: "autodiag-enlace", text: "Repetir el diagn\xF3stico", onclick: () => {
          if (!window.confirm("\xBFEmpezar de nuevo? Se borrar\xE1n tus respuestas.")) return;
          borrarGuardado();
          empezar();
          arriba();
        } })
      ])
    );
    formContacto.id = "autodiag-form-contacto";
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
