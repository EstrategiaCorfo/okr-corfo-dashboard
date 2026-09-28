/* V2: los datos locales se generan desde la planilla con scripts/generate_data.py. */
(() => {
  'use strict';
  const M = window.OKRModel;
  const app = document.getElementById('app');
  const page = document.body.dataset.page;
  let S = {objectives: [], krs: []}, T = {records: []}, notes = {};
  const esc = v => String(v ?? '').replace(/\u2014/g, '-').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const value = v => v === null || v === undefined || v === '' ? 'Sin información' : esc(v);
  const krName = k => k.name.replace(/^KR-\d+:?\s*/i,'');
  const vision = v => v.replace(/^Visión\s+\d+:\s*/i,'');
  const day = v => v ? new Intl.DateTimeFormat('es-CL', {day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(`${v}T12:00:00Z`)) : 'Sin fecha';
  const pct = v => v === null || v === undefined ? 'No aplica' : `${new Intl.NumberFormat('es-CL',{maximumFractionDigits:1}).format(v)}%`;
  const bar = v => v === null || v === undefined ? '' : `<div class="progress" role="img" aria-label="Progreso ${esc(pct(v))}"><span style="width:${Math.max(0,Math.min(100,Number(v)))}%"></span></div>`;
  const classOf = v => ({'On Track':'ok','Off Track':'warning','At Risk':'risk'})[v] || 'neutral';
  const statusName = v => ({'On Track':'En Cumplimiento / On Track','Off Track':'Alerta de cumplimiento / Off Track','At Risk':'Riesgo de cumplimiento / At Risk'})[v] || 'Sin información';
  const badge = (v,kind='neutral') => `<span class="badge ${kind}">${esc(v || 'Sin información')}</span>`;
  const unique = vals => [...new Set(vals.filter(Boolean))];
  const query = () => new URLSearchParams(location.search);
  const isLocal = ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const publicSite = !isLocal || query().get('publico') === '1';
  const demoLabel = record => record?.demo ? badge('DEMO','warning') : '';
  const demoNotice = () => T.metadata?.demo_records ? `<section class="demo-notice" role="note"><strong>VERSIÓN DEMO</strong><span>Los ${T.metadata.demo_records} reportes señalados como DEMO son ficticios y no representan avances oficiales de Corfo. Se muestran los ${S.krs.length} KR de la planilla; puede seleccionar un trimestre para filtrarlos.</span></section>` : '';
  const periods = () => unique([...S.krs.flatMap(k=>k.periods||[]),...T.records.map(r=>r.period)]).sort(M.periodSort);
  const defaultPeriod = () => 'todos';
  const filters = () => ({period:query().get('periodo')||defaultPeriod(),objective:query().get('objetivo')||'',owner:query().get('owner')||''});
  function href(path,extra={}) {
    const p = new URLSearchParams(), f = filters();
    if(publicSite && isLocal)p.set('publico','1');
    if (f.period !== defaultPeriod()) p.set('periodo',f.period);
    if (f.objective) p.set('objetivo',f.objective);
    if (f.owner) p.set('owner',f.owner);
    Object.entries(extra).forEach(([key,val])=>{if(val)p.set(key,val);});
    return `${path}${p.size?'?'+p:''}`;
  }
  const opt = (v,name,selected) => `<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(name)}</option>`;
  function nav() {document.querySelectorAll('.nav a[data-target]').forEach(a=>a.href=href(a.dataset.target));}
  function controls(f) {
    return `<section class="filters card" aria-label="Filtros globales">
      <div class="field"><label for="filter-period">Periodo / Q</label><select id="filter-period">${opt('todos','Todos los periodos',f.period)}${periods().map(p=>opt(p,p,f.period)).join('')}</select></div>
      <div class="field"><label for="filter-objective">Objetivo estratégico</label><select id="filter-objective">${opt('','Todos los objetivos',f.objective)}${S.objectives.map(o=>opt(o.name,o.name,f.objective)).join('')}</select></div>
      <div class="field"><label for="filter-owner">Owner</label><select id="filter-owner">${opt('','Todos los Owners',f.owner)}${unique(S.krs.map(k=>k.owner)).sort((a,b)=>a.localeCompare(b,'es')).map(o=>opt(o,o,f.owner)).join('')}${opt('__vacio__','Sin Owner informado',f.owner)}</select></div>
      <button class="button secondary" type="button" id="clear-filters">Limpiar filtros</button></section>`;
  }
  function bind() {
    const change = () => {
      const p=query();
      for(const [id,key] of [['filter-period','periodo'],['filter-objective','objetivo'],['filter-owner','owner']]) {
        const control=document.getElementById(id);
        const v=control.disabled?'':control.value;
        if(v && (key!=='periodo'||v!==defaultPeriod()))p.set(key,v);else p.delete(key);
      }
      history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));render();
    };
    ['filter-period','filter-objective','filter-owner'].forEach(id=>document.getElementById(id)?.addEventListener('change',change));
    document.getElementById('clear-filters')?.addEventListener('click',()=>{
      const p=new URLSearchParams();
      if(publicSite && isLocal)p.set('publico','1');
      if(page==='detail'&&query().get('kr'))p.set('kr',query().get('kr'));
      history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));render();
    });
  }
  const hero = (title,desc,f,count) => `<section class="hero"><div><span class="eyebrow">Estrategia Corporativa 2026-2030</span><h1>${esc(title)}</h1><p>${esc(desc)}</p></div><div class="hero-number"><strong>${count}</strong><span>KR en el filtro</span></div></section>${controls(f)}`;
  const stat = (name,n,small='') => `<article class="card stat"><span>${esc(name)}</span><strong>${esc(n)}</strong><small>${esc(small)}</small></article>`;
  const fact = (label,content) => `<div><dt>${esc(label)}</dt><dd>${content}</dd></div>`;
  const number = n => n === null || n === undefined ? 'Sin información' : new Intl.NumberFormat('es-CL',{maximumFractionDigits:2}).format(n);
  const reportFacts = r => `<dl class="facts report-facts">${[
    fact('Periodo de reporte',value(r.period)),fact('Fecha de reporte',day(r.date)),
    fact('Instancia',value(r.instance)),fact('Momento del registro',value(r.moment)),
    fact('Estado de ejecución',value(r.execution)),fact('Estatus',statusName(r.status)),
    fact('Línea base',number(r.baseline)),fact('Meta',number(r.target)),
    fact('Valor actual',number(r.current)),fact('Progreso',pct(r.progress)),
    fact('Comentario cualitativo',value(r.comment)),fact('Evidencia / soporte',value(r.evidence)),
    fact('Aprendizaje',value(r.learning)),fact('¿Quedó pendiente?',value(r.pending)),
    fact('Tratamiento del pendiente',value(r.pending_treatment)),
    fact('Periodo de traspaso',value(r.transfer_period)),
  ].join('')}</dl>`;
  function distribution(data,total,kind) {
    return `<div class="distribution">${Object.entries(data).map(([name,n])=>`<div class="distribution-row"><div class="distribution-label"><span>${esc(name)}</span><strong>${n}</strong></div><div class="distribution-track"><span class="${kind==='status'?classOf(name):name==='Completado'?'complete':name==='En proceso'?'in-progress':'not-started'}" style="width:${total?n/total*100:0}%"></span></div></div>`).join('')}</div>`;
  }
  function krCard(k,r) {
    return `<article class="card kr-card"><div class="kr-main"><div class="kr-code">${esc(k.id)} <span>${esc(k.target_period)}</span> ${demoLabel(r)}</div><h3><a href="${esc(href('detalle-kr.html',{kr:k.id}))}">${esc(krName(k))}</a></h3>
      <p class="small">${esc(k.objective)} · ${esc(k.subobjective)}</p><p class="small"><strong>Owner:</strong> ${value(k.owner)} · <strong>Fecha meta:</strong> ${day(k.target_date)}</p>${r?.comment?`<p class="last-comment">${esc(r.comment)}</p>`:''}</div>
      <div class="kr-snapshot"><div><small>Estado de ejecución</small>${badge(r?.execution)}</div><div><small>Estatus</small>${badge(statusName(r?.status),classOf(r?.status))}</div><div><small>Progreso numérico</small><strong>${pct(r?.progress)}</strong>${bar(r?.progress)}</div></div></article>`;
  }
  function panel(f,krs,s) {
    const attention=s.rows.filter(({record:r})=>r&&(r.status==='Off Track'||r.status==='At Risk'||/^(s[ií]|yes)$/i.test(r.pending||'')));
    const list=periods(),prev=list[list.indexOf(f.period)-1];
    let evolution='Sin datos comparables del periodo anterior.';
    if(prev&&f.period!=='todos') {
      const paired=s.rows.filter(({kr,record})=>record&&M.latest(T.records,kr.id,prev));
      if(paired.length) evolution=`${paired.length} KR con reportes en ambos periodos. Completados: ${paired.filter(({kr})=>M.latest(T.records,kr.id,prev).execution==='Completado').length} en ${prev} y ${paired.filter(({record})=>record.execution==='Completado').length} en ${f.period}.`;
    }
    app.innerHTML=hero('Panel general','Estado operativo, progreso numérico y evaluación cualitativa en vías independientes.',f,krs.length)+
      `<section class="stat-grid">${stat('KR seleccionados',s.total,`Periodo ${f.period}`)}${stat('No iniciados',s.executions['No iniciado'])}${stat('En proceso',s.executions['En proceso'])}${stat('Completados',s.executions.Completado)}</section>
      <div class="two-columns"><section class="card"><h2>Estado de ejecución</h2><p class="muted">Estado operativo del último reporte vigente.</p>${distribution(s.executions,s.total,'execution')}<p class="small muted">${s.noReport} sin reporte · ${s.noExecution} con estado no informado</p></section>
      <section class="card"><h2>Estatus</h2><p class="muted">Evaluación cualitativa, independiente del progreso.</p>${distribution(s.statuses,s.total,'status')}<p class="small muted">${s.noReport+s.noStatus} sin estatus informado</p></section></div>
      <div class="two-columns"><section class="card highlight"><h2>Progreso disponible</h2><strong class="big-number">${pct(s.progressMean)}</strong><p class="muted">Promedio de ${s.progressCount} KR medibles entre ${s.total} seleccionados. Los hitos sin variables numéricas no se estiman.</p></section>
      <section class="card"><h2>Evolución trimestral</h2><p>${esc(evolution)}</p></section></div>
      <section class="section-head"><div><h2>KR que requieren atención</h2><p>Alertas, riesgos o pendientes informados.</p></div><a class="button" href="${esc(href('key-results.html'))}">Ver todos los KR</a></section>
      ${attention.length?`<div class="card-list">${attention.map(({kr,record})=>krCard(kr,record)).join('')}</div>`:'<div class="card empty">No hay alertas ni pendientes reportados en este filtro.</div>'}`;
  }
  function keyResults(f,krs,s) {
    app.innerHTML=hero('Key Results','Definición estratégica y último reporte vigente del periodo.',f,krs.length)+
      `<section class="section-head"><div><h2>Resultados clave</h2><p>${s.noReport} KR sin reporte.</p></div></section>`+
      (krs.length?`<div class="card-list">${s.rows.map(({kr,record})=>krCard(kr,record)).join('')}</div>`:'<div class="card empty">No hay KR para esta combinación de filtros.</div>');
  }
  function detail(f,krs) {
    const requested=query().get('kr');
    const kr=requested?krs.find(k=>k.id===requested):krs[0];
    if(!kr){app.innerHTML=hero('Detalle de KR','Seleccione un KR desde Key Results.',f,0);return;}
    const r=M.latest(T.records,kr.id,f.period);
    const log=T.records.filter(x=>x.id===kr.id).sort((a,b)=>(a.date||'').localeCompare(b.date||'')||a.source_row-b.source_row);
    app.innerHTML=hero('Detalle de KR','Ficha estratégica e historial completo.',f,krs.length)+
      `<a class="back-link" href="${esc(href('key-results.html'))}">← Volver a Key Results</a><div class="detail-grid"><section class="card detail-main"><span class="kr-code">${esc(kr.id)}</span><h2>${esc(krName(kr))}</h2>
      <dl class="facts">${[
        fact('Objetivo estratégico',value(kr.objective)),fact('Subobjetivo',value(kr.subobjective)),
        fact('Dimensión',value(kr.dimension)),fact('Visión',value(kr.vision)),
        fact('Periodo meta',value(kr.target_period)),fact('Año KR',value(kr.target_year)),
        fact('Q',value(kr.quarter)),fact('Fecha meta',day(kr.target_date)),
        fact('Área que lidera',value(kr.area)),fact('Owner',value(kr.owner)),
        fact('Suplentes',value(kr.substitutes)),
        fact('Producto asociado estimado',value(kr.product)),
        fact('Medio de verificación estimado',value(kr.verification)),
        fact('Comentarios de estrategia',value(kr.comments)),
      ].join('')}</dl></section>
      <section class="card"><h2>Último reporte vigente ${demoLabel(r)}</h2><div class="snapshot-grid"><div><small>Estado de ejecución</small>${badge(r?.execution)}</div><div><small>Estatus</small>${badge(statusName(r?.status),classOf(r?.status))}</div><div><small>Progreso</small><strong>${pct(r?.progress)}</strong>${bar(r?.progress)}</div></div>
      ${r?reportFacts(r):'<p>Sin reportes para el periodo seleccionado.</p>'}</section></div>
      <section class="section-head"><div><h2>Historial completo</h2><p>${log.length} observaciones de este KR, en orden cronológico.</p></div></section>
      ${log.length?`<div class="history-list">${log.map(x=>`<article class="card history-item"><div class="history-top"><strong>${day(x.date)}</strong><span>${esc(x.period)} · ${esc(x.instance)} · ${esc(x.moment)}</span></div><div class="inline-badges">${demoLabel(x)}${badge(x.execution)}${badge(statusName(x.status),classOf(x.status))}<span>Progreso: ${pct(x.progress)}</span></div><p>${value(x.comment)}</p><details class="report-more"><summary>Ver todos los campos del reporte</summary>${reportFacts(x)}</details></article>`).join('')}</div>`:'<div class="card empty">Sin reportes históricos.</div>'}`;
  }
  function historyPage(f) {
    const krs=M.visibleKrs(S.krs,T.records,f), byId=new Map(S.krs.map(k=>[k.id,k]));
    const kr=query().get('hist_kr')||'',exec=query().get('hist_estado')||'',status=query().get('hist_estatus')||'';
    const rows=T.records.filter(r=>{const k=byId.get(r.id);return k&&krs.includes(k)&&(f.period==='todos'||r.period===f.period)&&(!kr||r.id===kr)&&(!exec||r.execution===exec)&&(!status||r.status===status);})
      .sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.source_row-a.source_row);
    app.innerHTML=hero('Histórico','Cada fila corresponde a una observación original de Seguimiento.',f,krs.length)+
      `<section class="card history-filters"><div class="field"><label for="hist-kr">KR</label><select id="hist-kr">${opt('','Todos los KR',kr)}${krs.map(k=>opt(k.id,`${k.id}: ${krName(k)}`,kr)).join('')}</select></div>
      <div class="field"><label for="hist-execution">Estado de ejecución</label><select id="hist-execution">${opt('','Todos los estados',exec)}${['No iniciado','En proceso','Completado'].map(v=>opt(v,v,exec)).join('')}</select></div>
      <div class="field"><label for="hist-status">Estatus</label><select id="hist-status">${opt('','Todos los estatus',status)}${['On Track','Off Track','At Risk'].map(v=>opt(v,statusName(v),status)).join('')}</select></div></section>
      <section class="section-head"><div><h2>Registros de seguimiento</h2><p>${rows.length} reportes tras aplicar todos los filtros.</p></div></section>
      ${rows.length?`<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Periodo</th><th>KR y objetivo</th><th>Owner</th><th>Instancia / Momento</th><th>Estado</th><th>Progreso</th><th>Estatus</th><th>Comentario</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${day(r.date)} ${demoLabel(r)}</td><td>${esc(r.period)}</td><td><a href="${esc(href('detalle-kr.html',{kr:r.id}))}">${esc(r.id)}</a><small>${esc(byId.get(r.id).objective)}</small></td><td>${value(byId.get(r.id).owner)}</td><td>${esc(r.instance)}<small>${esc(r.moment)}</small></td><td>${badge(r.execution)}</td><td>${pct(r.progress)}</td><td>${badge(statusName(r.status),classOf(r.status))}</td><td>${value(r.comment)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="card empty">No hay registros para esta combinación de filtros.</div>'}`;
    [['hist-kr','hist_kr'],['hist-execution','hist_estado'],['hist-status','hist_estatus']].forEach(([id,key])=>document.getElementById(id).addEventListener('change',e=>{
      const p=query();if(e.target.value)p.set(key,e.target.value);else p.delete(key);
      history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));render();
    }));
  }
  function node(o,selected) {return `<button type="button" class="strategy-node ${o.name===selected?'selected':''}" data-objective="${esc(o.name)}" aria-pressed="${o.name===selected}" aria-controls="strategy-detail"><span>Objetivo ${o.number}</span><strong>${esc(o.name.replace(/^Objetivo\s+\d+:\s*/i,''))}</strong></button>`;}
  function strategyPage(f,krs) {
    const group=t=>S.objectives.filter(o=>o.dimension.toLocaleLowerCase('es').includes(t));
    const order=(arr,terms)=>arr.sort((a,b)=>terms.findIndex(t=>a.name.toLocaleLowerCase('es').includes(t))-terms.findIndex(t=>b.name.toLocaleLowerCase('es').includes(t)));
    const impact=group('marco global'),impulse=order(group('impulso'),['capacidades tecnológicas','financiamiento','desarrollo desde']),role=order(group('rol'),['conexión empresarial','un estado']),enablers=order(group('habilitante'),['personas','tecnología']);
    const selected=S.objectives.find(o=>o.name===query().get('eje')&&(!f.objective||o.name===f.objective))||S.objectives.find(o=>o.name===f.objective)||S.objectives[0];
    const visible=krs.filter(k=>k.objective===selected?.name),all=S.krs.filter(k=>k.objective===selected?.name),s=M.summarize(visible,T.records,f.period),owners=unique(all.map(k=>k.owner));
    app.innerHTML=hero('Estrategia','Seleccione un objetivo del esquema para ver su definición y seguimiento.',f,krs.length)+
      `<section class="strategy-layout" aria-label="Esquema de la Estrategia Corfo 2026-2030"><div class="impact-layer"><div class="layer-name">Impacto</div><div class="impact-axes">+Productividad <span>+Inversión</span> +Crecimiento</div>${impact.map(o=>node(o,selected?.name)).join('')}</div>
      <div class="mountain-band" role="presentation"></div><div class="strategy-core"><div class="strategy-group impulse"><h2>Impulso Corfo</h2><div class="strategy-nodes">${impulse.map(o=>node(o,selected?.name)).join('')}</div></div><div class="strategy-group role"><h2>Rol de Corfo</h2><div class="strategy-nodes">${role.map(o=>node(o,selected?.name)).join('')}</div></div></div>
      <div class="strategy-group enablers"><h2>Habilitantes</h2><div class="strategy-nodes">${enablers.map(o=>node(o,selected?.name)).join('')}</div></div></section>
      ${selected?`<section class="card objective-detail" id="strategy-detail" tabindex="-1"><div class="objective-head"><div><p class="eyebrow dark">${esc(selected.dimension)} · Objetivo ${selected.number}</p><h2>${esc(selected.name)}</h2></div><strong>${all.length} KR en total</strong></div>
      <div class="detail-grid"><div><h3>Visión</h3><p>${esc(vision(selected.vision))}</p><h3>Justificación</h3><p>${notes[selected.name]?esc(notes[selected.name]):'Sin información'}</p><h3>Subobjetivos</h3><ul>${selected.subobjectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>Owners</h3><p>${owners.length?owners.map(esc).join('; '):'Sin información'}</p></div>
      <div><h3>Seguimiento del filtro</h3><p><strong>${visible.length}</strong> KR en ${esc(f.period)}. <strong>${s.noReport}</strong> sin reporte.</p><h4>Estado de ejecución</h4>${distribution(s.executions,visible.length,'execution')}<h4>Estatus</h4>${distribution(s.statuses,visible.length,'status')}<p class="small muted">${s.noReport+s.noStatus} sin estatus informado.</p><h4>Progreso disponible</h4><p>${pct(s.progressMean)} (${s.progressCount} KR medibles)</p></div></div>
      <h3>KR relacionados en el filtro</h3>${visible.length?`<div class="objective-krs">${visible.map(k=>`<a href="${esc(href('detalle-kr.html',{kr:k.id}))}">${esc(k.id)} · ${esc(krName(k))}</a>`).join('')}</div>`:'<p>Sin KR para el filtro seleccionado.</p>'}</section>`:''}`;
    document.querySelectorAll('[data-objective]').forEach(button=>button.addEventListener('click',()=>{
      const p=query();p.set('eje',button.dataset.objective);
      if(f.objective)p.set('objetivo',button.dataset.objective);
      history.replaceState(null,'',location.pathname+'?'+p);render();
      document.getElementById('strategy-detail')?.focus({preventScroll:true});document.getElementById('strategy-detail')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }));
  }
  function render() {
    nav();const f=filters(),krs=M.visibleKrs(S.krs,T.records,f),s=M.summarize(krs,T.records,f.period);
    if(page==='krs')keyResults(f,krs,s);
    else if(page==='detail')detail(f,krs);
    else if(page==='history')historyPage(f);
    else if(page==='strategy')strategyPage(f,krs);
    else panel(f,krs,s);
    if(T.metadata?.demo_records)app.insertAdjacentHTML('afterbegin',demoNotice());
    bind();nav();
  }
  async function load(file,optional=false) {
    const r=await fetch(`./data/${file}`,{cache:'no-store'});
    if(!r.ok){if(optional)return {};throw new Error(`Falta ${file} (${r.status})`);}
    return r.json();
  }
  const folder = publicSite ? 'public/' : '';
  Promise.all([load(`${folder}strategy.json`),load(`${folder}tracking.json`),load(`${folder}objective-notes.json`,true)])
    .then(([strategy,tracking,descriptions])=>{
      S=strategy;T=tracking;notes=descriptions;
      if(!Array.isArray(S.krs)||!Array.isArray(S.objectives)||!Array.isArray(T.records))throw new Error('Los JSON no tienen la estructura esperada.');
      if(publicSite && (S.metadata?.publication!=='public'||T.metadata?.publication!=='public'))throw new Error('La versión pública requiere JSON publicados.');
      if(T.metadata?.demo_records)document.title=`DEMO | ${document.title}`;
      render();
    }).catch(error=>{
      app.innerHTML=`<section class="card empty"><h1>Datos no disponibles</h1><p>No se pudieron cargar los datos de la estrategia y el seguimiento. Intente actualizar la página.</p></section>`;
      console.warn('Datos no disponibles:',error.message);
    });
})();
