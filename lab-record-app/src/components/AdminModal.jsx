import React, { useState } from 'react';
import {
  IconClose,
  IconLock,
  IconUnlock,
  IconShield,
  IconCheck,
  IconSave,
  IconRotateCcw,
  IconColumns,
  IconBookOpen,
  IconUser
} from './Icons';

export const ADMIN_EMAIL = 'salehhayat632@gmail.com';
export const ADMIN_PASSWORD = 'SalehHayat8252';

export default function AdminModal({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  docMeta,
  setDocMeta,
  onSaveDefaults,
  onResetDefaults,
  onOpenTableManager
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local draft of admin settings
  const [draftMeta, setDraftMeta] = useState({ ...docMeta });

  // Update draft whenever docMeta changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setDraftMeta({ ...docMeta });
      setError('');
      setSaveSuccess(false);
    }
  }, [isOpen, docMeta]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e?.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        localStorage.setItem('lab_record_admin_auth', 'true');
      } catch (err) {
        console.error(err);
      }
      setError('');
    } else {
      setError('Invalid email or password. Access is restricted to authorized administrators.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('lab_record_admin_auth');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDraftChange = (field, val) => {
    setDraftMeta(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmittedToChange = (field, val) => {
    setDraftMeta(prev => ({
      ...prev,
      submittedTo: {
        ...(prev.submittedTo || {}),
        [field]: val
      }
    }));
  };

  const handleSave = () => {
    setDocMeta(draftMeta);
    if (onSaveDefaults) {
      onSaveDefaults(draftMeta);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all academic defaults back to original university settings?')) {
      if (onResetDefaults) onResetDefaults();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="admin-modal-backdrop no-print" onClick={onClose}>
      <div
        className="admin-modal-card"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className={`admin-badge-icon ${isAdmin ? 'active' : ''}`}>
              <IconShield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>
                {isAdmin ? 'Administrator Dashboard' : 'Administrator Sign In'}
              </h2>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                {isAdmin
                  ? `Signed in as ${ADMIN_EMAIL}`
                  : 'Manage system defaults & lab manual parameters'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="admin-close-btn"
            title="Close modal"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body">
          {!isAdmin ? (
            /* Login Form */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-login-notice" style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontWeight: '600', color: '#38bdf8' }}>
                  Restricted Administrator Access
                </div>
              </div>

              {error && (
                <div className="admin-error-box">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter administrator email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div style={{ marginTop: '6px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '11px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <IconLock size={15} />
                  <span>Log In as Admin</span>
                </button>
              </div>
            </form>
          ) : (
            /* Admin Configuration Controls */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {saveSuccess && (
                <div className="admin-success-box">
                  <IconCheck size={16} />
                  <span>Global defaults updated and saved to permanent storage!</span>
                </div>
              )}

              {/* Status Bar */}
              <div className="admin-verified-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="admin-online-dot"></span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
                    Admin Mode Active
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="admin-logout-btn"
                  title="Sign out of Admin Mode"
                >
                  <IconUnlock size={13} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Core Default Controls */}
              <div className="admin-section-card">
                <div className="admin-section-title">
                  <IconBookOpen size={16} style={{ color: '#38bdf8' }} />
                  <span>Academic Session & Semester Defaults</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Semester & Year (Default: 2ND Year / 3RD Semester)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.semester || ''}
                    onChange={e => handleDraftChange('semester', e.target.value)}
                    placeholder="2ND Year / 3RD Semester"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Academic Year / Session (Default: 2025-26)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.academicYear || ''}
                    onChange={e => handleDraftChange('academicYear', e.target.value)}
                    placeholder="2025-26"
                  />
                </div>
              </div>

              {/* Supervisor Configuration */}
              <div className="admin-section-card">
                <div className="admin-section-title">
                  <IconUser size={16} style={{ color: '#10b981' }} />
                  <span>Supervisor / Faculty Details (Submitted To)</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Supervisor Name (Default: Mr. Kamran Siddiqui)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.submittedTo?.name || ''}
                    onChange={e => handleSubmittedToChange('name', e.target.value)}
                    placeholder="Mr. Kamran Siddiqui"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.submittedTo?.designation || ''}
                    onChange={e => handleSubmittedToChange('designation', e.target.value)}
                    placeholder="Assistant Professor"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Supervisor Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.submittedTo?.department || ''}
                    onChange={e => handleSubmittedToChange('department', e.target.value)}
                    placeholder="Department of CS & IT, MANUU"
                  />
                </div>
              </div>

              {/* Subject & Course Configuration */}
              <div className="admin-section-card">
                <div className="admin-section-title">
                  <IconBookOpen size={16} style={{ color: '#f59e0b' }} />
                  <span>Course & Lab Details</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Lab Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.labTitle || ''}
                    onChange={e => handleDraftChange('labTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.course || ''}
                    onChange={e => handleDraftChange('course', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={draftMeta.courseCode || ''}
                    onChange={e => handleDraftChange('courseCode', e.target.value)}
                  />
                </div>
              </div>

              {/* Table Manager Shortcut */}
              <div className="admin-table-shortcut">
                <div>
                  <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '13px' }}>
                    Index Table & Columns Customizer
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                    Add custom columns (Date, Sign, Marks) & edit question contents.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenTableManager) onOpenTableManager();
                  }}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconColumns size={14} />
                  <span>Open Table Editor</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <IconSave size={15} />
                  <span>Save as Global Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '12px', color: '#ef4444' }}
                  title="Reset to factory defaults"
                >
                  <IconRotateCcw size={14} />
                  <span>Factory Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
