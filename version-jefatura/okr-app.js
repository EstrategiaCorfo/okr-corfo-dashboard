/* Capa de datos y configuración compartida del Panel de Seguimiento (okr-config + okr-model). */
(function () {
  'use strict';
  const PAGES = {
    panel: 'Panel general.dc.html',
    estrategia: 'Estrategia.dc.html',
    krs: 'Resultados Clave.dc.html',
    detalle: 'Detalle KR.dc.html',
    bitacora: 'Bitacora de avances.dc.html',
    guia: 'Como leer este panel.dc.html'
  };
  const url = k => encodeURI(PAGES[k]);
  const NAV = [
    {key: 'estrategia', label: 'Estrategia'},
    {key: 'panel', label: 'Panel general'},
    {key: 'krs', label: 'Resultados clave (KR)'},
    {key: 'bitacora', label: 'Bitácora de avances'},
    {key: 'guia', label: 'Cómo leer este panel'}
  ];
  const OBJECTIVES = [
    {n: 1, old: 2, dim: 'Impulso Corfo', name: 'Financiamiento que Impulsa la Inversión y el Crecimiento',
      statement: 'Posicionar a Corfo como articulador del financiamiento para el crecimiento productivo, movilizando capital a través de una red de intermediarios financieros.',
      subs: ['Fortalecer la industria de capital de riesgo mediante un Fondo de Inversión internacional o institucional participando directamente, o través de otro fondo, del financiamiento aportado por Corfo.', 'Aumentar la colocación de los programas de cobertura Corfo, optimizando su capacidad de operación.', 'Incrementar el número de intermediarios de los programas Crédito Mipyme y Crédito Verde posicionando a Corfo en el mercado de financiamiento.'],
      just: 'Responde al mandato ministerial de movilizar mayor inversión y busca fortalecer el rol de Corfo como plataforma de financiamiento productivo a través de intermediarios financieros, aumentando las colocaciones de los programas de cobertura, consolidando los programas de fondeo y profundizando el desarrollo del capital de riesgo, de modo que el financiamiento de Corfo opere como palanca para movilizar capital privado a mayor escala.'},
    {n: 2, old: 3, dim: 'Impulso Corfo', name: 'Capacidades Tecnológicas al Servicio de las Empresas',
      statement: 'Fortalecer las capacidades tecnológicas de las empresas mediante una Red de Centros Tecnológicos de Corfo, consolidada como infraestructura de política pública, con cobertura nacional y un modelo de financiamiento sostenible en el largo plazo.',
      subs: ['Posicionar la Red de Centros Tecnológicos para generar demanda empresarial.', 'Integrar la Red a la oferta de desarrollo productivo y al ecosistema.', 'Consolidar modelo de sostenibilidad financiera.'],
      just: 'La Red de Centros Tecnológicos constituye una infraestructura pública subutilizada en relación con su potencial; el objetivo busca consolidarla como plataforma nacional de transferencia tecnológica, con cobertura territorial efectiva, integración sistemática con los instrumentos de fomento y un modelo de financiamiento que asegure su sostenibilidad en el largo plazo, aportando más sofisticación productiva y más capacidades en las empresas para competir en mercados de mayor valor.'},
    {n: 3, old: 4, dim: 'Impulso Corfo', name: 'Desarrollo desde los Territorios',
      statement: 'Impulsar desde los territorios una nueva etapa de desarrollo productivo, consolidando a los CDPR como plataformas regionales que conectan capacidades públicas, privadas, académicas y sectoriales para generar crecimiento, inversión y empleo.',
      subs: ['Homologación y madurez institucional y operacional de los CDPR.', 'Desarrollar un sistema integrado de inteligencia territorial que entregue información, indicadores y herramientas para apoyar la planificación, priorización y seguimiento del desarrollo productivo en las regiones.', 'Creación de un modelo de relacionamiento territorial para impulsar el encadenamiento productivo.'],
      just: 'El fortalecimiento de los Comités de Desarrollo Productivo Regional como plataforma descentralizada de articulación es la apuesta de Corfo por llevar el fomento productivo al territorio con pertinencia, gobernanza y poder de decisión local, consolidando el modelo de descentralización productiva para que opere de manera regular dentro la gestión institucional, más allá de los ciclos de gobierno (inconsistencia dinámica).'},
    {n: 4, old: 5, dim: 'Rol de Corfo', name: 'Conexión Empresarial: Soluciones que Escalan',
      statement: 'Habilitar el crecimiento empresarial en Chile, conectando a emprendimientos y empresas con el mercado para la validación temprana, la tracción comercial y la inversión privada que necesitan para escalar y consolidarse.',
      subs: ['Lograr la validación temprana de soluciones innovadoras mediante un modelo de conexión con el mercado.', 'Aumentar la tracción comercial y ventas de soluciones innovadoras mediante un modelo de conexión con el mercado.', 'Aumentar la sobrevivencia de las empresas mediante un modelo de fortalecimiento de gestión empresarial y conexión con actores del ecosistema de financiamiento.'],
      just: 'Este objetivo responde a una brecha estructural del ecosistema productivo chileno: la dificultad de los emprendimientos y pymes innovadoras para validar su oferta en el mercado, escalar comercialmente y atraer inversión privada. A través de mecanismos de matchmaking, compra privada de innovación y articulación con empresas ancla, Corfo busca conectar soluciones con demanda real, reduciendo la dependencia del apoyo público como única fuente de sostenibilidad, aportando más crecimiento para las empresas apoyadas y más empleo formal asociado a ese crecimiento.'},
    {n: 5, old: 6, dim: 'Rol de Corfo', name: 'Un Estado más Coordinado para el Desarrollo Productivo',
      statement: 'Potenciar el impacto de las políticas públicas donde Corfo actúa, mediante una coordinación sistemática con ministerios y servicios que alinee agendas, eficiente la oferta pública y mejore la asignación de recursos del Estado.',
      subs: ['Alinear y visibilizar las prioridades de Corfo con las prioridades ministeriales, mediante un mapeo conjunto, presentaciones y agendas compartidas.', 'Coordinar la oferta de instrumentos con otras instituciones, formalizando convenios y resolviendo duplicidades y nudos críticos que dificultan su ejecución.', 'Institucionalizar la gobernanza del esquema de coordinación, estableciendo una mecánica operativa de seguimiento y métricas que asegure su sostenibilidad más allá del ciclo político.'],
      just: 'Una Corfo que actúa en solitario desperdicia potencial de impacto; este objetivo sistematiza la coordinación con ministerios y servicios afines para alinear agendas, evitar duplicidades y mejorar la asignación conjunta de recursos públicos, con la meta de que esa coordinación se traduzca en mayor eficiencia del gasto público y en una oferta programática más coherente para las empresas y territorios.'},
    {n: 6, old: 7, dim: 'Habilitantes', name: 'Personas y Talento',
      statement: 'Fomentar y potenciar el talento interno, generando oportunidades de aprendizaje y desarrollo para asumir nuevos desafíos, y fortaleciendo una cultura de confianza, compromiso e innovación que proyecte a Corfo como un servicio público de alto rendimiento.',
      subs: ['Crear un programa de desarrollo de talento interno en Corfo.', 'Formalización de la política de Desarrollo de Talentos.', 'Evaluación y mejoras de la política implementada.'],
      just: 'Este objetivo es un Habilitante que sostiene la implementación del resto de la estrategia. El capital humano de Corfo es su principal activo; el objetivo crea un programa formal de identificación y desarrollo del talento institucional, con metodología de mapeo de desempeño y potencial, oportunidades de exposición técnica y mecanismos de reconocimiento, con la meta de proyectar a Corfo como un servicio público de alto rendimiento, capaz de atraer, retener y desarrollar a las personas que hacen posible su misión.'},
    {n: 7, old: 8, dim: 'Habilitantes', name: 'Tecnología, Datos y Procesos',
      statement: 'Optimizar la gestión institucional mediante el uso inteligente de datos, la automatización de procesos críticos y una gobernanza de datos que mejore la experiencia de colaboradores y empresas, consolidando una institución ágil y eficiente.',
      subs: ['Facilitar la toma de decisiones y la visibilización de resultados mediante el desarrollo de una capacidad institucional de datos.', 'Mejorar la confiabilidad, consistencia y seguridad de la información mediante la implementación de una gobernanza de datos con estándares internacionales.', 'Aumentar la agregación de valor de los colaboradores mediante la digitalización y automatización de procesos.', 'Mejora de la experiencia del usuario externo a través de una relación basada en procesos más simples, ágiles y digitales.'],
      just: 'Este objetivo es un Habilitante que sostiene la implementación del resto de la estrategia. La eficiencia interna de Corfo es condición de su credibilidad externa; el objetivo busca unificar la base de datos corporativa, implementar una gobernanza de datos alineada con la Ley N° 21.180, y automatizar procesos críticos tanto de cara a los equipos internos como a los beneficiarios, con la meta de una reducción del 20% en tiempos de gestión interna y un aumento equivalente en satisfacción usuaria.'},
    {n: 8, old: 1, dim: 'Impacto', name: 'Impacto', aggregator: true,
      statement: 'Ser un motor que impulsa el progreso productivo del país, transformando la evidencia en decisiones y relatos que visibilicen el impacto de nuestros instrumentos en el crecimiento, el desarrollo de empresas y territorios, y el bienestar de las personas.',
      subs: ['Redefinir la manera en la que medimos nuestro instrumental, agregando el impacto como variable crítica.', 'Diseñar un plan de desarrollo de cultura interna sobre los indicadores de impacto de Corfo.', 'Diseñar un plan de comunicaciones (internos y externos) que nos permita difundir e informar al entorno nuestro impacto.', 'Desarrollar las capacidades institucionales para la medición y evaluación de impacto mediante el uso integrado de datos internos y externos.'],
      just: 'Este es el objetivo agregador que consolida los ejes +Productividad, +Inversión y +Crecimiento de la estrategia corporativa. Sin evidencia de resultados, la credibilidad del gasto público en fomento es frágil; el objetivo establece un marco común de indicadores de impacto adoptado por todas las gerencias, con mediciones post intervención, seguimiento sistemático y reporte anual, siendo la base para tomar mejores decisiones sobre qué instrumentos funcionan, para quién y en qué condiciones.'}
  ];
  OBJECTIVES.forEach(o => { o.n = o.old; });
  OBJECTIVES.sort((x, y) => x.n - y.n);
  OBJECTIVES.forEach(o => { o.code = String(o.n).padStart(2, '0'); o.subCodes = o.subs.map((_, i) => `SO${o.n}.${i + 1}`); });
  const OLD_TO_NEW = Object.fromEntries(OBJECTIVES.map(o => [o.old, o.n]));

  const STATUS = {
    'On Track': {key: 'ok', label: 'En cumplimiento', en: 'On Track', glyph: '●', color: '#13815F', fill: '#13815F', bg: '#E6F6EE'},
    'Off Track': {key: 'warn', label: 'Alerta de cumplimiento', en: 'Off Track', glyph: '▲', color: '#7A5C00', fill: '#F5C400', bg: '#FFF4C2'},
    'At Risk': {key: 'risk', label: 'Riesgo de cumplimiento', en: 'At Risk', glyph: '■', color: '#B92F3F', fill: '#B92F3F', bg: '#FCE8EB'}
  };
  const NO_STATUS = {key: 'none', label: 'Sin reporte', en: '', glyph: '■', color: '#6B7088', fill: '#C9CAD5', bg: '#EDF0F5'};
  const EXEC = {'No iniciado': {label: 'No iniciado', color: '#C9CAD5'}, 'En proceso': {label: 'En curso', color: '#9197AE'}, 'Completado': {label: 'Cumplido', color: '#221E7C'}};
  const INSTANCE = {'Apertura': 'Apertura', 'Revisión intermedia': 'Revisión intermedia', 'Cierre': 'Cierre de Q'};
  const INSTANCE_ORDER = ['Apertura', 'Revisión intermedia', 'Cierre'];
  const MOMENT = {'Propuesta Owner': 'Propuesta del owner', 'Confirmado GE': 'Confirmado por GE'};
  const MIN_PROGRESS_SAMPLE = 5;
  const GLOSSARY = {
    estatus: {title: 'Estatus (semáforo)', text: 'Lectura experta del owner sobre el cumplimiento del KR: en cumplimiento (On Track), alerta de cumplimiento (Off Track) o riesgo de cumplimiento (At Risk). Es independiente del progreso numérico.', anchor: 'semaforo'},
    progreso: {title: 'Progreso numérico', text: '(Valor actual − Línea base) ÷ (Meta − Línea base) × 100. Solo aplica a KR cuantificables. Un KR con 80% se considera éxito; los KR asociados a CDC exigen 100%.', anchor: 'progreso'},
    hito: {title: 'Estado del hito', text: 'Situación del hito según el último reporte: no iniciado, en curso o cumplido. Métrica secundaria en tonos neutros; no es una evaluación de cumplimiento.', anchor: 'glosario'},
    owner: {title: 'Owner', text: 'Gerente o encargado responsable del objetivo o del KR.', anchor: 'glosario'},
    lineabase: {title: 'Línea base, Valor actual y Meta', text: 'Valores que definen el progreso numérico de un KR cuantificable: punto de partida, medición más reciente y valor comprometido.', anchor: 'progreso'},
    ciclo: {title: 'Ciclo trimestral', text: 'Cada trimestre tiene Apertura (semana 1), Revisión intermedia (semanas 6 a 7), Cierre de Q (semana 13) y Presentación a Vicepresidencia (semanas 1 a 2 del Q siguiente).', anchor: 'ciclo'}
  };
  Object.values(GLOSSARY).forEach(g => { g.href = url('guia') + '#' + g.anchor; });

  const parsePeriod = v => { const m = /^(20\d{2})\/Q([1-4])$/.exec(v || ''); return m ? Number(m[1]) * 4 + Number(m[2]) : -1; };
  const periodSort = (a, b) => parsePeriod(a) - parsePeriod(b);
  const periodLabel = p => p === 'todos' ? 'Todos los periodos' : String(p || '').replace(/^(\d{4})\/Q([1-4])$/, 'Q$2 $1');
  const PERIODS = (() => { const a = []; for (let y = 2026; y <= 2030; y++) for (let q = 1; q <= 4; q++) if (y > 2026 || q >= 3) a.push(`${y}/Q${q}`); return a; })();
  const now = () => new Date();
  const currentPeriod = () => { const d = now(); return `${d.getFullYear()}/Q${Math.floor(d.getMonth() / 3) + 1}`; };
  const quarterWeek = () => { const d = now(), q = Math.floor(d.getMonth() / 3); const s = new Date(d.getFullYear(), q * 3, 1); return Math.min(13, Math.max(1, Math.floor((d - s) / 6048e5) + 1)); };
  const defaultPeriod = () => 'todos';
  const code = n => String(n).padStart(2, '0');
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const num = n => n === null || n === undefined || n === '' ? '' : new Intl.NumberFormat('es-CL', {maximumFractionDigits: 2}).format(n);
  const pct = n => n === null || n === undefined ? null : new Intl.NumberFormat('es-CL', {maximumFractionDigits: 1}).format(n) + '%';
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const longDate = v => { if (!v) return 'Sin fecha'; const d = v instanceof Date ? v : new Date(`${v}T12:00:00`); return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`; };
  const shortDate = v => { if (!v) return 'Sin fecha'; const [y, m, d] = v.split('-'); return `${d}-${m}-${y}`; };
  const pctOf = (n, t) => t ? Math.round(n / t * 100) + '%' : '0%';
  const clamp = v => Math.max(0, Math.min(100, Number(v) || 0));

  function latest(records, id, period) {
    return records.filter(r => r.id === id && (period === 'todos' || r.period === period))
      .sort((a, b) => {
        const pr = r => r.moment === 'Confirmado GE' ? 2 : r.moment === 'Propuesta Owner' ? 1 : 0;
        return (period === 'todos' ? periodSort(b.period, a.period) : 0) || pr(b) - pr(a) || (b.date || '').localeCompare(a.date || '') || (b.source_row || 0) - (a.source_row || 0);
      })[0] || null;
  }
  function visibleKrs(krs, records, f) {
    const q = norm(f.q);
    return krs.filter(k =>
      (!f.objective || String(k.obj) === String(f.objective)) &&
      (!f.type || k.kr_type === f.type) &&
      (!f.owner || (f.owner === '__vacio__' ? !k.owner : k.owner === f.owner)) &&
      (!q || norm(k.id + ' ' + k.name).includes(q)) &&
      (f.period === 'todos' || (k.periods || []).includes(f.period) || records.some(r => r.id === k.id && r.period === f.period)));
  }
  function summarize(krs, records, period) {
    const rows = krs.map(kr => ({kr, record: latest(records, kr.id, period)}));
    const st = {'On Track': 0, 'Off Track': 0, 'At Risk': 0}, ex = {'No iniciado': 0, 'En proceso': 0, 'Completado': 0}, prog = [];
    rows.forEach(({record: r}) => {
      if (r && r.status in st) st[r.status]++;
      if (r && r.execution in ex) ex[r.execution]++;
      if (r && r.progress !== null && r.progress !== undefined && Number.isFinite(Number(r.progress))) prog.push(Number(r.progress));
    });
    const total = rows.length, noStatus = total - st['On Track'] - st['Off Track'] - st['At Risk'];
    return {rows, total, statuses: st, executions: ex, noStatus, noReport: rows.filter(x => !x.record).length,
      progressCount: prog.length, progressMean: prog.length ? prog.reduce((a, b) => a + b, 0) / prog.length : null};
  }

  // Filtros en la URL (periodo, objetivo por número, q, etc.)
  function readFilters() {
    const p = new URLSearchParams(location.search);
    return {period: p.get('periodo') || defaultPeriod(), objective: p.get('objetivo') || '', q: p.get('q') || '', type: p.get('tipo') || '',
      owner: p.get('owner') || '', inst: p.get('instancia') || '', status: p.get('estatus') || '', exec: p.get('hito') || ''};
  }
  function writeParams(obj) {
    const p = new URLSearchParams(location.search);
    Object.entries(obj).forEach(([k, v]) => { if (v === '' || v === null || v === undefined || (k === 'periodo' && v === defaultPeriod())) p.delete(k); else p.set(k, v); });
    const s = p.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); } catch (e) {}
  }
  function href(key, extra) {
    const f = readFilters(), p = new URLSearchParams();
    if (f.period !== defaultPeriod()) p.set('periodo', f.period);
    if (f.objective) p.set('objetivo', f.objective);
    if (f.owner) p.set('owner', f.owner);
    Object.entries(extra || {}).forEach(([k, v]) => { if (v) p.set(k, v); });
    const s = p.toString();
    return url(key) + (s ? '?' + s : '');
  }

  let cache = null;
  function load() {
    if (cache) return cache;
    const get = f => fetch('data/' + f, {cache: 'no-store'}).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
    cache = Promise.all([get('strategy.json'), get('tracking.json')]).then(([S, T]) => {
      const krs = S.krs.map(k => {
        const old = Number((/Objetivo\s+(\d+)/.exec(k.objective) || [])[1]);
        const n = OLD_TO_NEW[old], o = OBJECTIVES[n - 1];
        const m = Number((/^SO\d+\.(\d+)/.exec(k.subobjective) || [])[1]) || 1;
        return Object.assign({}, k, {obj: n, subIndex: m - 1, subCode: `SO${n}.${m}`, subText: o.subs[m - 1] || k.subobjective.replace(/^SO\d+\.\d+:\s*/, ''),
          name: k.name.replace(/^KR-\d+:?\s*/i, ''), objCode: o.code, objName: o.name});
      });
      const byId = new Map(krs.map(k => [k.id, k]));
      const records = T.records.filter(r => byId.has(r.id)).map(r => Object.assign({}, r, {obj: byId.get(r.id).obj}));
      const owners = [...new Set(krs.map(k => k.owner).filter(Boolean))].sort((x, y) => x.localeCompare(y, 'es'));
      return {krs, records, byId, owners, demo: !!(T.metadata && T.metadata.demo_records), hasTypes: krs.some(k => k.kr_type)};
    });
    return cache;
  }

  window.OKR = {PAGES, url, NAV, OBJECTIVES, STATUS, NO_STATUS, EXEC, INSTANCE, INSTANCE_ORDER, MOMENT, MIN_PROGRESS_SAMPLE, GLOSSARY, PERIODS,
    periodSort, periodLabel, currentPeriod, quarterWeek, defaultPeriod, code, norm, num, pct, pctOf, clamp, longDate, shortDate,
    latest, visibleKrs, summarize, readFilters, writeParams, href, load,
    status: s => STATUS[s] || NO_STATUS,
    whenReady: cb => { const t = () => window.OKR ? cb(window.OKR) : setTimeout(t, 20); t(); }};
})();
