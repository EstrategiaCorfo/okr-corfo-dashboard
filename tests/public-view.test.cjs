const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/okr-corfo.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'assets/okr-config.js'), 'utf8');
const strategy = require('../data/public/strategy.json');
const tracking = require('../data/public/tracking.json');
const notes = require('../data/public/objective-notes.json');

async function render(page, search = '') {
  const app = {
    innerHTML: '',
    insertAdjacentHTML(position, html) {
      assert.equal(position, 'afterbegin');
      this.innerHTML = html + this.innerHTML;
    },
  };
  const banner = {innerHTML: ''};
  const document = {
    body: {dataset: {page}}, title: 'OKR Corfo',
    querySelectorAll: () => [],
    getElementById: id => id === 'app' ? app : id === 'demo-banner' ? banner : {addEventListener() {}, disabled: false, value: ''},
  };
  const context = {
    window: {OKRModel: require('../assets/okr-model.js')}, document,
    location: {hostname: 'example.org', pathname: `/${page}.html`, search},
    history: {replaceState() {}}, URLSearchParams, Intl, Date, console,
    sessionStorage: {getItem() {return null;}, setItem() {}},
    fetch: async file => ({ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))}),
  };
  vm.runInNewContext(config, context);
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return {html: app.innerHTML, banner: banner.innerHTML};
}

(async () => {
  assert.equal(strategy.krs.length, 161);
  assert.equal(tracking.records.length, 51);
  assert.equal(Object.keys(notes).length, 8);
  assert.equal(tracking.records.filter(r => r.demo).length, 51);
  const panel = await render('panel');
  assert.match(panel.banner, /Versión de demostración/);
  assert.match(panel.html, /<strong>161<\/strong><span>Resultados Clave mostrados/);
  assert.match(panel.html, /Ciclo trimestral · Q3 2026/);
  assert.match(panel.html, /Etapa simulada · semana 1 de 13/);
  assert.equal((panel.html.match(/class="objective-card"/g) || []).length, 8);
  assert.doesNotMatch(panel.html, /Dato no publicado|<select id="filter-owner" disabled/);

  const all = (await render('krs')).html;
  assert.equal((all.match(/<tr>/g) || []).length, 162);
  const cards = (await render('krs','?vista=tarjetas')).html;
  assert.equal((cards.match(/class="kr-card"/g) || []).length, 161);
  const owner = strategy.krs.find(k => k.owner)?.owner;
  const filtered = (await render('krs', `?owner=${encodeURIComponent(owner)}`)).html;
  assert.equal((filtered.match(/<tr>/g) || []).length,
    strategy.krs.filter(k => k.owner === owner).length + 1);

  const id = tracking.records[0].id;
  const detail = (await render('detail', `?kr=${id}`)).html;
  for (const label of ['Owner', 'Suplentes', 'Medio de verificación estimado',
    'Comentarios de estrategia', 'Evidencia / soporte', 'Aprendizaje',
    'Tratamiento del pendiente', 'Periodo de traspaso']) {
    assert.ok(detail.includes(`<dt>${label}</dt>`), label);
  }
  assert.match(detail, /Ver todos los campos del reporte/);
  const history = (await render('history')).html;
  assert.equal((history.match(/<tr>/g) || []).length, 52);
  assert.match(history, /<th>Owner<\/th>/);
  assert.match(history, /<th>Comentario<\/th>/);
  const strategyPage = (await render('strategy')).html;
  assert.ok(strategyPage.includes(notes[strategy.objectives[0].name].slice(0, 40)));
  console.log('Vista pública: 161 KR, 51 reportes DEMO, filtro Owner y campos de detalle visibles.');
})().catch(error => { console.error(error); process.exitCode = 1; });
