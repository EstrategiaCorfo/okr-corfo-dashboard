/* Etiquetas de presentación y estado del ciclo de demostración. */
window.OKRConfig = Object.freeze({
  minProgressSample: 3,
  cycle: {
    period: '2026/Q3',
    stage: 'Apertura',
    week: 1,
    demo: true,
    steps: [
      {name: 'Apertura', timing: 'Semana 1'},
      {name: 'Revisión intermedia', timing: 'Semanas 6 a 7'},
      {name: 'Cierre de Q', timing: 'Semana 13'},
      {name: 'Presentación a Vicepresidencia', timing: 'Semanas 1 a 2 del Q siguiente'},
    ],
  },
  status: {
    'On Track': {label: 'Alto (On Track)', icon: '●', hint: 'Confianza alta en el cumplimiento'},
    'Off Track': {label: 'Medio (Off Track)', icon: '▲', hint: 'Confianza media; requiere atención'},
    'At Risk': {label: 'Bajo (At Risk)', icon: '■', hint: 'Confianza baja; requiere medidas correctivas'},
  },
  execution: {
    'No iniciado': 'No iniciado', 'En proceso': 'En curso', 'Completado': 'Cumplido',
  },
  instance: {'Apertura': 'Apertura', 'Revisión intermedia': 'Revisión intermedia', 'Cierre': 'Cierre de Q'},
  moment: {'Propuesta Owner': 'Propuesta del owner', 'Confirmado GE': 'Confirmado por GE'},
  glossary: {
    objetivo: 'Resultado institucional que busca alcanzar la estrategia. Se organiza en subobjetivos y Resultados Clave.',
    kr: 'Resultado Clave: evidencia concreta y verificable del avance de un subobjetivo.',
    owner: 'Gerente o encargado responsable del objetivo o del Resultado Clave.',
    estatus: 'Nivel de confianza: lectura experta del owner sobre la posibilidad de cumplir el Resultado Clave; alto, medio o bajo.',
    progreso: 'Porcentaje informado para cada KR. Si hay base de cálculo: (Valor actual − Línea base) ÷ (Meta − Línea base) × 100.',
    hito: 'Situación del entregable o actividad: No iniciado, En curso o Cumplido.',
    ciclo: 'El seguimiento trimestral contempla Apertura, Revisión intermedia, Cierre de Q y Presentación a Vicepresidencia.',
  },
});
