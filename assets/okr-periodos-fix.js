// Carga definitiva desde la planilla convertida a JSON.
// Reemplaza cualquier demo antigua de 6 KR por la base completa de 161 KR.
(function(){
  const ALL_PERIODS = [
    '2026/Q3','2026/Q4',
    '2027/Q1','2027/Q2','2027/Q3','2027/Q4',
    '2028/Q1','2028/Q2','2028/Q3','2028/Q4',
    '2029/Q1','2029/Q2','2029/Q3','2029/Q4',
    '2030/Q1','2030/Q2','2030/Q3','2030/Q4'
  ];
  const VERSION = '20260902-planilla-v3';

  function periodIndex(label){
    const m = String(label || '').match(/(20\d{2})\s*\/\s*Q([1-4])/i);
    return m ? Number(m[1]) * 4 + Number(m[2]) : null;
  }

  function indexPeriod(index){
    const year = Math.floor((index - 1) / 4);
    const quarter = index - year * 4;
    return `${year}/Q${quarter}`;
  }

  function expandPeriods(kr){
    if(Array.isArray(kr.periodos) && kr.periodos.length){
      return kr.periodos.filter(p => ALL_PERIODS.includes(p));
    }
    let start = periodIndex(kr.periodo_inicio || kr.periodo_meta_original || kr.periodo_reporte);
    let end = periodIndex(kr.periodo_fin || kr.periodo_inicio || kr.periodo_meta_original || kr.periodo_reporte);
    if(!start) return [];
    if(!end || end < start) end = start;
    const out = [];
    for(let i = start; i <= end; i++) out.push(indexPeriod(i));
    return out.filter(p => ALL_PERIODS.includes(p));
  }

  async function decodeGzipBase64(payload){
    if(!('DecompressionStream' in window)){
      throw new Error('Este navegador no soporta DecompressionStream. Usar Chrome, Edge o navegador actualizado.');
    }
    const bin = atob(payload);
    const bytes = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }

  async function loadPlanillaJson(){
    const manifest = await fetch(`data/okr-data.json?v=${VERSION}`, {cache:'no-store'}).then(r => {
      if(!r.ok) throw new Error('No se pudo leer data/okr-data.json');
      return r.json();
    });

    if(manifest.encoding === 'gzip+base64-parts' && Array.isArray(manifest.parts)){
      const chunks = await Promise.all(manifest.parts.map(path =>
        fetch(`${path}?v=${VERSION}`, {cache:'no-store'}).then(r => {
          if(!r.ok) throw new Error('No se pudo leer ' + path);
          return r.text();
        })
      ));
      return JSON.parse(await decodeGzipBase64(chunks.join('')));
    }

    if(manifest.encoding === 'gzip+base64' && manifest.payload){
      return JSON.parse(await decodeGzipBase64(manifest.payload));
    }

    return manifest;
  }

  function normalizeData(raw){
    const keyResults = Array.isArray(raw.key_results) ? raw.key_results : (Array.isArray(raw.krs) ? raw.krs : []);
    const avances = Array.isArray(raw.avances_kr) ? raw.avances_kr : (Array.isArray(raw.avances) ? raw.avances : []);
    const krsNorm = keyResults.map(kr => ({
      ...kr,
      periodos: expandPeriods(kr)
    }));
    return {
      ...raw,
      krs: krsNorm,
      avances: avances,
      periodos: ALL_PERIODS
    };
  }

  function renderer(){
    const page = (document.body.dataset.page || 'panel').replace('-', '_');
    if(page === 'key_results' && typeof krs === 'function') return krs;
    if(page === 'detalle_kr' && typeof det === 'function') return det;
    if(page === 'historico' && typeof hist === 'function') return hist;
    if(page === 'metodologia' && typeof met === 'function') return met;
    if(typeof panel === 'function') return panel;
    return null;
  }

  async function applyPlanillaData(){
    try{
      const raw = await loadPlanillaJson();
      D = normalizeData(raw);
      if(D.krs.length < 100){
        throw new Error('La base cargada no corresponde a los 161 KR esperados.');
      }
      const render = renderer();
      if(render) render();
      console.info(`OKR Corfo: base completa cargada desde planilla (${D.krs.length} KR, ${D.avances.length} avances).`);
    }catch(err){
      console.error('No se pudo cargar la base completa desde la planilla:', err);
      const app = document.querySelector('#app');
      if(app){
        app.innerHTML = '<section class="card"><h1>Error al cargar la base completa</h1><p>No se pudo leer el JSON generado desde la planilla. Revisa los archivos en la carpeta data.</p></section>';
      }
    }
  }

  setTimeout(applyPlanillaData, 100);
  setTimeout(applyPlanillaData, 1200);
})();
