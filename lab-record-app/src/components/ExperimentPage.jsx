import React from 'react';

export default function ExperimentPage({ exp, data }) {
  // Separate top-level markdown introduction/aim from the rest of the cells
  const aimCell = exp.cells.find(c => c.type === 'markdown');
  const workingCells = exp.cells.filter(c => c !== aimCell);

  return (
    <div className="a4-page exp-page" id={`page-exp-${exp.id}`}>
      <div className="academic-border" style={{ padding: '8mm 10mm', height: 'auto', minHeight: '100%' }}>
        {/* Experiment Top Header */}
        <div className="exp-header">
          <div>
            <div className="exp-num-title">
              Experiment {exp.id}: {exp.shortTitle || exp.title}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#64748b', marginTop: '2px' }}>
              Course: {data.labTitle} ({data.courseCode})
            </div>
          </div>
          <div className="exp-meta">
            <div><strong>Page:</strong> {exp.page}</div>
          </div>
        </div>

        {/* Aim / Problem Statement */}
        <div className="exp-section-title">
          <span>Objective & Problem Statement</span>
        </div>
        <div className="exp-aim-box">
          {aimCell ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {aimCell.source.replace(/^#+\s*/gm, '')}
            </div>
          ) : (
            <div>{exp.description}</div>
          )}
        </div>

        {/* Sequential Steps (Code + Outputs) */}
        <div className="exp-steps-container">
          {workingCells.map((cell, idx) => {
            if (cell.type === 'markdown') {
              const text = cell.source.trim().replace(/^#+\s*/gm, '');
              if (!text) return null;
              return (
                <div key={idx} className="exp-cell-block exp-step-heading">
                  {text}
                </div>
              );
            }

            if (cell.type === 'code') {
              const code = cell.source.trim();
              if (!code && cell.outputs.length === 0) return null;

              return (
                <div key={idx} className="exp-cell-block">
                  {code && (
                    <div className="code-block-wrapper">
                      <div className="code-block-header">Python Code:</div>
                      <pre className="code-block">{code}</pre>
                    </div>
                  )}

                  {cell.outputs && cell.outputs.length > 0 && (
                    <div className="output-section-wrapper">
                      {cell.outputs.map((out, oi) => {
                        if (out.type === 'text') {
                          return (
                            <pre key={oi} className="output-block">
                              {out.content}
                            </pre>
                          );
                        }
                        if (out.type === 'image') {
                          return (
                            <div key={oi} className="output-image-wrapper">
                              <img
                                src={out.content}
                                alt={`Output plot for experiment ${exp.id}`}
                                className="output-image"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Page Footer */}
        <div className="exp-footer">
          <span>Maulana Azad National Urdu University • Department of CS & IT</span>
          <span style={{ fontWeight: 'bold' }}>Page {exp.page}</span>
        </div>
      </div>
    </div>
  );
}
