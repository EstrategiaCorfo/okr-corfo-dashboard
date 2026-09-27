(function (root, factory) {
  const model = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  root.OKRModel = model;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function periodSort(a, b) {
    const parse = value => {
      const match = /^(20\d{2})\/Q([1-4])$/.exec(value || '');
      return match ? Number(match[1]) * 4 + Number(match[2]) : -1;
    };
    return parse(a) - parse(b);
  }
  function latest(records, id, period) {
    return records.filter(row => row.id === id && (period === 'todos' || row.period === period))
      .sort((a, b) => {
        const priority = row => row.moment === 'Confirmado GE' ? 2 : row.moment === 'Propuesta Owner' ? 1 : 0;
        return (period === 'todos' ? periodSort(b.period, a.period) : 0) ||
          priority(b) - priority(a) || (b.date || '').localeCompare(a.date || '') || (b.source_row || 0) - (a.source_row || 0);
      })[0] || null;
  }
  function visibleKrs(krs, records, filters) {
    return krs.filter(kr =>
      (!filters.objective || kr.objective === filters.objective) &&
      (!filters.owner || (filters.owner === '__vacio__' ? !kr.owner : kr.owner === filters.owner)) &&
      (filters.period === 'todos' || (kr.periods || []).includes(filters.period) ||
        records.some(row => row.id === kr.id && row.period === filters.period)));
  }
  function summarize(krs, records, period) {
    const rows = krs.map(kr => ({kr, record: latest(records, kr.id, period)}));
    const executions = {'No iniciado': 0, 'En proceso': 0, 'Completado': 0};
    const statuses = {'On Track': 0, 'Off Track': 0, 'At Risk': 0};
    const progress = [];
    rows.forEach(({record}) => {
      if (record?.execution in executions) executions[record.execution]++;
      if (record?.status in statuses) statuses[record.status]++;
      if (record?.progress !== null && record?.progress !== undefined && Number.isFinite(Number(record.progress))) progress.push(Number(record.progress));
    });
    return {rows, total: rows.length, executions, statuses,
      noReport: rows.filter(({record}) => !record).length,
      noExecution: rows.filter(({record}) => record && !record.execution).length,
      noStatus: rows.filter(({record}) => record && !record.status).length,
      progressCount: progress.length,
      progressMean: progress.length ? progress.reduce((a, b) => a + b, 0) / progress.length : null};
  }
  return {periodSort, latest, visibleKrs, summarize};
});
