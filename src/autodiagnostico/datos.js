// Contenidos del autodiagnóstico InCompany, tal cual el documento «Test Incompany» (Google Docs). Para cambiar un
// texto, se cambia aquí y se vuelve a compilar; la lógica (calculo.js) y la interfaz (autodiagnostico.js) no
// dependen de los textos.

export const INTRO = {
  titulo: 'Autodiagnóstico',
  subtitulo: 'Evalúa cómo está tu equipo en los tres territorios clave.',
};

// Áreas («territorios»). Cada una se mide con dos preguntas de escala.
//   reto: lo que se muestra si el área necesita mejorar.
//   fortaleza: lo que se muestra si el área está bien.
// Tono (también lemas y radiografías): desde lo que apuntan sus respuestas y lo que solemos ver, nunca afirmando
// cómo es su equipo — el diagnóstico sale de seis preguntas —, y como quien conoce el reto y sabe acompañarlo.
export const AREAS = {
  A: {
    etiqueta: 'Criterio y ejecución',
    nombre: 'Criterio y ejecución',
    reto: {
      titulo: 'Más criterio, menos piloto automático',
      texto:
        'Pasar de ejecutar a cuestionar, proponer y decidir, también al incorporar la IA, es uno de los retos que más vemos hoy. Lo trabajamos a menudo con equipos técnicos y creativos.',
    },
    fortaleza: 'Tus respuestas apuntan a una base técnica sólida y criterio propio.',
  },
  B: {
    etiqueta: 'Influencia y liderazgo',
    nombre: 'Colaboración, influencia y liderazgo',
    reto: {
      titulo: 'Decidir y avanzar juntos.',
      texto:
        'Cuando a los proyectos les cuesta avanzar, suele haber margen en liderazgo, comunicación y capacidad para ponerse de acuerdo. Es un terreno en el que acompañamos a muchos equipos.',
    },
    fortaleza: 'Tus respuestas apuntan a un equipo que sabe coordinarse, decidir y defender sus ideas.',
  },
  C: {
    etiqueta: 'Cultura y estrategia',
    nombre: 'Cultura y estrategia',
    reto: {
      titulo: 'Un equipo, no varias islas.',
      texto:
        'Conectar el trabajo diario con los objetivos de la empresa, y a los departamentos entre sí, es clave para avanzar juntos. Es un reto muy habitual y sabemos cómo abordarlo.',
    },
    fortaleza: 'Tus respuestas apuntan a un equipo que tiene claro hacia dónde va la empresa.',
  },
};

// Textos fijos de la pantalla final.
export const TEXTOS_RESULTADO = {
  eyebrow: 'Tu diagnóstico POSSO',
  titulo: 'Ya sabemos qué puede estar frenando a tu equipo',
  retosTitulo: 'Tus principales retos',
  recursoEyebrow: '¿Quieres entender mejor estos retos?',
  recursoBoton: 'Descargar',
  proximosPasos: 'Próximos pasos',
  invitacionTexto:
    'En 20 minutos repasamos tu diagnóstico y te contamos cómo lo abordaríamos con un equipo como el tuyo. Sin compromiso.',
  botonLlamada: 'Reservar una llamada',
  botonEscribir: 'Escribirnos',
  // Casillas del «Escríbenos»: el texto se guarda en POSSO como prueba de lo aceptado.
  privacidadTexto: 'He leído la Política de Privacidad y acepto que POSSO use estos datos para responder a mi solicitud.',
  marketingTexto: 'Quiero recibir comunicaciones de POSSO sobre formación y novedades.',
};

export const ESCALA = ['No me preocupa', 'Me preocupa un poco', 'Me preocupa mucho'];

