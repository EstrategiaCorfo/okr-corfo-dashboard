(function(){
  const DEFAULT_START = '2026/Q3';
  const DEFAULT_END = '2030/Q4';

  function periodOrder(period){
    const m = String(period || '').match(/(20\d{2})\s*\/\s*Q([1-4])/i);
    if(!m) return null;
    return Number(m[1]) * 4 + Number(m[2]);
  }

  function periodLabel(order){
    let year = Math.floor(order / 4);
    let quarter = order % 4;
    if(quarter === 0){ year -= 1; quarter = 4; }
    return `${year}/Q${quarter}`;
  }

  function periodRange(start, end){
    const a = periodOrder(start);
    const b = periodOrder(end || start);
    if(a == null || b == null || b < a) return [];
    const out = [];
    for(let i = a; i <= b; i++) out.push(periodLabel(i));
    return out;
  }

  function sortPeriods(values){
    return [...new Set(values.filter(Boolean))]
      .sort((a,b) => (periodOrder(a) || 0) - (periodOrder(b) || 0));
  }

  function normalizePeriods(){
    if(typeof D === 'undefined' || !Array.isArray(D.krs) || !D.krs.length) return false;

    const full = periodRange(DEFAULT_START, DEFAULT_END);
    const fromData = Array.isArray(D.periodos) ? D.periodos : [];
    const fromKrs = [];

    D.krs.forEach(k => {
      const range = periodRange(k.periodo_inicio, k.periodo_fin);
      const current = Array.isArray(k.periodos) ? k.periodos : [];
      k.periodos = sortPeriods([...current, ...range]);
      fromKrs.push(...k.periodos);
    });

    D.periodos = sortPeriods([...full, ...fromData, ...fromKrs]);
    return true;
  }

  function rerenderCurrentPage(){
    const page = (document.body.dataset.page || 'panel').replace('-', '_');
    const renderers = { panel, key_results: krs, detalle_kr: det, historico: hist, metodologia: met };
    if(renderers[page]) renderers[page]();
  }

  function applyFix(attempt = 0){
    if(normalizePeriods()){
      rerenderCurrentPage();
      return;
    }
    if(attempt < 80) setTimeout(() => applyFix(attempt + 1), 100);
  }

  applyFix();
})();
