import React, { useState, useEffect } from 'react';
import labData from './data/labData.json';
import CoverPage from './components/CoverPage';
import CertificatePage from './components/CertificatePage';
import IndexPage, { getIndexPages, DEFAULT_INDEX_COLUMNS } from './components/IndexPage';
import ContinuousLabManual, { usePaginator } from './components/ContinuousLabManual';
import Sidebar from './components/Sidebar';
import AdminModal, { ADMIN_EMAIL, ADMIN_PASSWORD } from './components/AdminModal';
import TableManagerModal from './components/TableManagerModal';
import ErrorBoundary from './components/ErrorBoundary';
import {
  IconLoader,
  IconDownload,
  IconCheck,
  IconZoomIn,
  IconZoomOut,
  IconRotateCcw,
  IconMenu,
  IconShield,
  IconLock,
  IconColumns,
  IconSettings
} from './components/Icons';

// Default academic settings per MANUU MCA Data Science specification
const DEFAULT_ACADEMIC_META = {
  university: labData.university || 'MAULANA AZAD NATIONAL URDU UNIVERSITY',
  school: labData.school || 'SCHOOL OF TECHNOLOGY',
  department: labData.department || 'DEPARTMENT OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY',
  course: labData.course || 'MASTER OF COMPUTER APPLICATION',
  semester: '2ND Year / 3RD Semester',
  academicYear: '2025-26',
  labTitle: labData.labTitle || 'DATA SCIENCE LAB',
  courseCode: labData.courseCode || 'MMCA311PCT',
  submittedTo: {
    name: 'Mr. Kamran Siddiqui',
    designation: 'Assistant Professor',
    department: 'Department of CS & IT, MANUU'
  },
  logoBase64: labData.logoBase64,
  accreditation: labData.accreditation || 'Accredited Grade “A+” by NAAC',
  address: labData.address || 'Gachibowli, Hyderabad-500032, T.S. www.manuu.edu.in',
  universitySub: labData.universitySub || '(A Central University established by an Act of Parliament in 1998)'
};

