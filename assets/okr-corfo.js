/* Dashboard de la Estrategia Corporativa. Los datos se generan desde la planilla. */
(() => {
  'use strict';
  const M = window.OKRModel, C = window.OKRConfig;
  const app = document.getElementById('app'), banner = document.getElementById('demo-banner');
  const page = document.body.dataset.page;
  let S = {objectives: [], krs: []}, T = {records: []}, notes = {};
  const esc = v => String(v ?? '').replace(/\u2014/g, '-').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const value = v => v === null || v === undefined || v === '' ? 'No informado' : esc(v);
  const number = n => n === null || n === undefined ? 'No informado' : new Intl.NumberFormat('es-CL',{maximumFractionDigits:2}).format(n);
  const day = v => v ? new Intl.DateTimeFormat('es-CL',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(`${v}T12:00:00Z`)) : 'No informado';
  const periodLabel = p => p === 'todos' ? 'Todos los periodos' : (p || '')
    .replace(/(20\d{2})\/Q([1-4])\s*-\s*(20\d{2})\/Q([1-4])/g, 'Q$2 $1 a Q$4 $3')
    .replace(/(20\d{2})\/Q([1-4])-Q([1-4])/g, 'Q$2 a Q$3 $1')
    .replace(/(20\d{2})\/Q([1-4])/g, 'Q$2 $1');
  const krName = k => (k.name || '').replace(/^KR-\d+:?\s*/i, '');
  const objectiveName = o => o.name.replace(/^Objetivo\s+\d+:\s*/i, '');
  const code = n => String(n).padStart(2, '0');
  const percent = n => n === null || n === undefined ? 'No aplica (sin variables numéricas)' : `${new Intl.NumberFormat('es-CL',{maximumFractionDigits:1}).format(n)}%`;
  const statusClass = s => ({'On Track':'ok','Off Track':'warning','At Risk':'risk'})[s] || 'neutral';
  const statusLabel = s => C.status[s]?.label || 'Sin reporte';
  const executionLabel = s => C.execution[s] || (s ? value(s) : 'Sin reporte');
  const instanceLabel = s => C.instance[s] || value(s);
  const momentLabel = s => C.moment[s] || value(s);
  const unique = vals => [...new Set(vals.filter(Boolean))];
  const query = () => new URLSearchParams(location.search);
  const isLocal = ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const publicSite = !isLocal || query().get('publico') === '1';
  const periods = () => unique([...S.krs.flatMap(k => k.periods || []), ...T.records.map(r => r.period)]).sort(M.periodSort);
  const filters = () => ({period:query().get('periodo') || 'todos', objective:query().get('objetivo') || '', owner:query().get('owner') || '', q:['krs','history'].includes(page) ? query().get('q') || '' : ''});
  const opt = (v,label,selected) => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(label)}</option>`;
  const badge = (label,kind='neutral',hint='') => `<span class="badge ${kind}"${hint ? ` title="${esc(hint)}"` : ''}>${esc(label)}</span>`;
  const demoLabel = r => r?.demo ? badge('Dato ficticio','demo','Reporte de demostración; no es un avance oficial') : '';
  const statusBadge = s => C.status[s] ? `<span class="badge ${statusClass(s)}" title="${C.status[s].hint}"><span aria-hidden="true">${C.status[s].icon}</span> ${C.status[s].label}</span>` : badge('Sin reporte');
  const fact = (label,content) => `<div><dt>${esc(label)}</dt><dd>${content}</dd></div>`;
  const statusTotal = s => Object.values(s.statuses).reduce((a,b) => a+b, 0);

  function href(path,extra={}) {
    const p=new URLSearchParams(),f=filters();
    if(publicSite&&isLocal)p.set('publico','1');
    if(f.period!=='todos')p.set('periodo',f.period);
    if(f.objective)p.set('objetivo',f.objective);
    if(f.owner)p.set('owner',f.owner);
    if(f.q&&/^(key-results|historico-avances)\.html$/.test(path))p.set('q',f.q);
    Object.entries(extra).forEach(([key,val])=>{if(val!==''&&val!==null&&val!==undefined)p.set(key,val);});
    return path+(p.size?`?${p}`:'');
  }
  const help = key => `<details class="term-help"><summary aria-label="Información sobre ${esc(key)}">ⓘ</summary><div><p>${esc(C.glossary[key])}</p><a href="${href('como-leer.html')}#${key}">Ver más</a></div></details>`;
  function nav(){document.querySelectorAll('.nav a[data-target]').forEach(a=>a.href=href(a.dataset.target));}
  function showBanner(){
    if(!banner||!T.metadata?.demo_records)return;
    const dismissed=typeof sessionStorage!=='undefined'&&sessionStorage.getItem('okr-demo-dismissed')==='1';
    banner.innerHTML=dismissed?'':`<div class="demo-notice" role="note"><span class="demo-square" aria-hidden="true"></span><p><strong>Versión de demostración:</strong> los reportes de seguimiento son ficticios y no representan avances oficiales de Corfo.</p><button type="button" id="dismiss-demo">Entendido</button></div>`;
    document.getElementById('dismiss-demo')?.addEventListener('click',()=>{if(typeof sessionStorage!=='undefined')sessionStorage.setItem('okr-demo-dismissed','1');banner.innerHTML='';});
  }
  function activeChips(f){
    const chips=[];
    if(f.period!=='todos')chips.push(['periodo',periodLabel(f.period)]);
    if(f.objective)chips.push(['objetivo',f.objective.replace(/^Objetivo\s+(\d+):.*/,'Objetivo $1')]);
    if(f.owner)chips.push(['owner',f.owner==='__vacio__'?'Owner no informado':f.owner]);
    return `<div class="active-filters"><span>Filtros activos:</span>${chips.length?chips.map(([k,v])=>`<button type="button" data-clear="${k}" aria-label="Quitar filtro ${esc(v)}">${esc(v)} <span aria-hidden="true">×</span></button>`).join(''):'<span class="muted">Ninguno</span>'}</div>`;
  }
  function controls(f){return `<section class="filterbar" aria-label="Filtros de la estrategia"><div class="filters">
    <div class="field"><label for="filter-period">Periodo</label><select id="filter-period">${opt('todos','Todos los periodos',f.period)}${periods().map(p=>opt(p,periodLabel(p),f.period)).join('')}</select></div>
    <div class="field"><label for="filter-objective">Objetivo Estratégico</label><select id="filter-objective">${opt('','Todos los objetivos',f.objective)}${S.objectives.map(o=>opt(o.name,o.name,f.objective)).join('')}</select></div>
    <div class="field"><label for="filter-owner">Owner</label><select id="filter-owner">${opt('','Todos los Owners',f.owner)}${unique(S.krs.map(k=>k.owner)).sort((a,b)=>a.localeCompare(b,'es')).map(o=>opt(o,o,f.owner)).join('')}${opt('__vacio__','Sin Owner informado',f.owner)}</select></div>
    <button class="button" type="button" id="clear-filters">Limpiar filtros</button></div>${activeChips(f)}</section>`;}
  function hero(title,description,f,count){
    const print=page==='panel'?'<button type="button" class="button print-button" id="print-panel">Imprimir o guardar PDF</button>':'';
    return `<section class="hero"><div><span class="eyebrow">ESTRATEGIA CORPORATIVA 2026 A 2030</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div><div class="hero-side"><div class="hero-number"><strong>${count}</strong><span>Resultados Clave mostrados</span></div>${print}</div></section>${controls(f)}<p class="print-meta">${esc(periodLabel(f.period))} · Generado el ${new Intl.DateTimeFormat('es-CL',{timeZone:'America/Santiago'}).format(new Date())}</p>`;
  }
  function progressBar(progress,status,cdc){
    if(progress===null||progress===undefined)return '';
    const threshold=cdc?100:80,width=Math.max(0,Math.min(100,Number(progress)));
    return `<div class="progress ${statusClass(status)}" style="--threshold:${threshold}%" role="img" aria-label="Progreso ${esc(percent(progress))}; umbral de referencia ${threshold}%"><span style="width:${width}%"></span></div>`;
  }
  function metricPath(r){
    if(!r||[r.baseline,r.current,r.target].some(v=>v===null||v===undefined))return '<span class="muted">Sin variables numéricas informadas</span>';
    return `<span class="metric-path">Línea base <strong>${number(r.baseline)}</strong><span aria-hidden="true">→</span> Valor actual <strong>${number(r.current)}</strong><span aria-hidden="true">→</span> Meta <strong>${number(r.target)}</strong></span>`;
  }
  function statusStack(s){
    const n=s.total||1,none=s.total-statusTotal(s);
    const labels=`En cumplimiento ${s.statuses['On Track']}, alerta ${s.statuses['Off Track']}, riesgo ${s.statuses['At Risk']}, sin estatus ${none}`;
    return `<div class="status-stack" role="img" aria-label="${esc(labels)}"><span class="ok" style="width:${s.statuses['On Track']/n*100}%"></span><span class="warning" style="width:${s.statuses['Off Track']/n*100}%"></span><span class="risk" style="width:${s.statuses['At Risk']/n*100}%"></span><span class="none" style="width:${none/n*100}%"></span></div>`;
  }
  function ring(s){
    const n=s.total||1,a=s.statuses['On Track']/n*100,b=(s.statuses['On Track']+s.statuses['Off Track'])/n*100,c=statusTotal(s)/n*100;
    return `<div class="ring" style="background:conic-gradient(var(--status-ok) 0 ${a}%, var(--status-warn) ${a}% ${b}%, var(--status-risk) ${b}% ${c}%, var(--line) ${c}% 100%)" role="img" aria-label="${esc(`En cumplimiento ${s.statuses['On Track']}, alerta ${s.statuses['Off Track']}, riesgo ${s.statuses['At Risk']}, sin estatus ${s.total-statusTotal(s)}`)}"><div><strong>${s.total}</strong><span>KR</span></div></div>`;
  }
  function objectiveCard(o,f,krs){
    const members=krs.filter(k=>k.objective===o.name),s=M.summarize(members,T.records,f.period);
    const avg=s.progressCount>=C.minProgressSample?percent(s.progressMean):'Muestra insuficiente';
    return `<a class="objective-card" href="${esc(href('estrategia.html',{eje:o.name}))}"><div class="objective-card-head"><span class="objective-number">${code(o.number)}</span><div><small>${esc(o.dimension)}</small><h3>${esc(objectiveName(o))}</h3></div></div>${statusStack(s)}<div class="objective-card-foot"><span>${s.total} KR del periodo</span><span>${s.statuses['At Risk']} en riesgo</span></div><small>Progreso numérico: ${avg}</small></a>`;
  }
  function cycle(){const c=C.cycle;return `<section class="cycle-section"><div class="section-heading"><h2>Ciclo trimestral · ${periodLabel(c.period)} ${help('ciclo')}</h2><span class="cycle-now">Etapa simulada · semana ${c.week} de 13</span></div><ol class="cycle-steps">${c.steps.map(step=>`<li class="${step.name===c.stage?'current':''}"><span class="cycle-marker" aria-hidden="true"></span><div><strong>${esc(step.name)}</strong><small>${esc(step.timing)}</small><em>${step.name===c.stage?'EN CURSO':'PRÓXIMO'}</em></div></li>`).join('')}</ol></section>`;}
  function summaryStat(label,count,total,kind){const share=total?`${Math.round(count/total*100)}% del total`:'Sin datos';return `<article class="stat ${kind}"><span>${kind==='total'?'':`<i aria-hidden="true">${kind==='ok'?'●':kind==='warning'?'▲':'■'}</i>`}${esc(label)}</span><strong>${count}</strong><small>${kind==='total'?`${total} KR en la selección`:share}</small></article>`;}
  function krCard(k,r){return `<article class="kr-card"><div class="kr-main"><div class="kr-code">${esc(k.id)} <span>${esc(periodLabel(k.target_period))}</span> ${demoLabel(r)}</div><h3><a href="${esc(href('detalle-kr.html',{kr:k.id}))}">${esc(krName(k))}</a></h3><p class="small">${esc(k.objective)} · ${esc(k.subobjective)}</p><p class="small"><strong>Owner:</strong> ${value(k.owner)} · <strong>Fecha meta:</strong> ${day(k.target_date)}</p>${r?.comment?`<p class="last-comment">${esc(r.comment)}</p>`:''}</div><div class="kr-snapshot"><div><small>Estatus (semáforo)</small>${statusBadge(r?.status)}</div><div><small>Progreso numérico (%)</small><strong>${r?percent(r.progress):'Sin reporte'}</strong>${progressBar(r?.progress,r?.status,k.cdc)}<small>${metricPath(r)}</small></div><div><small>Estado del hito</small>${badge(r?executionLabel(r.execution):'Sin reporte')}</div></div></article>`;}
  function panel(f,krs,s){
    const attention=s.rows.filter(({record:r})=>r&&(r.status==='Off Track'||r.status==='At Risk'||/^(s[ií]|yes)$/i.test(r.pending||'')));
    const progressText=s.progressCount>=C.minProgressSample?percent(s.progressMean):'Muestra insuficiente';
    app.innerHTML=hero('Panel general','Avance de la Estrategia Corporativa en el periodo seleccionado.',f,krs.length)+
      `<section class="stat-grid" aria-label="Indicadores principales">${summaryStat('Resultados Clave del periodo',s.total,s.total,'total')}${summaryStat('En cumplimiento',s.statuses['On Track'],s.total,'ok')}${summaryStat('Alerta de cumplimiento',s.statuses['Off Track'],s.total,'warning')}${summaryStat('Riesgo de cumplimiento',s.statuses['At Risk'],s.total,'risk')}</section>
      ${(f.period==='todos'||f.period===C.cycle.period)?cycle():''}
      <section class="objectives-section"><div class="section-heading"><div><h2>Estatus por Objetivo Estratégico</h2><p>Vista de los ocho semáforos. Cada tarjeta abre el objetivo en Estrategia.</p></div></div><div class="objectives-grid">${S.objectives.map(o=>objectiveCard(o,f,krs)).join('')}</div></section>
      <div class="two-columns panel-analysis"><section class="analysis-block"><h2>Estatus (semáforo) ${help('estatus')}</h2><p>Lectura experta del owner sobre el cumplimiento de cada KR.</p><div class="ring-wrap">${ring(s)}<ul class="ring-legend"><li><span class="legend-dot ok"></span>En cumplimiento <strong>${s.statuses['On Track']}</strong></li><li><span class="legend-dot warning"></span>Alerta de cumplimiento <strong>${s.statuses['Off Track']}</strong></li><li><span class="legend-dot risk"></span>Riesgo de cumplimiento <strong>${s.statuses['At Risk']}</strong></li><li><span class="legend-dot none"></span>Sin estatus <strong>${s.total-statusTotal(s)}</strong></li></ul></div></section>
      <section class="analysis-block"><h2>Progreso numérico promedio ${help('progreso')}</h2><strong class="big-number">${progressText}</strong><p>${s.progressCount} de ${s.total} KR con variables numéricas informadas. ${s.progressCount<C.minProgressSample?'Aún no hay suficientes KR cuantificables para un promedio representativo.':''}</p><h3>Estado del hito ${help('hito')}</h3><p>Sin reporte: ${s.noReport}. No iniciados: ${s.executions['No iniciado']}. En curso: ${s.executions['En proceso']}. Cumplidos: ${s.executions.Completado}.</p></section></div>
      <section class="analysis-block evolution"><h2>Evolución trimestral</h2><p>La comparación estará disponible desde el segundo trimestre de seguimiento con reportes comparables.</p></section>
      <section class="section-heading"><div><h2>Resultados Clave que requieren atención</h2><p>KR en alerta, riesgo o con pendientes registrados.</p></div><a href="${esc(href('key-results.html'))}">Ver todos los Resultados Clave</a></section>
      ${attention.length?`<div class="card-list">${attention.map(({kr,record})=>krCard(kr,record)).join('')}</div>`:'<div class="empty">No hay alertas ni pendientes reportados en esta selección.</div>'}`;
  }
  function sortRows(rows,field,dir){
    const allowed=['id','name','objective','subobjective','target_period','status','progress','execution'];
    if(!allowed.includes(field))field='id';
    const collator=new Intl.Collator('es',{numeric:true,sensitivity:'base'});
    return [...rows].sort((a,b)=>{
      const get=({kr,record})=>['status','progress','execution'].includes(field)?record?.[field]:kr[field];
      const x=get(a),y=get(b);
      if(x===null||x===undefined)return y===null||y===undefined?0:1;
      if(y===null||y===undefined)return -1;
      const comparison=field==='progress'?Number(x)-Number(y):collator.compare(String(x),String(y));
      return (dir==='desc'?-1:1)*comparison;
    });
  }
  function krTable(rows){
    const order=query().get('orden')||'id',dir=query().get('dir')==='desc'?'desc':'asc';
    const headers=[['id','Código'],['name','Resultado Clave'],['objective','Objetivo'],['subobjective','Subobjetivo'],['target_period','Periodo meta'],['status','Estatus'],['progress','Progreso'],['execution','Estado del hito']];
    return `<div class="table-wrap"><table class="kr-table"><thead><tr>${headers.map(([field,label])=>`<th scope="col" aria-sort="${order===field?(dir==='asc'?'ascending':'descending'):'none'}"><button type="button" data-sort="${field}">${label}</button></th>`).join('')}</tr></thead><tbody>${sortRows(rows,order,dir).map(({kr:k,record:r})=>`<tr><td><a href="${esc(href('detalle-kr.html',{kr:k.id}))}">${esc(k.id)}</a></td><td>${esc(krName(k))}<small>Owner: ${value(k.owner)}</small></td><td>${esc(k.objective)}</td><td>${esc(k.subobjective)}</td><td>${esc(periodLabel(k.target_period))}</td><td>${statusBadge(r?.status)}</td><td>${r?percent(r.progress):'Sin reporte'}</td><td>${badge(r?executionLabel(r.execution):'Sin reporte')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function keyResults(f,krs,s){
    const table=query().get('vista')!=='tarjetas';
    app.innerHTML=hero('Resultados Clave','Cada Resultado Clave con su último reporte del periodo.',f,krs.length)+
      `<div class="list-tools"><div class="field"><label for="kr-search">Buscar Resultado Clave</label><input id="kr-search" type="search" value="${esc(f.q)}" placeholder="Código o nombre del KR"></div><div class="view-switch" role="group" aria-label="Tipo de vista"><button type="button" data-view="tabla" aria-pressed="${table}">Tabla</button><button type="button" data-view="tarjetas" aria-pressed="${!table}">Tarjetas</button></div></div>
      <div class="section-heading"><h2>Resultados Clave</h2><p aria-live="polite">${krs.length} Resultados Clave encontrados. ${s.noReport} aún sin reporte en este periodo.</p></div>
      ${krs.length?(table?krTable(s.rows):`<div class="card-list">${s.rows.map(({kr,record})=>krCard(kr,record)).join('')}</div>`):'<div class="empty">No hay Resultados Clave para esta selección.</div>'}`;
    document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const p=query();p.set('vista',button.dataset.view);replaceQuery(p);}));
    document.querySelectorAll('[data-sort]').forEach(button=>button.addEventListener('click',()=>{const p=query(),field=button.dataset.sort,reverse=p.get('orden')===field&&p.get('dir')!=='desc';p.set('orden',field);p.set('dir',reverse?'desc':'asc');replaceQuery(p);}));
    bindSearch('kr-search');
  }
  function reportFacts(r){return `<dl class="facts report-facts">${[
    fact('Periodo de reporte',value(periodLabel(r.period))),fact('Fecha de reporte',day(r.date)),
    fact('Instancia',instanceLabel(r.instance)),fact('Momento del registro',momentLabel(r.moment)),
    fact('Estatus (semáforo)',statusBadge(r.status)),fact('Progreso numérico (%)',percent(r.progress)),
    fact('Estado del hito',executionLabel(r.execution)),fact('Línea base',number(r.baseline)),
    fact('Valor actual',number(r.current)),fact('Meta',number(r.target)),
    fact('Comentario cualitativo',value(r.comment)),fact('Evidencia / soporte',value(r.evidence)),
    fact('Aprendizaje',value(r.learning)),fact('¿Quedó pendiente?',value(r.pending)),
    fact('Tratamiento del pendiente',value(r.pending_treatment)),fact('Periodo de traspaso',value(r.transfer_period)),
  ].join('')}</dl>`;}
  function evolutionChart(records, kr, period) {
    const rows=records.filter(r=>period==='todos'||r.period===period);
    if(!rows.length)return `<section class="evolution-card" aria-labelledby="evolution-title"><h2 id="evolution-title">Evolución del Resultado Clave</h2><div class="chart-empty">Todavía no hay reportes para graficar en ${esc(periodLabel(period))}.</div></section>`;
    const measured=rows.filter(r=>r.progress!==null&&r.progress!==undefined&&Number.isFinite(Number(r.progress)));
    const numeric=measured.length>0;
    const points=numeric?measured:rows.filter(r=>['No iniciado','En proceso','Completado'].includes(r.execution));
    if(!points.length)return `<section class="evolution-card" aria-labelledby="evolution-title"><h2 id="evolution-title">Evolución del Resultado Clave</h2><div class="chart-empty">Los reportes aún no contienen progreso numérico ni estado del hito para graficar.</div></section>`;
    const width=Math.max(720,points.length*155),height=310,left=numeric?90:116,right=90,top=48,bottom=236;
    const x=i=>points.length===1?(left+width-right)/2:left+i*(width-left-right)/(points.length-1);
    const numbers=measured.map(r=>Number(r.progress));
    const min=numeric?Math.min(0,Math.floor(Math.min(...numbers)/25)*25):0;
    const max=numeric?Math.max(100,Math.ceil(Math.max(...numbers)/25)*25):2;
    const y=value=>bottom-(Number(value)-min)/(max-min)*(bottom-top);
    const rank={'No iniciado':0,'En proceso':1,'Completado':2};
    const axis=numeric?Array.from({length:5},(_,i)=>min+(max-min)*i/4):[0,1,2];
    const axisLabel=v=>numeric?`${number(v)}%`:['No iniciado','En curso','Cumplido'][v];
    const grid=axis.map(v=>`<line x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}" stroke="#dde1e9" stroke-width="1"/><text x="${left-13}" y="${y(v)+4}" text-anchor="end" fill="#555b6c" font-size="12">${esc(axisLabel(v))}</text>`).join('');
    const threshold=kr.cdc?100:80;
    const reference=numeric&&threshold>=min&&threshold<=max?
      `<line x1="${left}" y1="${y(threshold)}" x2="${width-right}" y2="${y(threshold)}" stroke="#D64045" stroke-width="2" stroke-dasharray="6 5"/><text x="${width-right}" y="${y(threshold)-7}" text-anchor="end" fill="#a82e38" font-size="11" font-weight="700">Referencia ${threshold}%</text>`:'';
    const coords=points.map((r,i)=>[x(i),y(numeric?r.progress:rank[r.execution])]);
    const path=coords.length>1?`<polyline points="${coords.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#221E7C" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`:'';
    const marks=points.map((r,i)=>{
      const [cx,cy]=coords[i],label=numeric?percent(r.progress):executionLabel(r.execution);
      const labelX=i===0?cx+14:cx,anchor=i===0?'start':'middle';
      return `<circle cx="${cx}" cy="${cy}" r="7" fill="#fff" stroke="#221E7C" stroke-width="3"><title>${esc(periodLabel(r.period))} · ${esc(instanceLabel(r.instance))} · ${day(r.date)} · ${esc(label)}</title></circle>
        <text x="${labelX}" y="${cy-14}" text-anchor="${anchor}" fill="#17183B" font-weight="700" font-size="12">${esc(label)}</text>
        <text x="${cx}" y="263" text-anchor="middle" fill="#17183B" font-size="12" font-weight="700">${esc(instanceLabel(r.instance))}</text>
        <text x="${cx}" y="282" text-anchor="middle" fill="#555b6c" font-size="11">${day(r.date)} · ${esc(periodLabel(r.period))}</text>`;
    }).join('');
    const description=points.map(r=>`${instanceLabel(r.instance)} ${day(r.date)}: ${numeric?percent(r.progress):executionLabel(r.execution)}`).join('; ');
    const title=numeric?'Progreso numérico por reporte':'Estado del hito por reporte';
    const note=numeric?
      `Los puntos corresponden a porcentajes informados, con una referencia de ${threshold}%. ${measured.length<rows.length?`${rows.length-measured.length} reporte(s) sin porcentaje se consultan en el historial.`:''}`:
      'Secuencia cualitativa del estado del hito; no representa un porcentaje de progreso.';
    return `<section class="evolution-card" aria-labelledby="evolution-title"><div class="section-heading"><div><h2 id="evolution-title">Evolución del Resultado Clave</h2><p>${title} · ${points.length} ${points.length===1?'observación':'observaciones'}</p></div></div>
      <div class="chart-scroll" tabindex="0" aria-label="Gráfico desplazable de evolución del KR"><svg class="evolution-chart" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${esc(title)}. ${esc(description)}">
        ${grid}${reference}${path}${marks}
      </svg></div><p class="chart-note">${esc(note)}</p></section>`;
  }
  function detail(f,krs){
    const requested=query().get('kr'),kr=requested?krs.find(k=>k.id===requested):krs[0];
    if(!kr){app.innerHTML=hero('Detalle de Resultado Clave','Seleccione un KR en Resultados Clave.',f,0);return;}
    const r=M.latest(T.records,kr.id,f.period);
    const log=T.records.filter(x=>x.id===kr.id).sort((a,b)=>M.periodSort(a.period,b.period)||(a.date||'').localeCompare(b.date||'')||a.source_row-b.source_row);
    const groups=unique(log.map(x=>x.period));
    app.innerHTML=hero('Detalle de Resultado Clave','Definición, avance y trayectoria del Resultado Clave.',f,krs.length)+
      `<a class="back-link" href="${esc(href('key-results.html'))}">← Volver a Resultados Clave</a>${evolutionChart(log,kr,f.period)}<div class="detail-grid"><section class="detail-main"><span class="kr-code">${esc(kr.id)} ${demoLabel(r)}</span><h2>${esc(krName(kr))}</h2><dl class="facts">${[
        fact('Objetivo Estratégico',value(kr.objective)),fact('Subobjetivo',value(kr.subobjective)),
        fact('Dimensión',value(kr.dimension)),fact('Enunciado del Objetivo Estratégico',value(kr.vision)),
        fact('Periodo meta',value(periodLabel(kr.target_period))),fact('Año KR',value(kr.target_year)),
        fact('Q',value(kr.quarter)),fact('Fecha meta',day(kr.target_date)),
        fact('Área que lidera',value(kr.area)),fact('Owner',value(kr.owner)),fact('Suplentes',value(kr.substitutes)),
        fact('Producto asociado estimado',value(kr.product)),fact('Medio de verificación estimado',value(kr.verification)),
        fact('Comentarios de estrategia',value(kr.comments)),
      ].join('')}</dl></section><section class="detail-report"><h2>Último reporte ${r?`<span class="report-moment">${momentLabel(r.moment)}</span>`:''}</h2>${r?`<div class="snapshot-grid"><div><small>Estatus (semáforo)</small>${statusBadge(r.status)}</div><div><small>Progreso numérico (%)</small><strong>${percent(r.progress)}</strong>${progressBar(r.progress,r.status,kr.cdc)}</div><div><small>Estado del hito</small>${badge(executionLabel(r.execution))}</div></div><p>${metricPath(r)}</p>${reportFacts(r)}`:'<p>Sin reporte en este periodo.</p>'}</section></div>
      <div class="section-heading"><div><h2>Historial del Resultado Clave</h2><p>${log.length} reportes, por trimestre e instancia.</p></div></div>
      ${log.length?`<div class="timeline">${groups.map(period=>`<section><h3>${esc(periodLabel(period))}</h3>${log.filter(x=>x.period===period).map(x=>`<article class="history-item"><div class="history-top"><strong>${instanceLabel(x.instance)} · ${day(x.date)}</strong><span>${momentLabel(x.moment)}</span></div><div class="inline-badges">${demoLabel(x)}${statusBadge(x.status)}${badge(executionLabel(x.execution))}<span>${percent(x.progress)}</span></div><p>${value(x.comment)}</p><details class="report-more"><summary>Ver todos los campos del reporte</summary>${reportFacts(x)}</details></article>`).join('')}</section>`).join('')}</div>`:'<div class="empty">Sin reportes históricos.</div>'}`;
  }
  function historyPage(f){
    const krs=M.visibleKrs(S.krs,T.records,f),byId=new Map(S.krs.map(k=>[k.id,k]));
    const kr=query().get('hist_kr')||'',execution=query().get('hist_estado')||'',status=query().get('hist_estatus')||'';
    const rows=T.records.filter(r=>{const k=byId.get(r.id);return k&&krs.includes(k)&&(f.period==='todos'||r.period===f.period)&&(!kr||r.id===kr)&&(!execution||r.execution===execution)&&(!status||r.status===status);}).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.source_row-a.source_row);
    app.innerHTML=hero('Histórico','Todos los reportes registrados en las instancias de seguimiento.',f,krs.length)+
      `<div class="history-filters"><div class="field"><label for="hist-search">Buscar Resultado Clave</label><input id="hist-search" type="search" value="${esc(f.q)}" placeholder="Código o nombre"></div><div class="field"><label for="hist-kr">KR</label><select id="hist-kr">${opt('','Todos los KR',kr)}${krs.map(k=>opt(k.id,`${k.id}: ${krName(k)}`,kr)).join('')}</select></div><div class="field"><label for="hist-execution">Estado del hito</label><select id="hist-execution">${opt('','Todos',execution)}${['No iniciado','En proceso','Completado'].map(v=>opt(v,executionLabel(v),execution)).join('')}</select></div><div class="field"><label for="hist-status">Estatus</label><select id="hist-status">${opt('','Todos',status)}${Object.keys(C.status).map(v=>opt(v,statusLabel(v),status)).join('')}</select></div></div>
      <div class="section-heading"><h2>Registros de seguimiento</h2><p aria-live="polite">${rows.length} reportes encontrados.</p></div>
      ${rows.length?`<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Periodo</th><th>KR y objetivo</th><th>Owner</th><th>Instancia / Momento</th><th>Estatus</th><th>Progreso</th><th>Estado del hito</th><th>Comentario</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${day(r.date)} ${demoLabel(r)}</td><td>${esc(periodLabel(r.period))}</td><td><a href="${esc(href('detalle-kr.html',{kr:r.id}))}">${esc(r.id)}</a><small>${esc(byId.get(r.id).objective)}</small></td><td>${value(byId.get(r.id).owner)}</td><td>${instanceLabel(r.instance)}<small>${momentLabel(r.moment)}</small></td><td>${statusBadge(r.status)}</td><td>${percent(r.progress)}</td><td>${badge(executionLabel(r.execution))}</td><td>${value(r.comment)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No hay registros para esta selección.</div>'}`;
    [['hist-kr','hist_kr'],['hist-execution','hist_estado'],['hist-status','hist_estatus']].forEach(([id,key])=>document.getElementById(id)?.addEventListener('change',e=>{const p=query();if(e.target.value)p.set(key,e.target.value);else p.delete(key);replaceQuery(p);}));
    bindSearch('hist-search');
  }
  function strategyNode(o,selected){return `<button type="button" class="strategy-node ${o.name===selected?'selected':''}" data-objective="${esc(o.name)}" aria-pressed="${o.name===selected}" aria-controls="strategy-detail"><span class="objective-number">${code(o.number)}</span><strong>${esc(objectiveName(o))}</strong></button>`;}
  function strategyPage(f,krs){
    const byDimension=dim=>S.objectives.filter(o=>o.dimension===dim);
    const selected=S.objectives.find(o=>o.name===query().get('eje')&&(!f.objective||o.name===f.objective))||S.objectives.find(o=>o.name===f.objective)||S.objectives[0];
    const all=S.krs.filter(k=>k.objective===selected.name),visible=krs.filter(k=>k.objective===selected.name),s=M.summarize(visible,T.records,f.period);
    const tree=selected.subobjectives.map(so=>{
      const members=visible.filter(k=>k.subobjective===so),summary=M.summarize(members,T.records,f.period);
      return `<details class="subobjective" ${members.length?'open':''}><summary><span>${esc(so)}</span><strong>${members.length} KR</strong></summary>${statusStack(summary)}<ul>${members.map(k=>{const r=M.latest(T.records,k.id,f.period);return `<li><a href="${esc(href('detalle-kr.html',{kr:k.id}))}">${esc(k.id)} · ${esc(krName(k))}</a><small>${esc(periodLabel(k.target_period))} · Owner: ${value(k.owner)}</small><span>${statusBadge(r?.status)} ${r?percent(r.progress):'Sin reporte'}</span>${progressBar(r?.progress,r?.status,k.cdc)}</li>`;}).join('')||'<li>Sin KR en esta selección.</li>'}</ul></details>`;
    }).join('');
    app.innerHTML=hero('Estrategia','Seleccione un objetivo para ver su definición, subobjetivos y Resultados Clave.',f,krs.length)+
      `<section class="strategy-layout" aria-label="Esquema de la Estrategia Corfo 2026 a 2030"><div class="impact-layer"><div class="layer-name">Impacto</div><div class="impact-axes">+Productividad <span>+Inversión</span> +Crecimiento</div>${byDimension('Impacto').map(o=>strategyNode(o,selected.name)).join('')}</div><div class="mountain-band" aria-hidden="true"></div><div class="strategy-core"><div class="strategy-group impulse"><h2>Impulso Corfo</h2><div class="strategy-nodes">${byDimension('Impulso Corfo').map(o=>strategyNode(o,selected.name)).join('')}</div></div><div class="strategy-group role"><h2>Rol de Corfo</h2><div class="strategy-nodes">${byDimension('Rol de Corfo').map(o=>strategyNode(o,selected.name)).join('')}</div></div></div><div class="strategy-group enablers"><h2>Habilitantes</h2><div class="strategy-nodes">${byDimension('Habilitantes').map(o=>strategyNode(o,selected.name)).join('')}</div></div></section>
      <section class="objective-detail" id="strategy-detail" tabindex="-1"><div class="objective-head"><span class="objective-number">${code(selected.number)}</span><div><small>${esc(selected.dimension)}</small><h2>${esc(objectiveName(selected))}</h2></div><strong>${all.length} Resultados Clave en total</strong></div><div class="objective-copy"><h3>Objetivo Estratégico ${help('objetivo')}</h3><p>${esc(selected.vision)}</p>${notes[selected.name]?`<h3>Justificación</h3><p>${esc(notes[selected.name])}</p>`:''}</div><div class="objective-follow"><h3>Seguimiento del periodo</h3><p><strong>${visible.length}</strong> KR en ${esc(periodLabel(f.period))}. <strong>${s.noReport}</strong> sin reporte.</p>${statusStack(s)}<p>${s.statuses['On Track']} en cumplimiento, ${s.statuses['Off Track']} en alerta, ${s.statuses['At Risk']} en riesgo.</p><p>Progreso numérico: ${s.progressCount>=C.minProgressSample?percent(s.progressMean):'Muestra insuficiente'} (${s.progressCount} de ${visible.length} KR con variables numéricas).</p></div><h3>Resultados Clave por subobjetivo</h3><div class="subobjective-tree">${tree}</div></section>`;
    document.querySelectorAll('[data-objective]').forEach(button=>button.addEventListener('click',()=>{const p=query();p.set('eje',button.dataset.objective);if(f.objective)p.set('objetivo',button.dataset.objective);replaceQuery(p);document.getElementById('strategy-detail')?.focus({preventScroll:true});}));
  }
  function replaceQuery(p){history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));render();}
  function bindSearch(id){const field=document.getElementById(id);if(!field)return;let timer;field.addEventListener('input',()=>{clearTimeout(timer);const current=field.value;timer=setTimeout(()=>{const p=query();if(current)p.set('q',current);else p.delete('q');replaceQuery(p);document.getElementById(id)?.focus();},200);});}
  function bind(){
    const change=()=>{const p=query();for(const [id,key] of [['filter-period','periodo'],['filter-objective','objetivo'],['filter-owner','owner']]){const v=document.getElementById(id)?.value||'';if(v&&(key!=='periodo'||v!=='todos'))p.set(key,v);else p.delete(key);}p.delete('eje');p.delete('hist_kr');replaceQuery(p);};
    ['filter-period','filter-objective','filter-owner'].forEach(id=>document.getElementById(id)?.addEventListener('change',change));
    document.querySelectorAll('[data-clear]').forEach(button=>button.addEventListener('click',()=>{const p=query();p.delete(button.dataset.clear);replaceQuery(p);}));
    document.getElementById('clear-filters')?.addEventListener('click',()=>{const p=query();['periodo','objetivo','owner','q','eje','hist_kr','hist_estado','hist_estatus'].forEach(key=>p.delete(key));replaceQuery(p);});
    document.getElementById('print-panel')?.addEventListener('click',()=>window.print());
  }
  function render(){
    nav();showBanner();if(page==='guide')return;
    const f=filters(),krs=M.visibleKrs(S.krs,T.records,f),s=M.summarize(krs,T.records,f.period);
    if(page==='panel')panel(f,krs,s);else if(page==='strategy')strategyPage(f,krs);else if(page==='krs')keyResults(f,krs,s);else if(page==='detail')detail(f,krs);else if(page==='history')historyPage(f);
    bind();nav();
  }
  document.getElementById('nav-toggle')?.addEventListener('click',e=>{const expanded=e.currentTarget.getAttribute('aria-expanded')==='true';e.currentTarget.setAttribute('aria-expanded',String(!expanded));document.getElementById('main-nav')?.classList.toggle('open',!expanded);});
  const folder=publicSite?'public/':'';
  const load=async(file,optional=false)=>{const r=await fetch(`./data/${file}`,{cache:'no-store'});if(!r.ok){if(optional)return {};throw new Error(`Falta ${file} (${r.status})`);}return r.json();};
  Promise.all([load(`${folder}strategy.json`),load(`${folder}tracking.json`),load(`${folder}objective-notes.json`,true)])
    .then(([strategy,tracking,descriptions])=>{S=strategy;T=tracking;notes=descriptions;if(!Array.isArray(S.krs)||!Array.isArray(S.objectives)||!Array.isArray(T.records))throw new Error('JSON sin la estructura esperada');if(publicSite&&(S.metadata?.publication!=='public'||T.metadata?.publication!=='public'))throw new Error('La versión pública requiere JSON publicados');if(T.metadata?.demo_records)document.title=`DEMO | ${document.title}`;render();})
    .catch(error=>{app.innerHTML='<section class="empty"><h1>Datos no disponibles</h1><p>No se pudieron cargar los datos. Actualice la página.</p></section>';console.warn('Datos no disponibles:',error.message);});
})();