// Siempre en este orden. Las seis primeras puntúan su área (0, 1 o 2 según la escala); la séptima es el tamaño.
// foco: cómo se nombra esa preocupación en la propuesta de «Próximos pasos» (ver propuestaDe en calculo.js).
export const PREGUNTAS = [
  {
    tipo: 'escala',
    area: 'A',
    texto: '¿Te preocupa el nivel técnico de tu equipo frente a las exigencias actuales y la adopción de nuevas herramientas (como IA)?',
    foco: 'actualizar el nivel técnico del equipo e incorporar la IA con criterio',
  },
  {
    tipo: 'escala',
    area: 'A',
    texto: '¿Te preocupa que tu equipo se perciba como un mero ejecutor en vez de proponer soluciones y aportar ideas propias?',
    foco: 'que el equipo pase de ejecutar encargos a proponer soluciones e ideas propias',
  },
  {
    tipo: 'escala',
    area: 'B',
    texto: '¿Te preocupa que los responsables de tu equipo no vayan al grano en las reuniones, les cueste tomar decisiones o no sepan defender sus ideas?',
    foco: 'que los responsables vayan al grano, decidan y sepan defender sus ideas',
  },
  {
    tipo: 'escala',
    area: 'B',
    texto: '¿Te preocupa la falta de autonomía y proactividad de tus equipos a la hora de aportar soluciones?',
    foco: 'ganar autonomía y proactividad a la hora de aportar soluciones',
  },
  {
    tipo: 'escala',
    area: 'C',
    texto: '¿Te preocupa que tu equipo no tenga claro cómo contribuye su trabajo a los objetivos de la empresa?',
    foco: 'conectar el trabajo diario del equipo con los objetivos de la empresa',
  },
  {
    tipo: 'escala',
    area: 'C',
    texto: '¿Te preocupa la falta de colaboración entre departamentos o la resistencia a los cambios dentro de los equipos?',
    foco: 'romper los silos entre departamentos y acompañar el cambio',
  },
  {
    tipo: 'tamano',
    texto: 'Para aterrizar la propuesta a tu realidad organizativa, ¿cuántas personas forman parte del equipo o área que tienes en mente?',
    opciones: [
      { texto: 'Menos de 10 personas', valor: 'pequeno' },
      { texto: 'Entre 10 y 30 personas', valor: 'mediano' },
      { texto: 'Más de 30 personas', valor: 'grande' },
    ],
  },
];