const getInitialDocMeta = () => {
  try {
    const saved = localStorage.getItem('lab_record_admin_defaults');
    if (saved) {
      return { ...DEFAULT_ACADEMIC_META, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error(err);
  }
  return DEFAULT_ACADEMIC_META;
};

const getInitialColumns = () => {
  try {
    const saved = localStorage.getItem('lab_record_columns');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error(err);
  }
  return DEFAULT_INDEX_COLUMNS;
};

const getInitialExperiments = () => {
  try {
    const saved = localStorage.getItem('lab_record_experiments');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error(err);
  }
  return labData.experiments || [];
};

export default function App() {
  const [student, setStudent] = useState({
    name: labData.defaultStudent?.name || 'Saleh Hayat',
    rollNo: labData.defaultStudent?.rollNo || '25MMCA019HY',
    enrollmentNo: labData.defaultStudent?.enrollmentNo || 'A250017'
  });

  const [docMeta, setDocMeta] = useState(getInitialDocMeta);
  const [experiments, setExperiments] = useState(getInitialExperiments);
  const [columns, setColumns] = useState(getInitialColumns);

  // Admin and Table modal states
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('lab_record_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTableManagerOpen, setIsTableManagerOpen] = useState(false);

  const [viewMode, setViewMode] = useState('all'); // 'all', 'front', 'cover', 'certificate', 'index'
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle' | 'preparing' | 'downloading' | 'ready'

  // Dynamic responsive auto-fit zoom based on preview canvas clientWidth
  const computeFitZoom = () => {
    if (typeof window === 'undefined') return 0.85;
    const previewContainer = document.getElementById('document-preview-container');
    const containerWidth = previewContainer?.clientWidth || (
      window.innerWidth <= 768 
        ? window.innerWidth 
        : window.innerWidth <= 900 
          ? window.innerWidth 
          : window.innerWidth - 420
    );
    // Usable width minus 24px padding for clean margins around A4 sheet
    const usableWidth = Math.max(240, containerWidth - 24);
    // 794px is exact ISO A4 width (210mm at 96 DPI)
    const fit = Math.min(0.85, Math.max(0.25, usableWidth / 794));
    return Number(fit.toFixed(2));
  };

  const [zoom, setZoom] = useState(0.85);
  const [isPrinting, setIsPrinting] = useState(false);

  // Keep preview zoom dynamically updated for screen responsiveness
  useEffect(() => {
    const handleResize = () => {
      setZoom(computeFitZoom());
    };
    // Short delay to ensure container is mounted in DOM
    const timer = setTimeout(() => {
      setZoom(computeFitZoom());
    }, 60);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // During print / Save to PDF, force zoom to 1 regardless of device viewport
  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

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
    setDocMeta(getInitialDocMeta());
    setViewMode('all');
  };

  const handleSaveAdminDefaults = (updatedMeta) => {
    try {
      localStorage.setItem('lab_record_admin_defaults', JSON.stringify(updatedMeta));
    } catch (e) {
      console.error(e);
    }
    setDocMeta(updatedMeta);
  };

  const handleResetAdminDefaults = () => {
    try {
      localStorage.removeItem('lab_record_admin_defaults');
    } catch (e) {
      console.error(e);
    }
    setDocMeta(DEFAULT_ACADEMIC_META);
  };

  const handleSaveTable = (updatedCols, updatedExps) => {
    try {
      localStorage.setItem('lab_record_columns', JSON.stringify(updatedCols));
      localStorage.setItem('lab_record_experiments', JSON.stringify(updatedExps));
    } catch (e) {
      console.error(e);
    }
    setColumns(updatedCols);
    setExperiments(updatedExps);
  };

  const handleResetTable = () => {
    try {
      localStorage.removeItem('lab_record_columns');
      localStorage.removeItem('lab_record_experiments');
    } catch (e) {
      console.error(e);
    }
    setColumns(DEFAULT_INDEX_COLUMNS);
    setExperiments(labData.experiments || []);
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('lab_record_admin_auth');
    } catch (e) {
      console.error(e);
    }
  };

  // Interactive PDF Download Feature with Visual Progress Feedback
  const handleDownloadPdf = () => {
    if (downloadStatus !== 'idle') return;
    const filename = getCleanFilename();
    document.title = filename;

    // Step 1: Preparing pages
    setDownloadStatus('preparing');

    // Step 2: Downloading / formatting - force 100% zoom for print
    setTimeout(() => {
      setDownloadStatus('downloading');
      setIsPrinting(true);

      // Step 3: Trigger native print to PDF dialog with zoom reset to 1
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
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
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop no-print"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Controls */}
        <Sidebar
          student={student}
          setStudent={setStudent}
          docMeta={docMeta}
          setDocMeta={setDocMeta}
          experiments={experiments}
          setExperiments={setExperiments}
          columns={columns}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedExpId={selectedExpId}
          setSelectedExpId={setSelectedExpId}
          onDownloadPdf={handleDownloadPdf}
          downloadStatus={downloadStatus}
          onReset={handleReset}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onOpenTableManager={() => setIsTableManagerOpen(true)}
          onSaveDefaults={handleSaveAdminDefaults}
          onLogoutAdmin={handleLogoutAdmin}
        />

        {/* Main Preview Area */}
        <main className="preview-pane">
          {/* Sticky Toolbar */}
          {/* Sticky Responsive Toolbar */}
          <div className="preview-toolbar no-print">
            {/* Main/Top Row */}
            <div className="toolbar-main-row">
              <div className="toolbar-left-group">
                {/* Mobile Sidebar Hamburger Toggle */}
                <button
                  className="mobile-toggle-btn no-print"
                  onClick={() => setIsSidebarOpen(true)}
                  title="Open Student Form & Settings"
                >
                  <IconMenu size={16} />
                  <span>Form</span>
                </button>

                <div className="toolbar-title-wrap">
                  <span className="toolbar-title-text">
                    Document Preview
                  </span>
                  <span className="toolbar-divider">•</span>
                  <span className="toolbar-badge-text">
                    {pageCount} Pages
                  </span>
                </div>

                {/* Admin Mode Shortcut */}
                <button
                  type="button"
                  className={`toolbar-quick-btn ${isAdmin ? 'admin-active' : ''}`}
                  onClick={() => setIsAdminModalOpen(true)}
                  title={isAdmin ? `Admin: ${ADMIN_EMAIL}` : 'Sign in as Administrator'}
                >
                  {isAdmin ? <IconShield size={14} style={{ color: '#10b981' }} /> : <IconLock size={13} />}
                  <span className="toolbar-btn-text">{isAdmin ? 'Admin' : 'Admin'}</span>
                </button>

                {/* Table Customizer Shortcut */}
                <button
                  type="button"
                  className="toolbar-quick-btn"
                  onClick={() => setIsTableManagerOpen(true)}
                  title="Customize Index Table Columns & Content"
                >
                  <IconColumns size={14} style={{ color: '#38bdf8' }} />
                  <span className="toolbar-btn-text">Table</span>
                </button>
              </div>

              <div className="toolbar-right-group">
                {/* Desktop Zoom Controls (hidden on mobile row 1) */}
                <div className="zoom-controls desktop-zoom">
                  <button
                    onClick={() => setZoom(prev => Math.max(0.35, Number((prev - 0.1).toFixed(2))))}
                    className="zoom-btn"
                    title="Zoom Out"
                  >
                    <IconZoomOut size={15} />
                  </button>
                  <span className="zoom-value">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(prev => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                    className="zoom-btn"
                    title="Zoom In"
                  >
                    <IconZoomIn size={15} />
                  </button>
                  <button
                    onClick={() => setZoom(computeFitZoom())}
                    className="zoom-fit-btn"
                    title="Auto-Fit Page to Screen"
                  >
                    Fit
                  </button>
                </div>

                {/* Fast Vector PDF Download Button with Active Download Status */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadStatus !== 'idle'}
                  className="btn-primary btn-download-responsive"
                  title={`Download ${getCleanFilename()}.pdf`}
                >
                  {downloadStatus === 'idle' && <IconDownload size={15} />}
                  {(downloadStatus === 'preparing' || downloadStatus === 'downloading') && <IconLoader size={15} />}
                  {downloadStatus === 'ready' && <IconCheck size={15} />}
                  <span className="download-btn-text">
                    {downloadStatus === 'idle' && 'Download PDF'}
                    {downloadStatus === 'preparing' && 'Preparing...'}
                    {downloadStatus === 'downloading' && 'Downloading...'}
                    {downloadStatus === 'ready' && 'Ready!'}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Sub-Row: Centered Zoom & Page Badge (only visible on mobile <= 768px) */}
            <div className="toolbar-mobile-subrow">
              <div className="zoom-controls mobile-zoom">
                <button
                  onClick={() => setZoom(prev => Math.max(0.35, Number((prev - 0.1).toFixed(2))))}
                  className="zoom-btn"
                  title="Zoom Out"
                >
                  <IconZoomOut size={14} />
                </button>
                <span className="zoom-value">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(prev => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                  className="zoom-btn"
                  title="Zoom In"
                >
                  <IconZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(computeFitZoom())}
                  className="zoom-fit-btn"
                  title="Auto-Fit Page to Screen"
                >
                  Auto-Fit
                </button>
              </div>
              <span className="mobile-page-badge">
                {pageCount} A4 Pages
              </span>
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
              className="pages-container"
              style={{
                zoom: isPrinting ? 1 : zoom,
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

              {/* Index Page (Pages 3 & 4) with dynamic columns */}
              {shouldRenderIndex && (
                <IndexPage
                  experiments={experiments}
                  expStartPages={expStartPages}
                  columns={columns}
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

        {/* Administrator Authentication & Global Configuration Modal */}
        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          docMeta={docMeta}
          setDocMeta={setDocMeta}
          onSaveDefaults={handleSaveAdminDefaults}
          onResetDefaults={handleResetAdminDefaults}
          onOpenTableManager={() => setIsTableManagerOpen(true)}
        />

        {/* Dynamic Table & Column Customizer Modal */}
        <TableManagerModal
          isOpen={isTableManagerOpen}
          onClose={() => setIsTableManagerOpen(false)}
          columns={columns}
          setColumns={setColumns}
          experiments={experiments}
          setExperiments={setExperiments}
          onSaveTable={handleSaveTable}
          onResetTable={handleResetTable}
        />
      </div>
    </ErrorBoundary>
  );
}
