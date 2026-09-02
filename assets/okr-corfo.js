const $ = (s) => document.querySelector(s);
let D = {};

const st = (v) => v == null ? 'Sin información' : v >= 70 ? 'Verde' : v >= 40 ? 'Amarillo' : 'Rojo';
const cl = (v) => v == null ? 'gray' : v >= 70 ? '' : v >= 40 ? 'yellow' : 'red';
const n = (s) => (s || 'sin informacion').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '-');
const q = () => new URLSearchParams(location.search);
const esc = (v) => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function injectFixes(){
  if(document.getElementById('okr-runtime-fixes')) return;
  const style = document.createElement('style');
  style.id = 'okr-runtime-fixes';
  style.textContent = `
    .brand-mark{
      width: 112px !important;
      height: 34px !important;
      padding: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      position: relative !important;
      overflow: visible !important;
      box-shadow: none !important;
      color: #fff !important;
      font-size: 28px !important;
      line-height: 1 !important;
      font-weight: 900 !important;
      letter-spacing: -1.5px !important;
      font-family: Arial Black, Arial, sans-serif !important;
    }
    .brand-mark .brand-logo{display:none !important;}
    .brand-mark::before{content:'CORFO'; color:#fff;}
    .brand-mark::after{
      content:'';
      position:absolute;
      left:0;
      bottom:-8px;
      width:56px;
      height:6px;
      background:linear-gradient(90deg,#0B6EAF 0 50%,#EF3340 50% 100%);
      border-radius:0 0 2px 2px;
    }
    .evolution-wrap{position:relative;}
    .evolution-chart{width:100%; height:auto; min-height:280px;}
    .chart-empty{padding:22px; color:var(--gris-2); text-align:center; border:1px dashed var(--borde); border-radius:18px; background:#FCFCFE;}
    .detail-grid{display:grid; grid-template-columns:1.15fr .85fr; gap:18px;}
    .detail-mini-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:12px;}
    .detail-mini-grid div{background:#F7F7FA; border:1px solid var(--borde); border-radius:16px; padding:12px;}
    .detail-mini-grid small{display:block; color:var(--gris-2); text-transform:uppercase; font-size:11px; font-weight:900; margin-bottom:4px;}
    @media(max-width:900px){.detail-grid,.detail-mini-grid{grid-template-columns:1fr}.brand-mark{width:96px !important;font-size:24px !important}.brand-mark::after{width:48px}}
  `;
  document.head.appendChild(style);
}

async function start(){
  injectFixes();
  try{
    D = await fetch('./data/okr-data.json', {cache:'no-store'}).then(r=>{
      if(!r.ok) throw new Error('No se pudo leer el JSON');
      return r.json();
    });
  }catch(e){
    $('#app').innerHTML = '<section class="card"><h1>Error al leer datos</h1><p>Revisa que exista el archivo <b>data/okr-data.json</b>.</p></section>';
    return;
  }
  const page = document.body.dataset.page.replace('-','_');
  ({panel, key_results:krs, detalle_kr:det, historico:hist, metodologia:met}[page] || panel)();
}

function per(){
  return [...new Set((D.avances || []).map(a => a.periodo_reporte))].sort();
}
function last(k,p){
  return (D.avances || [])
    .filter(a => a.kr_id === k.kr_id && a.periodo_reporte === p)
    .sort((a,b) => b.fecha_reporte.localeCompare(a.fecha_reporte))[0];
}
function pct(arr){
  const x = arr.filter(v => v != null && !Number.isNaN(Number(v))).map(Number);
  return x.length ? Math.round(x.reduce((m,v)=>m+v,0)/x.length) : null;
}
function fmtDate(s){
  if(!s) return 'Sin fecha';
  const [y,m,d] = s.split('-');
  return `${d}-${m}-${y}`;
}
function fmtShortDate(s){
  if(!s) return '';
  const [y,m,d] = s.split('-');
  return `${d}-${m}`;
}

function hero(t,d,v){
  return `<section class="hero"><div><span class="eyebrow">Estrategia Institucional 2026-2030</span><h1>${esc(t)}</h1><p>${esc(d)}</p></div><aside class="hero-side"><span>Cumplimiento promedio</span><strong>${v ?? '--'}%</strong><div class="progress ${cl(v)}" style="--v:${v || 0}%"><span></span></div></aside></section>`;
}
function card(k,a,p){
  const v = a?.cumplimiento_reportado;
  const e = st(v);
  return `<article class="card kr-card"><div><div class="kr-title">${esc(k.nombre_kr)}</div><div class="kr-meta"><span>${esc(k.dimension)}</span><span>${esc(k.area_lidera)}</span><span>${esc(p)}</span></div><p class="muted small">${esc(a?.comentario_avance || 'Sin reporte.')}</p></div><aside class="kr-side"><strong>${v ?? '--'}%</strong><span class="badge ${n(e)}">${esc(e)}</span><div class="progress ${cl(v)}" style="--v:${v || 0}%"><span></span></div><a class="btn ghost" href="./detalle-kr.html?kr=${encodeURIComponent(k.kr_id)}&periodo=${encodeURIComponent(p)}">Ver detalle</a></aside></article>`;
}

