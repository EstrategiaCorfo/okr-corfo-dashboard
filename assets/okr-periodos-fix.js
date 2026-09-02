// Normaliza la base completa de KR y asegura que todos los trimestres estén disponibles.
// Esta capa corrige la diferencia entre el JSON original de la planilla
// y el esquema usado por el dashboard.
(function(){
  const ALL_PERIODS = [
    '2026/Q3','2026/Q4',
    '2027/Q1','2027/Q2','2027/Q3','2027/Q4',
    '2028/Q1','2028/Q2','2028/Q3','2028/Q4',
    '2029/Q1','2029/Q2','2029/Q3','2029/Q4',
    '2030/Q1','2030/Q2','2030/Q3','2030/Q4'
  ];

  function periodIndex(label){
    const m = String(label || '').match(/(20\d{2})\s*\/\s*Q([1-4])/i);
    return m ? Number(m[1]) * 4 + Number(m[2]) : null;
  }

  function expandPeriods(kr){
    if(Array.isArray(kr.periodos) && kr.periodos.length > 2){
      return kr.periodos.filter(p => ALL_PERIODS.includes(p));
    }
    let start = periodIndex(kr.periodo_inicio || kr.periodo_meta_original || kr.periodo_reporte);
    let end = periodIndex(kr.periodo_fin || kr.periodo_inicio || kr.periodo_meta_original || kr.periodo_reporte);

    if(!start && Array.isArray(kr.periodos) && kr.periodos.length){
      start = periodIndex(kr.periodos[0]);
      end = periodIndex(kr.periodos[kr.periodos.length - 1]);
    }
    if(start && !end) end = start;
    if(end && start && end < start) end = start;
    if(!start || !end) return Array.isArray(kr.periodos) ? kr.periodos : [];

    return ALL_PERIODS.filter(p => {
      const i = periodIndex(p);
      return i >= start && i <= end;
    });
  }

  function normalizeData(){
    if(typeof D === 'undefined' || !D) return false;

    if((!Array.isArray(D.krs) || D.krs.length === 0) && Array.isArray(D.key_results)){
      D.krs = D.key_results;
    }
    if((!Array.isArray(D.avances) || D.avances.length === 0) && Array.isArray(D.avances_kr)){
      D.avances = D.avances_kr;
    }
    if(!Array.isArray(D.krs) || D.krs.length === 0) return false;

    D.periodos = ALL_PERIODS;
    D.krs = D.krs.map(kr => ({
      ...kr,
      periodos: expandPeriods(kr)
    }));
    D.avances = Array.isArray(D.avances) ? D.avances : [];
    return true;
  }

  function currentRenderer(){
    const page = (document.body.dataset.page || 'panel').replace('-', '_');
    if(page === 'key_results' && typeof krs === 'function') return krs;
    if(page === 'detalle_kr' && typeof det === 'function') return det;
    if(page === 'historico' && typeof hist === 'function') return hist;
    if(page === 'metodologia' && typeof met === 'function') return met;
    if(typeof panel === 'function') return panel;
    return null;
  }

  function applyFix(){
    if(!normalizeData()) return false;
    const render = currentRenderer();
    if(render) render();
    return true;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    try{
      if(applyFix()) clearInterval(timer);
    }catch(e){
      if(attempts > 80) clearInterval(timer);
    }
    if(attempts > 80) clearInterval(timer);
  }, 100);
})();
