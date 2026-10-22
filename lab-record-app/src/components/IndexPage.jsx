import React from 'react';

const PAGE_1_MAX = 7;
const PAGE_N_MAX = 8;

export function getIndexPages(experiments = []) {
  if (experiments.length <= PAGE_1_MAX) {
    return [experiments];
  }
  const pages = [experiments.slice(0, PAGE_1_MAX)];
  let rem = experiments.slice(PAGE_1_MAX);
  while (rem.length > 0) {
    pages.push(rem.slice(0, PAGE_N_MAX));
    rem = rem.slice(PAGE_N_MAX);
  }
  return pages;
}

export const DEFAULT_INDEX_COLUMNS = [
  { id: 'sno', label: 'S.No.', urdu: 'سیریل نمبر', width: '8%', align: 'center', isDefault: true },
  { id: 'title', label: 'Program Name', urdu: 'پروگرام کا نام', width: 'auto', align: 'left', isDefault: true },
  { id: 'page', label: 'Page No.', urdu: 'صفحہ نمبر', width: '10%', align: 'center', isDefault: true },
  { id: 'remarks', label: 'Remarks', urdu: 'ریمارکس', width: '14%', align: 'center', isDefault: true }
];

export default function IndexPage({
  experiments,
  onExperimentClick,
  expStartPages,
  columns = DEFAULT_INDEX_COLUMNS
}) {
  // Put maximum questions on Page 1 (up to 7), and remaining questions on next page(s)
  const pages = getIndexPages(experiments || []);
  const activeColumns = columns && columns.length > 0 ? columns : DEFAULT_INDEX_COLUMNS;

  return (
    <>
      {pages.map((pageExperiments, pageIdx) => {
        return (
          <div
            className="a4-page index-page"
            id={`page-index-${pageIdx + 1}`}
            key={pageIdx}
          >
            <div className="academic-border">
              {/* Title - identical on both pages (no '(Continued)') */}
              <div className="index-title">
                <span>INDEX</span>
                <span>/</span>
                <span className="urdu-text">انڈیکس</span>
              </div>

              {/* Subtitle */}
              <div className="index-subtitle">
                <span>LAB PRACTICE RECORD</span>
                <span>/</span>
                <span className="urdu-text">ریکارڈ عملی لیب</span>
              </div>

              {/* Dynamic Academic Index Table */}
              <table className="index-table">
                <thead>
                  <tr>
                    {activeColumns.map(col => (
                      <th
                        key={col.id}
                        style={{
                          width: col.width || 'auto',
                          textAlign: col.align || 'center'
                        }}
                      >
                        <span>{col.label}</span>
                        {col.urdu ? <span className="th-urdu">{col.urdu}</span> : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageExperiments.map((exp, idx) => (
                    <tr
                      key={exp.id || idx}
                      style={{ cursor: onExperimentClick ? 'pointer' : 'default' }}
                      onClick={() => onExperimentClick && onExperimentClick(exp.id)}
                    >
                      {activeColumns.map(col => {
                        if (col.id === 'sno') {
                          return (
                            <td key={col.id} className="center" style={{ fontWeight: 'bold' }}>
                              {exp.id}
                            </td>
                          );
                        }
                        if (col.id === 'title') {
                          return (
                            <td key={col.id}>
                              <div className="index-program-title">{exp.title}</div>
                              {exp.description && (
                                <div className="index-program-desc">{exp.description}</div>
                              )}
                            </td>
                          );
                        }
                        if (col.id === 'page') {
                          return (
                            <td key={col.id} className="center" style={{ fontWeight: '600' }}>
                              {expStartPages && expStartPages[exp.id] !== undefined
                                ? expStartPages[exp.id]
                                : exp.page}
                            </td>
                          );
                        }
                        if (col.id === 'remarks') {
                          return (
                            <td
                              key={col.id}
                              className="center"
                              style={{ fontSize: '8.5pt', color: '#15803d', fontWeight: '500' }}
                            >
                              {exp.remarks || 'Completed'}
                            </td>
                          );
                        }
                        // Custom Column
                        const cellVal = exp.customData?.[col.id] ?? exp[col.id] ?? col.defaultValue ?? '-';
                        return (
                          <td
                            key={col.id}
                            className={col.align === 'center' ? 'center' : ''}
                            style={{ fontSize: '8.5pt', color: '#1e293b' }}
                          >
                            {cellVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Page indicator at bottom */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '8pt', color: '#64748b', paddingTop: '4mm' }}>
                <span>Department of Computer Science & Information Technology • MANUU</span>
                <span>Index Page {pageIdx + 1} of {pages.length}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
