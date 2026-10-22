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

export default function IndexPage({ experiments, onExperimentClick, expStartPages }) {
  // Put maximum questions on Page 1 (up to 7), and remaining questions on next page(s)
  const pages = getIndexPages(experiments || []);

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

              {/* Formal Academic Index Table (No Date column) */}
              <table className="index-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>
                      <span>S.No.</span>
                      <span className="th-urdu">سیریل نمبر</span>
                    </th>
                    <th style={{ width: '68%' }}>
                      <span>Program Name</span>
                      <span className="th-urdu">پروگرام کا نام</span>
                    </th>
                    <th style={{ width: '10%' }}>
                      <span>Page No.</span>
                      <span className="th-urdu">صفحہ نمبر</span>
                    </th>
                    <th style={{ width: '14%' }}>
                      <span>Remarks</span>
                      <span className="th-urdu">ریمارکس</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageExperiments.map((exp, idx) => (
                    <tr
                      key={exp.id || idx}
                      style={{ cursor: onExperimentClick ? 'pointer' : 'default' }}
                      onClick={() => onExperimentClick && onExperimentClick(exp.id)}
                    >
                      <td className="center" style={{ fontWeight: 'bold' }}>
                        {exp.id}
                      </td>
                      <td>
                        <div className="index-program-title">{exp.title}</div>
                        <div className="index-program-desc">{exp.description}</div>
                      </td>
                      <td className="center" style={{ fontWeight: '600' }}>
                        {expStartPages && expStartPages[exp.id] !== undefined ? expStartPages[exp.id] : exp.page}
                      </td>
                      <td className="center" style={{ fontSize: '8.5pt', color: '#15803d', fontWeight: '500' }}>
                        Completed
                      </td>
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
