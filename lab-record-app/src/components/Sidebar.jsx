import React, { useState } from 'react';
import {
  IconLoader,
  IconDownload,
  IconEye,
  IconFileText,
  IconCheck,
  IconSettings,
  IconRotateCcw,
  IconUser,
  IconHash,
  IconAward,
  IconBookOpen,
  IconLayers,
  IconEdit,
  IconCalendar,
  IconSparkles,
  IconClose,
  IconLock,
  IconUnlock,
  IconShield,
  IconColumns,
  IconSave
} from './Icons';

export default function Sidebar({
  student = {},
  setStudent,
  docMeta = {},
  setDocMeta,
  experiments = [],
  setExperiments,
  viewMode,
  setViewMode,
  selectedExpId,
  setSelectedExpId,
  onDownloadPdf,
  downloadStatus = 'idle',
  onReset,
  isOpen = false,
  onClose = () => {},
  isAdmin = false,
  onOpenAdminModal = () => {},
  onOpenTableManager = () => {},
  columns = [],
  onSaveDefaults = () => {},
  onLogoutAdmin = () => {}
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStudentChange = (field, val) => {
    setStudent(prev => ({ ...(prev || {}), [field]: val }));
  };

  const handleDocMetaChange = (field, val) => {
    setDocMeta(prev => ({ ...(prev || {}), [field]: val }));
  };

  const handleExpChange = (id, field, val) => {
    setExperiments(prev =>
      (prev || []).map(exp => (exp.id === id ? { ...exp, [field]: val } : exp))
    );
  };

  const enrollFile = `${(student?.enrollmentNo || 'A250017').trim() || 'A250017'}.pdf`;

  return (
    <aside className={`sidebar no-print ${isOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="brand-badge">
            <IconSparkles size={13} />
            <span>MANUU MCA Data Science</span>
          </div>
          <button
            className="sidebar-close-btn no-print"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close"
          >
            <IconClose size={18} />
          </button>
        </div>
        <h1 className="sidebar-title">Lab Record Generator</h1>
        <p className="sidebar-subtitle">Create verified academic lab records & PDF documents</p>
      </div>

      <div className="sidebar-content">
        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Direct 1-Click Fast Vector PDF Download Button with Active Download Status */}
          <button
            className="btn-primary"
            onClick={onDownloadPdf}
            disabled={downloadStatus !== 'idle'}
            title={`Download ${enrollFile} as PDF`}
            style={{
              background: downloadStatus !== 'idle'
                ? '#3b82f6'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 16px',
              gap: '4px',
              cursor: downloadStatus !== 'idle' ? 'wait' : 'pointer',
              opacity: downloadStatus !== 'idle' ? 0.95 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              {downloadStatus === 'idle' && <IconDownload size={18} />}
              {(downloadStatus === 'preparing' || downloadStatus === 'downloading') && <IconLoader size={18} />}
              {downloadStatus === 'ready' && <IconCheck size={18} />}
              <span>
                {downloadStatus === 'idle' && `Download ${enrollFile}`}
                {downloadStatus === 'preparing' && `Preparing ${enrollFile}...`}
                {downloadStatus === 'downloading' && `Downloading ${enrollFile}...`}
                {downloadStatus === 'ready' && `✓ ${enrollFile} Ready!`}
              </span>
            </div>
            <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 'normal' }}>
              {downloadStatus !== 'idle' ? 'Opening PDF Save Dialog...' : 'Instant Vector PDF • No Blank Pages'}
            </span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={onReset}
              title="Reset fields to Saleh Hayat (25MMCA019HY / A250017)"
            >
              <IconRotateCcw size={15} />
              <span>Reset Defaults</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowAdvanced(!showAdvanced)}
              title="Customize course and university fields"
            >
              <IconSettings size={15} />
              <span>Meta</span>
            </button>
          </div>

          {/* Admin Mode Control Pill / Banner */}
          {!isAdmin ? (
            <button
              type="button"
              className="sidebar-admin-btn"
              onClick={onOpenAdminModal}
              title="Sign in as Admin to change default semester, session, and faculty"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconLock size={15} style={{ color: '#38bdf8' }} />
                <span>Admin Login</span>
              </div>
              <span className="sidebar-admin-tag">Defaults</span>
            </button>
          ) : (
            <div className="sidebar-admin-active">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconShield size={15} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981' }}>ADMIN ACTIVE</span>
                </div>
                <button
                  type="button"
                  className="btn-admin-logout-sm"
                  onClick={onLogoutAdmin}
                  title="Sign out of Admin mode"
                >
                  Logout
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                salehhayat632@gmail.com
              </div>
              <button
                type="button"
                className="btn-admin-config"
                onClick={onOpenAdminModal}
              >
                <IconSettings size={13} />
                <span>Edit Global Defaults</span>
              </button>
            </div>
          )}
        </div>

        {/* Student Details Form - Defensive, Never Crashes */}
        <div className="form-card">
          <div className="card-title">
            <IconUser size={16} style={{ color: '#3b82f6' }} />
            <span>Student Credentials</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Student Full Name</span>
              <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={student?.name ?? ''}
              onChange={e => handleStudentChange('name', e.target.value)}
              placeholder="e.g. SALEH HAYAT"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Roll Number</span>
              <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={student?.rollNo ?? ''}
              onChange={e => handleStudentChange('rollNo', e.target.value)}
              placeholder="e.g. 25MMCA019HY"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Enrollment Number</span>
              <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={student?.enrollmentNo ?? ''}
              onChange={e => handleStudentChange('enrollmentNo', e.target.value)}
              placeholder="e.g. A250017"
            />
          </div>
        </div>

        {/* Document View Mode */}
        <div className="form-card">
          <div className="card-title">
            <IconLayers size={16} style={{ color: '#06b6d4' }} />
            <span>Document Preview Mode</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: viewMode === 'all' ? '#1e293b' : 'transparent' }}>
              <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'all'}
                onChange={() => setViewMode('all')}
              />
              <span>Full Record (Cover + Certificate + Index + 9 Labs)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: viewMode === 'front' ? '#1e293b' : 'transparent' }}>
              <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'front'}
                onChange={() => setViewMode('front')}
              />
              <span>Front Matter Only (Cover, Certificate & Index)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: viewMode === 'cover' ? '#1e293b' : 'transparent' }}>
              <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'cover'}
                onChange={() => setViewMode('cover')}
              />
              <span>Cover Page Only (Front Page)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: viewMode === 'certificate' ? '#1e293b' : 'transparent' }}>
              <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'certificate'}
                onChange={() => setViewMode('certificate')}
              />
              <span>Certificate Page Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: viewMode === 'index' ? '#1e293b' : 'transparent' }}>
              <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'index'}
                onChange={() => setViewMode('index')}
              />
              <span>Index Table Only</span>
            </label>
          </div>
        </div>

        {/* Index Table & Columns Manager Card */}
        <div className="form-card">
          <div
            className="card-title"
            style={{ cursor: 'pointer', justifyContent: 'space-between', marginBottom: '8px' }}
            onClick={onOpenTableManager}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconColumns size={16} style={{ color: '#10b981' }} />
              <span>Index Table & Columns</span>
            </div>
            <span className="badge-columns-count">
              {columns?.length || 4} Cols
            </span>
          </div>

          <p style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.4', margin: '4px 0 10px' }}>
            Add custom columns (Date, Signature, Marks) & edit question titles, descriptions, and remarks.
          </p>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', padding: '9px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#60a5fa' }}
            onClick={onOpenTableManager}
          >
            <IconEdit size={14} />
            <span>Manage Columns & Edit Content</span>
          </button>
        </div>

        {/* Advanced Academic Metadata */}
        {showAdvanced && (
          <div className="form-card">
            <div className="card-title">
              <IconBookOpen size={16} style={{ color: '#f59e0b' }} />
              <span>Course & Faculty Configuration</span>
            </div>

            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.course || ''}
                onChange={e => handleDocMetaChange('course', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Semester / Year</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.semester || ''}
                onChange={e => handleDocMetaChange('semester', e.target.value)}
                placeholder="2ND Year / 3RD Semester"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year / Session</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.academicYear || ''}
                onChange={e => handleDocMetaChange('academicYear', e.target.value)}
                placeholder="2025-26"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject Title & Code</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.labTitle || ''}
                onChange={e => handleDocMetaChange('labTitle', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supervisor / Teacher Name</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.submittedTo?.name || ''}
                onChange={e =>
                  setDocMeta(prev => ({
                    ...(prev || {}),
                    submittedTo: { ...(prev?.submittedTo || {}), name: e.target.value }
                  }))
                }
                placeholder="Mr. Kamran Siddiqui"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supervisor Designation</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.submittedTo?.designation || ''}
                onChange={e =>
                  setDocMeta(prev => ({
                    ...(prev || {}),
                    submittedTo: { ...(prev?.submittedTo || {}), designation: e.target.value }
                  }))
                }
                placeholder="Assistant Professor"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supervisor Department</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.submittedTo?.department || ''}
                onChange={e =>
                  setDocMeta(prev => ({
                    ...(prev || {}),
                    submittedTo: { ...(prev?.submittedTo || {}), department: e.target.value }
                  }))
                }
                placeholder="Department of CS & IT, MANUU"
              />
            </div>

            {isAdmin ? (
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px', padding: '9px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => {
                  onSaveDefaults(docMeta);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
              >
                <IconSave size={14} />
                <span>{saveSuccess ? '✓ Saved as Defaults!' : 'Save as Global Defaults'}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', marginTop: '10px', padding: '8px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={onOpenAdminModal}
              >
                <IconLock size={13} style={{ color: '#38bdf8' }} />
                <span>Admin Login to Save Defaults</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