function panel(){
  const p = q().get('periodo') || per()[0];
  const ks = (D.krs || []).filter(k => (k.periodos || []).includes(p));
  const rs = ks.map(k => ({k, a:last(k,p)}));
  const v = pct(rs.map(r => r.a?.cumplimiento_reportado));
  $('#app').innerHTML = hero('Panel general de seguimiento KR','Vista ejecutiva por trimestre para monitorear avance, semáforos y comentarios vigentes.',v) + `
    <div class="controls"><div class="control"><label>Periodo</label><select id="periodo">${per().map(x=>`<option ${x===p?'selected':''}>${esc(x)}</option>`).join('')}</select></div></div>
    <div class="grid grid-4"><div class="card kpi"><small>KR vigentes</small><strong>${ks.length}</strong></div><div class="card kpi"><small>Con avance</small><strong>${rs.filter(r=>r.a).length}</strong></div><div class="card kpi"><small>Promedio</small><strong>${v ?? '--'}%</strong></div><div class="card kpi"><small>Rojos</small><strong>${rs.filter(r=>st(r.a?.cumplimiento_reportado)==='Rojo').length}</strong></div></div>
    <div class="section-title"><h2>KR destacados</h2><a class="btn secondary" href="./key-results.html?periodo=${encodeURIComponent(p)}">Ver todos</a></div>
    <div class="kr-list">${rs.map(r=>card(r.k,r.a,p)).join('')}</div>`;
  $('#periodo').onchange = e => location.href = './index.html?periodo=' + encodeURIComponent(e.target.value);
}

function krs(){
  const p = q().get('periodo') || per()[0];
  const rs = (D.krs || []).filter(k => (k.periodos || []).includes(p)).map(k => ({k, a:last(k,p)}));
  $('#app').innerHTML = hero('Key Results','Listado de KR por trimestre.',pct(rs.map(r=>r.a?.cumplimiento_reportado))) + `
    <div class="controls"><div class="control"><label>Periodo</label><select id="periodo">${per().map(x=>`<option ${x===p?'selected':''}>${esc(x)}</option>`).join('')}</select></div></div>
    <div class="kr-list">${rs.map(r=>card(r.k,r.a,p)).join('')}</div>`;
  $('#periodo').onchange = e => location.href = './key-results.html?periodo=' + encodeURIComponent(e.target.value);
}

function det(){
  const id = q().get('kr') || D.krs[0].kr_id;
  const p = q().get('periodo') || per()[0];
  const k = (D.krs || []).find(x => x.kr_id === id) || D.krs[0];
  const avDesc = (D.avances || []).filter(a => a.kr_id === k.kr_id && a.periodo_reporte === p).sort((a,b)=>b.fecha_reporte.localeCompare(a.fecha_reporte));
  const avAsc = [...avDesc].reverse();
  const a = avDesc[0];
  const v = a?.cumplimiento_reportado;
  const latest = a ? `<div class="comment latest"><small>Último comentario · ${fmtDate(a.fecha_reporte)} · Levantamiento ${a.levantamiento_n} · ${a.cumplimiento_reportado}%</small>${esc(a.comentario_avance)}</div>` : '<div class="empty">Este KR no tiene avances reportados para el periodo seleccionado.</div>';
  $('#app').innerHTML = hero('Detalle de KR', k.nombre_kr, v) + `
    <div class="controls"><div class="control"><label>Periodo</label><select id="periodo">${per().map(x=>`<option ${x===p?'selected':''}>${esc(x)}</option>`).join('')}</select></div></div>
    <section class="detail-grid">
      <div class="card">
        <h2>Ficha del resultado clave</h2>
        <p><b>Objetivo estratégico:</b> ${esc(k.objetivo_estrategico)}</p>
        <p><b>Subobjetivo:</b> ${esc(k.subobjetivo_estrategico || 'No informado')}</p>
        <p><b>Producto asociado:</b> ${esc(k.producto_asociado)}</p>
        <p><b>Medio de verificación:</b> ${esc(k.medio_verificacion_okr)}</p>
        <div class="detail-mini-grid">
          <div><small>Área líder</small><strong>${esc(k.area_lidera)}</strong></div>
          <div><small>Periodo seleccionado</small><strong>${esc(p)}</strong></div>
          <div><small>Avance actual</small><strong>${v ?? '--'}%</strong></div>
          <div><small>Semáforo</small><span class="badge ${n(st(v))}">${esc(st(v))}</span></div>
        </div>
      </div>
      <div class="card">
        <h2>Comentario vigente</h2>
        ${latest}
      </div>
    </section>
    <div class="section-title"><h2>Evolución del KR</h2><p class="muted">Avance reportado en los levantamientos del trimestre.</p></div>
    <section class="card chart-card evolution-wrap">
      ${avAsc.length ? '<svg id="evolutionChart" class="chart evolution-chart" viewBox="0 0 760 300" role="img" aria-label="Gráfico de evolución del KR"></svg>' : '<div class="chart-empty">Sin datos suficientes para graficar este periodo.</div>'}
    </section>
    <div class="section-title"><h2>Histórico de comentarios</h2></div>
    <div class="grid">${avDesc.map((x,i)=>`<div class="comment ${i===0?'latest':''}"><small>${fmtDate(x.fecha_reporte)} · Levantamiento ${x.levantamiento_n} · ${x.cumplimiento_reportado}% · ${esc(st(x.cumplimiento_reportado))}</small>${esc(x.comentario_avance)}</div>`).join('') || '<div class="empty">Sin comentarios para este periodo.</div>'}</div>`;
  $('#periodo').onchange = e => location.href = `./detalle-kr.html?kr=${encodeURIComponent(k.kr_id)}&periodo=${encodeURIComponent(e.target.value)}`;
  if(avAsc.length) drawEvolution(avAsc);
}

