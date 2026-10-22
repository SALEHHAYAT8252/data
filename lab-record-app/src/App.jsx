import React, { useState, useEffect } from 'react';
import labData from './data/labData.json';
import CoverPage from './components/CoverPage';
import CertificatePage from './components/CertificatePage';
import IndexPage, { getIndexPages } from './components/IndexPage';
import ContinuousLabManual, { usePaginator } from './components/ContinuousLabManual';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import {
  IconLoader,
  IconDownload,
  IconCheck,
  IconZoomIn,
  IconZoomOut,
  IconRotateCcw
} from './components/Icons';

export default function App() {
  const [student, setStudent] = useState({
    name: labData.defaultStudent?.name || 'Saleh Hayat',
    rollNo: labData.defaultStudent?.rollNo || '25MMCA019HY',
    enrollmentNo: labData.defaultStudent?.enrollmentNo || 'A250017'
  });

  const [docMeta, setDocMeta] = useState({
    university: labData.university,
    school: labData.school,
    department: labData.department,
    course: labData.course,
    semester: labData.semester,
    academicYear: labData.academicYear,
    labTitle: labData.labTitle,
    courseCode: labData.courseCode,
    submittedTo: labData.submittedTo,
    logoBase64: labData.logoBase64
  });

  const [experiments, setExperiments] = useState(labData.experiments || []);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'front', 'cover', 'certificate', 'index'
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [zoom, setZoom] = useState(0.85);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle' | 'preparing' | 'downloading' | 'ready'

  // Dynamic Index page count (Page 1 has maximum 7 questions, remaining on next page)
  const indexPagesCount = getIndexPages(experiments).length;
  // Lab manual starts after Cover (1) + Certificate (1) + Index pages
  const labStartPage = 2 + indexPagesCount + 1;

  // Paginate experiments: each question starts on a fresh new page with tight continuous packing inside
  const { pages: labPages, expStartPages, totalExpPages } = usePaginator(experiments, labStartPage, 52);

  const getCleanFilename = () => {
    const raw = (student?.enrollmentNo || 'A250017').trim();
    return raw || 'A250017';
  };

  // Keep document title synced to Enrollment Number so Save as PDF defaults to Enrollment Number (e.g. A250017.pdf)
  useEffect(() => {
    document.title = getCleanFilename();
  }, [student?.enrollmentNo]);

  const handleReset = () => {
    setStudent({
      name: labData.defaultStudent?.name || 'Saleh Hayat',
      rollNo: labData.defaultStudent?.rollNo || '25MMCA019HY',
      enrollmentNo: labData.defaultStudent?.enrollmentNo || 'A250017'
    });
    setDocMeta({
      university: labData.university,
      school: labData.school,
      department: labData.department,
      course: labData.course,
      semester: labData.semester,
      academicYear: labData.academicYear,
      labTitle: labData.labTitle,
      courseCode: labData.courseCode,
      submittedTo: labData.submittedTo,
      logoBase64: labData.logoBase64
    });
    setExperiments(labData.experiments || []);
    setViewMode('all');
  };

  // Interactive PDF Download Feature with Visual Progress Feedback
  const handleDownloadPdf = () => {
    if (downloadStatus !== 'idle') return;
    const filename = getCleanFilename();
    document.title = filename;

    // Step 1: Preparing pages
    setDownloadStatus('preparing');

    // Step 2: Downloading / formatting
    setTimeout(() => {
      setDownloadStatus('downloading');

      // Step 3: Trigger native print to PDF dialog
      setTimeout(() => {
        window.print();
        setDownloadStatus('ready');

        // Step 4: Auto-reset back to idle
        setTimeout(() => {
          setDownloadStatus('idle');
        }, 2500);
      }, 550);
    }, 450);
  };

  // Determine which pages to render
  const shouldRenderCover = viewMode === 'all' || viewMode === 'front' || viewMode === 'cover';
  const shouldRenderCertificate = viewMode === 'all' || viewMode === 'front' || viewMode === 'certificate';
  const shouldRenderIndex = viewMode === 'all' || viewMode === 'front' || viewMode === 'index';
  const shouldRenderExperiments = viewMode === 'all';

  // Calculate page count
  let pageCount = 0;
  if (shouldRenderCover) pageCount++;
  if (shouldRenderCertificate) pageCount++;
  if (shouldRenderIndex) {
    pageCount += indexPagesCount;
  }
  if (shouldRenderExperiments) pageCount += totalExpPages;

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Left Sidebar Controls */}
        <Sidebar
          student={student}
          setStudent={setStudent}
          docMeta={docMeta}
          setDocMeta={setDocMeta}
          experiments={experiments}
          setExperiments={setExperiments}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedExpId={selectedExpId}
          setSelectedExpId={setSelectedExpId}
          onDownloadPdf={handleDownloadPdf}
          downloadStatus={downloadStatus}
          onReset={handleReset}
        />

        {/* Main Preview Area */}
        <main className="preview-pane">
          {/* Sticky Toolbar */}
          <div className="preview-toolbar no-print">
            <div className="toolbar-group">
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>
                Live Document Preview
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {pageCount} A4 Pages (All with Rectangular Border)
              </span>
            </div>

            <div className="toolbar-group">
              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#1e2636', borderRadius: '6px', padding: '2px 4px', border: '1px solid #2b3548' }}>
                <button
                  onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px 6px', display: 'flex' }}
                  title="Zoom Out"
                >
                  <IconZoomOut size={15} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '46px', textAlign: 'center', color: '#e2e8f0' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(prev => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px 6px', display: 'flex' }}
                  title="Zoom In"
                >
                  <IconZoomIn size={15} />
                </button>
                <button
                  onClick={() => setZoom(0.85)}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', fontWeight: '500' }}
                  title="Reset Zoom to Fit"
                >
                  Fit
                </button>
              </div>

              {/* Fast Vector PDF Download Button with Active Download Status */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloadStatus !== 'idle'}
                className="btn-primary"
                style={{
                  width: 'auto',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  background: downloadStatus !== 'idle'
                    ? '#3b82f6'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: downloadStatus !== 'idle' ? 'wait' : 'pointer',
                  opacity: downloadStatus !== 'idle' ? 0.95 : 1
                }}
                title={`Download ${getCleanFilename()}.pdf`}
              >
                {downloadStatus === 'idle' && <IconDownload size={15} />}
                {(downloadStatus === 'preparing' || downloadStatus === 'downloading') && <IconLoader size={15} />}
                {downloadStatus === 'ready' && <IconCheck size={15} />}
                <span>
                  {downloadStatus === 'idle' && `Download ${getCleanFilename()}.pdf`}
                  {downloadStatus === 'preparing' && `Preparing ${getCleanFilename()}.pdf...`}
                  {downloadStatus === 'downloading' && `Downloading ${getCleanFilename()}.pdf...`}
                  {downloadStatus === 'ready' && `✓ ${getCleanFilename()}.pdf Ready!`}
                </span>
              </button>
            </div>
          </div>

          {/* Active PDF Downloading Overlay Feature */}
          {downloadStatus !== 'idle' && (
            <div className="download-modal-overlay no-print">
              <div className="download-modal-card">
                {downloadStatus === 'ready' ? (
                  <div className="download-success-badge">
                    <IconCheck size={36} />
                  </div>
                ) : (
                  <div className="download-spinner-ring"></div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', marginTop: '14px' }}>
                  {downloadStatus === 'preparing' && `Preparing ${getCleanFilename()}.pdf...`}
                  {downloadStatus === 'downloading' && `Downloading ${getCleanFilename()}.pdf...`}
                  {downloadStatus === 'ready' && `✓ ${getCleanFilename()}.pdf Ready!`}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', textAlign: 'center', lineHeight: '1.45' }}>
                  {downloadStatus === 'preparing' && 'Formatting all 30 A4 pages with rectangular borders...'}
                  {downloadStatus === 'downloading' && 'Opening PDF Save dialog. In the window, select "Save as PDF" to save directly.'}
                  {downloadStatus === 'ready' && 'Your PDF has been prepared with full vector quality!'}
                </p>
                <div className="download-progress-bar">
                  <div className={`download-progress-fill ${downloadStatus}`}></div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Document Canvas */}
          <div className="preview-canvas-wrapper" id="document-preview-container">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                alignItems: 'center'
              }}
            >
              {/* Cover Page (Page 1) */}
              {shouldRenderCover && (
                <CoverPage data={docMeta} student={student} />
              )}

              {/* Certificate Page (Page 2) */}
              {shouldRenderCertificate && (
                <CertificatePage data={docMeta} student={student} />
              )}

              {/* Index Page (Pages 3 & 4) */}
              {shouldRenderIndex && (
                <IndexPage
                  experiments={experiments}
                  expStartPages={expStartPages}
                  onExperimentClick={id => {
                    const targetPage = expStartPages[id];
                    if (targetPage) {
                      const el = document.getElementById(`page-lab-${targetPage}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              )}

              {/* Continuous Lab Manual Pages with Full Borders and Running Headers/Footers */}
              {shouldRenderExperiments && (
                <ContinuousLabManual
                  pages={labPages}
                  data={docMeta}
                  startPageOffset={5}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
