import React, { useMemo } from 'react';

// Helper to chunk long code or text output into clean sub-blocks
function chunkText(text, maxLines = 18) {
  if (!text) return [];
  const lines = text.split('\n');
  if (lines.length <= maxLines) return [text];
  const chunks = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  return chunks;
}

export function usePaginator(experiments, startPageOffset = 5, pageCapacity = 52) {
  return useMemo(() => {
    const pages = [];
    const expStartPages = {};
    let currentPageNum = startPageOffset;

    (experiments || []).forEach(exp => {
      // Record exact starting page of this experiment (used in Index table)
      expStartPages[exp.id] = currentPageNum;

      const expUnits = [];

      // 1. Experiment Header Unit (Always starts at the top of a new page)
      expUnits.push({
        type: 'header',
        expId: exp.id,
        title: exp.shortTitle || exp.title,
        weight: 2.5
      });

      // 2. Objective / Problem Statement Unit
      if (exp.description) {
        expUnits.push({
          type: 'aim',
          expId: exp.id,
          text: exp.description,
          weight: 3.5
        });
      }

      // 3. Notebook Cells
      (exp.cells || []).forEach((cell) => {
        if (cell.type === 'markdown') {
          const text = (cell.source || '').trim().replace(/^#+\s*/gm, '');
          // Skip if it duplicates the aim
          if (text && !text.toLowerCase().startsWith('question')) {
            expUnits.push({
              type: 'subheading',
              expId: exp.id,
              text,
              weight: 1.5
            });
          }
        } else if (cell.type === 'code') {
          const code = (cell.source || '').trim();
          if (code) {
            // Split code into chunks of max 18 lines so remaining lines flow seamlessly to next page
            const codeChunks = chunkText(code, 18);
            codeChunks.forEach((cchunk, ci) => {
              const lines = cchunk.split('\n').length;
              expUnits.push({
                type: 'code',
                expId: exp.id,
                code: cchunk,
                isContinued: ci > 0,
                weight: 1.5 + lines * 0.9
              });
            });
          }

          // Individual outputs
          (cell.outputs || []).forEach(out => {
            if (out.type === 'text') {
              const textContent = (out.content || '').trim();
              if (textContent) {
                // Split long text outputs into chunks of max 18 lines
                const textChunks = chunkText(textContent, 18);
                textChunks.forEach((tchunk, ti) => {
                  const outLines = tchunk.split('\n').length;
                  expUnits.push({
                    type: 'text_out',
                    expId: exp.id,
                    content: tchunk,
                    isContinued: ti > 0,
                    weight: 1.5 + Math.ceil(outLines * 0.75)
                  });
                });
              }
            } else if (out.type === 'image') {
              expUnits.push({
                type: 'img_out',
                expId: exp.id,
                content: out.content,
                weight: 11
              });
            }
          });
        }
      });

      // Pack this experiment's units into pages
      let curPage = [];
      let curWeight = 0;

      expUnits.forEach(u => {
        if (curWeight + u.weight > pageCapacity && curWeight > 10) {
          pages.push(curPage);
          currentPageNum++;
          curPage = [];
          curWeight = 0;
        }
        curPage.push(u);
        curWeight += u.weight;
      });

      // Push final page of this experiment (next experiment will start on a new page)
      if (curPage.length > 0) {
        pages.push(curPage);
        currentPageNum++;
      }
    });

    return { pages, expStartPages, totalExpPages: pages.length };
  }, [experiments, startPageOffset, pageCapacity]);
}

export default function ContinuousLabManual({ pages, data = {}, startPageOffset = 5 }) {
  return (
    <>
      {pages.map((pageUnits, pIdx) => {
        const pageNum = pIdx + startPageOffset;

        return (
          <div
            className="a4-page continuous-page"
            id={`page-lab-${pageNum}`}
            key={pIdx}
          >
            <div className="academic-border">
              {/* Running Header on every page */}
              <div className="page-running-header">
                <span>{data.university || 'MAULANA AZAD NATIONAL URDU UNIVERSITY'}</span>
                <span>{data.labTitle || 'DATA SCIENCE LAB'} ({data.courseCode || 'MMCA311PCT'})</span>
              </div>

              {/* Page Content Units - Fits A4 with zero cutoffs */}
              <div className="page-content-area">
                {pageUnits.map((unit, uIdx) => {
                  switch (unit.type) {
                    case 'header':
                      return (
                        <div key={uIdx} className="continuous-exp-header">
                          <div className="continuous-exp-title">
                            Question {unit.expId}: {unit.title}
                          </div>
                        </div>
                      );

                    case 'aim':
                      return (
                        <div key={uIdx} className="continuous-aim-box">
                          <span className="aim-badge">Problem Statement:</span>
                          <span className="aim-text">{unit.text}</span>
                        </div>
                      );

                    case 'subheading':
                      return (
                        <div key={uIdx} className="continuous-subheading">
                          {unit.text}
                        </div>
                      );

                    case 'code':
                      return (
                        <div key={uIdx} className="code-block-wrapper continuous-block">
                          <div className="code-block-header">
                            Python Code {unit.isContinued ? '(Continued)' : ''}:
                          </div>
                          <pre className="code-block">{unit.code}</pre>
                        </div>
                      );

                    case 'text_out':
                      return (
                        <div key={uIdx} className="output-section-wrapper continuous-block">
                          <pre className="output-block">{unit.content}</pre>
                        </div>
                      );

                    case 'img_out':
                      return (
                        <div key={uIdx} className="output-image-wrapper continuous-block">
                          <img
                            src={unit.content}
                            alt={`Plot Output for Question ${unit.expId}`}
                            className="output-image"
                          />
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>

              {/* Running Footer with Page Number on every page */}
              <div className="page-running-footer">
                <span>{data.department || 'Department of Computer Science & Information Technology'}</span>
                <span className="footer-page-badge">Page {pageNum}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