function drawEvolution(data){
  const svg = $('#evolutionChart');
  if(!svg) return;
  const W = 760, H = 300, L = 58, R = 24, T = 26, B = 54;
  const innerW = W - L - R;
  const innerH = H - T - B;
  const x = i => data.length === 1 ? L + innerW / 2 : L + (i * innerW / (data.length - 1));
  const y = v => T + innerH - (Math.max(0, Math.min(100, Number(v))) * innerH / 100);
  const gridVals = [0,25,50,75,100];
  const pts = data.map((d,i)=>[x(i), y(d.cumplimiento_reportado)]);
  let html = '';
  gridVals.forEach(g=>{
    html += `<line x1="${L}" y1="${y(g)}" x2="${W-R}" y2="${y(g)}" stroke="#E4E4EF" stroke-width="1"/>`;
    html += `<text x="${L-12}" y="${y(g)+4}" text-anchor="end" font-size="12" fill="#686877">${g}%</text>`;
  });
  html += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="#CFCFE0" stroke-width="1.5"/>`;
  html += `<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#CFCFE0" stroke-width="1.5"/>`;
  html += `<line x1="${L}" y1="${y(70)}" x2="${W-R}" y2="${y(70)}" stroke="#78D6BB" stroke-width="1.5" stroke-dasharray="6 6"/>`;
  html += `<text x="${W-R-88}" y="${y(70)-8}" font-size="12" fill="#0F766E">Umbral verde 70%</text>`;
  if(data.length > 1){
    html += `<polyline fill="none" stroke="#221E7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  }
  data.forEach((d,i)=>{
    const cx = x(i), cy = y(d.cumplimiento_reportado);
    const estado = st(d.cumplimiento_reportado);
    const fill = estado === 'Verde' ? '#78D6BB' : estado === 'Amarillo' ? '#F5C86A' : '#FD8983';
    html += `<circle cx="${cx}" cy="${cy}" r="8" fill="${fill}" stroke="#221E7C" stroke-width="3"><title>${fmtDate(d.fecha_reporte)} | Levantamiento ${d.levantamiento_n} | ${d.cumplimiento_reportado}% | ${esc(d.comentario_avance)}</title></circle>`;
    html += `<text x="${cx}" y="${cy-14}" text-anchor="middle" font-size="12" font-weight="800" fill="#221E7C">${d.cumplimiento_reportado}%</text>`;
    html += `<text x="${cx}" y="${H-22}" text-anchor="middle" font-size="12" fill="#686877">${fmtShortDate(d.fecha_reporte)}</text>`;
    html += `<text x="${cx}" y="${H-8}" text-anchor="middle" font-size="11" fill="#686877">L${d.levantamiento_n}</text>`;
  });
  svg.innerHTML = html;
}

function hist(){
  const rs = (D.avances || []).slice().sort((a,b)=>b.fecha_reporte.localeCompare(a.fecha_reporte));
  $('#app').innerHTML = hero('Histórico de avances','Trazabilidad de reportes KR.',null) + `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Periodo</th><th>KR</th><th>Avance</th><th>Comentario</th><th></th></tr></thead><tbody>${rs.map(a=>`<tr><td>${fmtDate(a.fecha_reporte)}</td><td>${esc(a.periodo_reporte)}</td><td>${esc(a.kr_id)}</td><td>${a.cumplimiento_reportado}%</td><td>${esc(a.comentario_avance)}</td><td><a class="btn ghost" href="./detalle-kr.html?kr=${encodeURIComponent(a.kr_id)}&periodo=${encodeURIComponent(a.periodo_reporte)}">Ver KR</a></td></tr>`).join('')}</tbody></table></div>`;
}

function met(){
  const d = D.definiciones || {contexto:'', mandato:'', iniciativas:[]};
  $('#app').innerHTML = hero('Metodología','Definiciones estratégicas y reglas de seguimiento.',null) + `<div class="grid grid-2"><section class="card"><h2>Contexto</h2><p>${esc(d.contexto)}</p></section><section class="card"><h2>Mandato</h2><p>${esc(d.mandato)}</p></section></div><div class="section-title"><h2>Iniciativas</h2></div><div class="grid grid-2 definition-card">${(d.iniciativas || []).map(i=>`<details open><summary>${esc(i.nombre)}</summary><p>${esc(i.descripcion)}</p></details>`).join('')}</div>`;
}

start();
