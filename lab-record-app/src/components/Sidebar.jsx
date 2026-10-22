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
  IconClose
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
  onClose = () => {}
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);

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

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', padding: '10px 12px', fontSize: '11.5px', color: '#93c5fd', lineHeight: '1.4' }}>
            <strong style={{ color: '#60a5fa' }}>💡 How to Download PDF:</strong>
            <div style={{ marginTop: '4px', color: '#cbd5e1' }}>
              1. Click <strong>Download {enrollFile}</strong>.<br />
              2. In dialog, set Destination to <strong>Save as PDF</strong> and click <strong>Save</strong>.<br />
              3. It saves in <strong>1 second</strong> with crisp text and zero blank pages! To view, right-click ➔ <strong>Open with Chrome / Edge</strong>.
            </div>
          </div>
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

        {/* Index Table Page Numbers Customizer */}
        <div className="form-card">
          <div
            className="card-title"
            style={{ cursor: 'pointer', justifyContent: 'space-between', marginBottom: showTableEditor ? '14px' : '0' }}
            onClick={() => setShowTableEditor(!showTableEditor)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconEdit size={16} style={{ color: '#10b981' }} />
              <span>Customize Index Page Numbers</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{showTableEditor ? 'Hide' : 'Edit'}</span>
          </div>

          {showTableEditor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {experiments.map(exp => (
                <div key={exp.id} style={{ background: '#0f141d', padding: '10px', borderRadius: '8px', border: '1px solid #2b3548' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '6px' }}>
                    Q{exp.id}: {exp.shortTitle}
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Page No.</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '12px' }}
                      value={exp.page}
                      onChange={e => handleExpChange(exp.id, 'page', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                className="form-input"
                value={docMeta.academicYear || ''}
                onChange={e => handleDocMetaChange('academicYear', e.target.value)}
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
              <label className="form-label">Supervisor / Teacher</label>
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
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
