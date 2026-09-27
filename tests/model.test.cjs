const assert = require('node:assert/strict');
const M = require('../assets/okr-model.js');

const kr = {id:'KR-001',objective:'Objetivo 1: Impacto',owner:'Gerencia A',periods:['2026/Q3','2026/Q4']};
const records = [
  {id:'KR-001',period:'2026/Q3',date:'2026-09-30',moment:'Propuesta Owner',execution:'Completado',progress:90,status:'Off Track',source_row:2},
  {id:'KR-001',period:'2026/Q3',date:'2026-08-15',moment:'Confirmado GE',execution:'En proceso',progress:10,status:'At Risk',source_row:3},
  {id:'KR-001',period:'2026/Q4',date:'2026-10-15',moment:'Propuesta Owner',execution:'No iniciado',progress:null,status:'On Track',source_row:4},
];

assert.equal(M.latest(records,kr.id,'2026/Q3').source_row,3,'GE prevalece sobre una propuesta posterior dentro del Q');
assert.equal(M.latest(records,kr.id,'todos').source_row,4,'todos los periodos muestra primero el Q más reciente');
assert.equal(M.latest(records,kr.id,'2027/Q1'),null,'un Q sin reporte conserva la ausencia de información');
assert.deepEqual(M.visibleKrs([kr],records,{period:'2026/Q3',objective:kr.objective,owner:kr.owner}),[kr]);
assert.deepEqual(M.visibleKrs([kr],records,{period:'2026/Q3',objective:kr.objective,owner:'Otra persona'}),[]);
const summary=M.summarize([kr],records,'2026/Q3');
assert.equal(summary.executions['En proceso'],1);
assert.equal(summary.statuses['At Risk'],1);
assert.equal(summary.progressMean,10,'el semáforo no se deriva del progreso');
assert.equal(summary.rows.length,1,'la vista actual toma una observación, sin borrar el histórico');
console.log('Modelo OKR: selección, filtros y variables independientes correctos.');