// Ocho arquetipos: uno por cada combinación de áreas «fuerte» / «a mejorar» (ver calculo.js).
//   radiografia: desde la experiencia y en condicional (lo que solemos encontrar en equipos con este perfil): el
//   diagnóstico sale de seis preguntas, no permite afirmar nada de forma absoluta.
//   fuertes: áreas que están bien (el resto necesitan mejorar).
//   leadMagnet.activo: si se muestra en el resultado (false mientras el recurso no exista).
//   leadMagnet.portada: URL de la imagen de portada (A4); sin ella se pinta una portada provisional.
export const ARQUETIPOS = {
  1: {
    nombre: 'Silo de ejecución',
    lema: 'Mucho talento técnico que podría pesar más en el negocio.',
    fuertes: ['A'],
    radiografia:
      'En equipos con este perfil solemos encontrar mucho talento técnico trabajando algo encerrado en su disciplina: resuelven bien los encargos, pero les cuesta conectar con las prioridades del negocio.',
    oportunidades: [
      'Desconexión entre el esfuerzo técnico y los objetivos de negocio: invierten energía en detalles que no mueven las métricas de la compañía.',
      'Rol pasivo de tomador de encargos que limita la proactividad del profesional y reduce su compromiso con el proyecto global.',
      'Infrautilización del talento: la empresa paga salarios de perfil especialista o senior para resolver tareas mecánicas de bajo impacto.',
    ],
    mensaje:
      'Pagar perfiles de primer nivel técnico para que operen como meros tomadores de pedidos es el desperdicio de talento más costoso de una compañía. Si tu equipo técnico no sabe influir ni hablar el idioma del negocio, siempre iréis a remolque de las decisiones de otros.',
    leadMagnet: {
      activo: false,
      titulo: 'Playbook: De la Ejecución al Criterio Compartido',
      descripcion:
        'Marco de 4 fases para que perfiles técnicos y creativos traduzcan el valor de su oficio en métricas, argumentos e impacto visibles para negocio.',
    },
    solucion:
      'Programas In Company de comunicación estratégica, facilitación y stakeholder management, capacitando a perfiles técnicos para intervenir activamente en las fases iniciales de los proyectos.',
  },
  2: {
    nombre: 'Coordinación sin oficio',
    lema: 'Buena coordinación, con un oficio que pide ponerse al día.',
    fuertes: ['B'],
    radiografia:
      'Con este perfil solemos ver mandos que coordinan y facilitan bien, mientras el oficio de base se ha quedado atrás y la IA se usa más por inercia que con criterio.',
    oportunidades: [
      'Pérdida de credibilidad técnica ante la organización al proponer soluciones desactualizadas o superficiales.',
      'Incapacidad para dirigir la automatización y las nuevas tecnologías con criterio, recurriendo a ellas solo para producir bulto y no para pensar mejor.',
      'Exceso de reuniones y ceremonias de gestión que consumen tiempo pero no se traducen en entregables sólidos ni diferenciales.',
    ],
    mensaje:
      'La capacidad relacional y la facilitación abren puertas, pero sin sustancia técnica pierden la credibilidad ante el negocio. Un liderazgo que no domina la vanguardia de su propio oficio no puede guiar la transformación de un equipo.',
    leadMagnet: {
      activo: false,
      titulo: 'Framework: Liderar la Evolución Técnica',
      descripcion:
        'Cómo los managers y leads creativos pueden orquestar el upskilling técnico del equipo ante la automatización sin perder el criterio ni el rigor.',
    },
    solucion:
      'Programas intensivos de upskilling técnico avanzado y criterio contemporáneo (diseño de producto, IA con intención, datos aplicados) para dotar de profundidad al equipo.',
  },
  3: {
    nombre: 'Visión sin tracción',
    lema: 'Un rumbo claro que cuesta llevar al día a día.',
    fuertes: ['C'],
    radiografia:
      'Es habitual encontrar un propósito claro y objetivos ambiciosos que luego encallan en el día a día, por falta de oficio y de liderazgo horizontal para aterrizarlos.',
    oportunidades: [
      'Cinismo y desgaste en la plantilla ante discursos de all-hands que nunca se traducen en mejoras tangibles para su trabajo diario.',
      'Brecha entre la ambición declarada por el comité de dirección y el know-how real disponible en los equipos de ejecución.',
      'Ausencia de metodologías para descomponer metas estratégicas abstractas en criterios de decisión diarios.',
    ],
    mensaje:
      'Una visión inspiradora que no aterriza en el barro diario solo genera desgaste y desconfianza en tus equipos. No te faltan ideas ni propósito: te falta la arquitectura pedagógica y el saber hacer para convertir la estrategia en entregables reales.',
    leadMagnet: {
      activo: false,
      titulo: 'Playbook: Aterrizar la Visión en la Práctica Diaria',
      descripcion:
        '4 ceremonias y protocolos de trabajo para conectar los OKRs abstractos de la compañía con las decisiones operativas y entregables del día a día.',
    },
    solucion:
      'Consultoría pedagógica ad hoc para diseñar puentes formativos que capaciten a los equipos en las competencias técnicas y relacionales requeridas para ejecutar la estrategia.',
  },
  4: {
    nombre: 'Esfuerzo disperso',
    lema: 'Autonomía y empuje que piden más alineamiento con el negocio.',
    fuertes: ['A', 'B'],
    radiografia:
      'Solemos ver profesionales autónomos y resolutivos que desbloquean proyectos con facilidad, pero que avanzan por libre, a veces lejos de lo que el negocio prioriza.',
    oportunidades: [
      'Desperdicio de recursos en proyectos de alta calidad técnica que terminan descartados por no encajar en la agenda corporativa.',
      'Fricción política recurrente entre el equipo y la dirección general por falta de alineamiento en prioridades y tiempos.',
      'Riesgo de fuga de perfiles clave desmotivados al sentir que la organización frena o no valora sus iniciativas.',
    ],
    mensaje:
      'Tu equipo tiene el talento y la autonomía para transformar productos, pero pedalean en una dirección distinta a la de la empresa. Si no conectas su empuje con las prioridades reales del negocio, perderás a tus mejores profesionales por puro desgaste.',
    leadMagnet: {
      activo: false,
      titulo: 'Canvas: Alineamiento Táctico-Estratégico',
      descripcion:
        'Herramienta para conectar la autonomía de equipos de alto rendimiento con los objetivos de negocio de la dirección general.',
    },
    solucion:
      'Sesiones de co-diseño estratégico, facilitación directiva y programas de gestión del cambio para sincronizar la velocidad del equipo con el rumbo global de la empresa.',
  },
  5: {
    nombre: 'Brecha técnica',
    lema: 'Líderes y rumbo claros, con una base que necesita crecer en oficio.',
    fuertes: ['B', 'C'],
    radiografia:
      'En equipos así suele haber líderes con el rumbo claro y una cultura sana, pero una base que aún no llega al nivel técnico necesario y obliga a supervisar de cerca.',
    oportunidades: [
      'Sobrecarga y cuello de botella en los mandos intermedios por tener que rehacer entregables y supervisar tareas básicas.',
      'Uso torpe o inercial de herramientas modernas (como IA), perdiendo velocidad y competitividad frente al mercado.',
      'Inseguridad y lentitud en los contribuidores individuales al enfrentarse a proyectos de mayor complejidad.',
    ],
    mensaje:
      'Tus líderes tienen el rumbo claro, pero la base técnica del equipo no da el nivel necesario. Si no elevas el criterio de tus ejecutores, tus mejores mandos seguirán atrapados en el micromanagement apagando fuegos en lugar de liderar.',
    leadMagnet: {
      activo: false,
      titulo: 'Matriz de Diagnóstico de Brecha Técnica (Upskilling Audit)',
      descripcion:
        'Checklist estructurado para identificar con precisión qué habilidades técnicas y de criterio contemporáneo necesita incorporar el equipo de ejecución hoy.',
    },
    solucion:
      'Planes de capacitación modular e itinerarios combinados (formaciones abiertas para perfiles clave y ediciones ad hoc) enfocados en elevar el oficio técnico y el criterio con IA de la base operativa.',
  },
  6: {
    nombre: 'Falta de influencia',
    lema: 'Nivel y visión que todavía no se traducen en voz e influencia.',
    fuertes: ['A', 'C'],
    radiografia:
      'Con este perfil es frecuente encontrar buen nivel técnico y visión compartida, pero poca voz: en las mesas con Producto, Ventas o Dirección sus argumentos no siempre calan.',
    oportunidades: [
      'Subordinación constante a decisiones de otras áreas por incapacidad de articular y defender el criterio técnico con asertividad.',
      'Sensación de frustración e invisibilidad profesional: el equipo sabe qué hay que hacer, pero no logra convencer a los stakeholders.',
      'Falta de dinámicas de facilitación para desbloquear consensos y alinear intereses contrapuestos sin generar conflicto.',
    ],
    mensaje:
      'Tu equipo sabe exactamente qué hacer y hacia dónde ir, pero no tiene voz en la mesa donde se decide el rumbo. El mejor criterio técnico es invisible si no se acompaña de habilidades de facilitación e influencia para liderar a otras áreas.',
    leadMagnet: {
      activo: false,
      titulo: 'Kit de Influencia sin Autoridad para Perfiles Técnicos',
      descripcion:
        'Tácticas de facilitación, argumentación ejecutiva y resolución de bloqueos entre departamentos para perfiles que necesitan ganar peso en la toma de decisiones.',
    },
    solucion:
      'Programas In Company de liderazgo informal, facilitación de dinámicas complejas y persuasión ética orientada a proyectos multidisciplinares.',
  },
  7: {
    nombre: 'Bloqueo sistémico',
    lema: 'Varios frentes abiertos a la vez, que conviene abordar juntos.',
    fuertes: [],
    radiografia:
      'Cuando todo preocupa a la vez, solemos ver equipos tensionados en varios frentes. Es habitual tras reorganizaciones, fusiones o transformaciones que no han terminado de cuajar.',
    oportunidades: [
      'Desafección generalizada, resistencia pasiva y riesgo de burnout ante la acumulación de cambios sin un propósito claro.',
      'Fricción constante en la operativa diaria con entregas deficientes, retrasos y reprocesos continuos.',
      'Ineficacia de soluciones aisladas: los cursos tradicionales no funcionan porque los problemas de oficio, personas y rumbo están interconectados.',
    ],
    mensaje:
      'Cuando fallan a la vez el oficio, el liderazgo y la cultura, comprar cursos sueltos de catálogo es tirar el dinero. Lo que tu organización necesita no es formación puntual, sino una intervención pedagógica transversal que reestructure la forma de trabajar desde la raíz.',
    leadMagnet: {
      activo: false,
      titulo: 'Whitepaper: Arquitectura de la Intención en Tiempos de Cambio',
      descripcion:
        'Marco metodológico para directivos sobre cómo intervenir en equipos colapsados reconectando oficio, liderazgo y cultura en momentos de disrupción.',
    },
    solucion:
      'Consultoría pedagógica integral ad hoc: auditoría cualitativa en profundidad, rediseño de dinámicas de trabajo, capacitación modular por fases y acompañamiento continuado en la facilitación del cambio.',
  },
  8: {
    nombre: 'Salto de nivel',
    lema: 'Un equipo sólido, listo para dar el siguiente paso.',
    fuertes: ['A', 'B', 'C'],
    radiografia:
      'Solemos encontrar equipos cohesionados, solventes y bien alineados. El reto suele ser no acomodarse: cuando todo funciona, es fácil dejar de mirar hacia dónde va el sector.',
    oportunidades: [
      'Mantener la capacidad de anticiparse cuando el día a día ya funciona bien.',
      'Pasar de las mejoras incrementales a propuestas que transformen.',
      'Seguir conectados con las conversaciones y tendencias de frontera del sector.',
    ],
    mensaje:
      'El mayor riesgo de un equipo de alto rendimiento no es el error, sino la complacencia de acomodarse en su propio estándar. Para liderar tu sector no basta con operar bien: necesitas exponer a tu talento a estímulos de vanguardia que desafíen su forma de pensar y abran nuevas fronteras.',
    leadMagnet: {
      activo: false,
      titulo: 'Radar: Señales y Retos de Frontera en Diseño y Negocio',
      descripcion:
        'Selección curada de debates emergentes, implicaciones éticas y estratégicas de la IA y pensamiento de futuros para organizaciones maduras.',
    },
    solucion:
      'Chutes de inspiración, masterclasses retadoras y programas avanzados de vanguardia (Beyond the Prompt, Diseño de Futuros, Economía Conductual) para inyectar disrupción e impulsar al equipo a un nuevo nivel.',
  },
};
