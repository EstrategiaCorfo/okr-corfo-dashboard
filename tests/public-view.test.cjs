const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/okr-corfo.js'), 'utf8');
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
  const document = {
    body: {dataset: {page}}, title: 'OKR Corfo',
    querySelectorAll: () => [],
    getElementById: id => id === 'app' ? app : {addEventListener() {}, disabled: false, value: ''},
  };
  const context = {
    window: {OKRModel: require('../assets/okr-model.js')}, document,
    location: {hostname: 'example.org', pathname: `/${page}.html`, search},
    history: {replaceState() {}}, URLSearchParams, Intl, Date, console,
    fetch: async file => ({ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))}),
  };
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return app.innerHTML;
}

(async () => {
  assert.equal(strategy.krs.length, 161);
  assert.equal(tracking.records.length, 51);
  assert.equal(Object.keys(notes).length, 8);
  assert.equal(tracking.records.filter(r => r.demo).length, 51);
  const panel = await render('panel');
  assert.match(panel, /VERSIÓN DEMO/);
  assert.match(panel, /<strong>161<\/strong><span>KR en el filtro/);
  assert.doesNotMatch(panel, /Dato no publicado|<select id="filter-owner" disabled/);

  const all = await render('krs');
  assert.equal((all.match(/class="card kr-card"/g) || []).length, 161);
  const owner = strategy.krs.find(k => k.owner)?.owner;
  const filtered = await render('krs', `?owner=${encodeURIComponent(owner)}`);
  assert.equal((filtered.match(/class="card kr-card"/g) || []).length,
    strategy.krs.filter(k => k.owner === owner).length);

  const id = tracking.records[0].id;
  const detail = await render('detail', `?kr=${id}`);
  for (const label of ['Owner', 'Suplentes', 'Medio de verificación estimado',
    'Comentarios de estrategia', 'Evidencia / soporte', 'Aprendizaje',
    'Tratamiento del pendiente', 'Periodo de traspaso']) {
    assert.ok(detail.includes(`<dt>${label}</dt>`), label);
  }
  assert.match(detail, /Ver todos los campos del reporte/);
  const history = await render('history');
  assert.equal((history.match(/<tr>/g) || []).length, 52);
  assert.match(history, /<th>Owner<\/th>/);
  assert.match(history, /<th>Comentario<\/th>/);
  const strategyPage = await render('strategy');
  assert.ok(strategyPage.includes(notes[strategy.objectives[0].name].slice(0, 40)));
  console.log('Vista pública: 161 KR, 51 reportes DEMO, filtro Owner y campos de detalle visibles.');
})().catch(error => { console.error(error); process.exitCode = 1; });
