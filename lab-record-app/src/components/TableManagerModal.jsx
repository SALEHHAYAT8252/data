import React, { useState } from 'react';
import {
  IconClose,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconSave,
  IconRotateCcw,
  IconColumns,
  IconFileText
} from './Icons';

export default function TableManagerModal({
  isOpen,
  onClose,
  columns = [],
  setColumns,
  experiments = [],
  setExperiments,
  onSaveTable,
  onResetTable
}) {
  const [activeTab, setActiveTab] = useState('columns'); // 'columns' | 'rows'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Draft states
  const [draftColumns, setDraftColumns] = useState([...columns]);
  const [draftExperiments, setDraftExperiments] = useState([...experiments]);

  // Form for adding a new column
  const [newColLabel, setNewColLabel] = useState('');
  const [newColUrdu, setNewColUrdu] = useState('');
  const [newColWidth, setNewColWidth] = useState('12%');
  const [newColDefaultVal, setNewColDefaultVal] = useState('');
  const [colError, setColError] = useState('');

  // Synchronize when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setDraftColumns([...columns]);
      setDraftExperiments([...experiments]);
      setColError('');
      setSaveSuccess(false);
    }
  }, [isOpen, columns, experiments]);

  if (!isOpen) return null;

  // Add new column handler
  const handleAddColumn = (e) => {
    e?.preventDefault();
    const cleanLabel = newColLabel.trim();
    if (!cleanLabel) {
      setColError('Please enter a column title.');
      return;
    }

    const colId = 'col_' + cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);

    const newCol = {
      id: colId,
      label: cleanLabel,
      urdu: newColUrdu.trim(),
      width: newColWidth.trim() || '12%',
      align: 'center',
      isDefault: false,
      defaultValue: newColDefaultVal.trim()
    };

    const updatedCols = [...draftColumns, newCol];
    setDraftColumns(updatedCols);

    // Populate all existing rows with default value for this new column
    if (newColDefaultVal.trim()) {
      setDraftExperiments(prev =>
        prev.map(exp => ({
          ...exp,
          customData: {
            ...(exp.customData || {}),
            [colId]: newColDefaultVal.trim()
          }
        }))
      );
    }

    setNewColLabel('');
    setNewColUrdu('');
    setNewColDefaultVal('');
    setColError('');
  };

  // Remove custom column handler
  const handleRemoveColumn = (colId) => {
    setDraftColumns(prev => prev.filter(c => c.id !== colId));
    // Clean up from experiment customData
    setDraftExperiments(prev =>
      prev.map(exp => {
        if (!exp.customData) return exp;
        const copy = { ...exp.customData };
        delete copy[colId];
        return { ...exp, customData: copy };
      })
    );
  };

  // Update column properties
  const handleColumnChange = (colId, field, val) => {
    setDraftColumns(prev =>
      prev.map(c => (c.id === colId ? { ...c, [field]: val } : c))
    );
  };

  // Update experiment / row field
  const handleExpChange = (expId, field, val) => {
    setDraftExperiments(prev =>
      prev.map(exp => (exp.id === expId ? { ...exp, [field]: val } : exp))
    );
  };

  // Update custom column value on a specific experiment
  const handleExpCustomChange = (expId, colId, val) => {
    setDraftExperiments(prev =>
      prev.map(exp => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          customData: {
            ...(exp.customData || {}),
            [colId]: val
          }
        };
      })
    );
  };

  // Add a new row to table
  const handleAddRow = () => {
    const nextId = draftExperiments.length > 0 ? Math.max(...draftExperiments.map(e => e.id || 0)) + 1 : 1;
    const newExp = {
      id: nextId,
      title: `Question ${nextId}: Custom Experiment`,
      shortTitle: `Experiment ${nextId}`,
      description: 'Description of the experiment and problem statement.',
      page: draftExperiments.length + 5,
      remarks: 'Completed',
      customData: {}
    };
    setDraftExperiments(prev => [...prev, newExp]);
  };

  // Delete row
  const handleDeleteRow = (expId) => {
    if (window.confirm(`Delete row Question ${expId}?`)) {
      setDraftExperiments(prev => prev.filter(e => e.id !== expId));
    }
  };

  // Save all changes
  const handleSave = () => {
    setColumns(draftColumns);
    setExperiments(draftExperiments);
    if (onSaveTable) {
      onSaveTable(draftColumns, draftExperiments);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Reset to original table
  const handleReset = () => {
    if (window.confirm('Reset all table columns and contents back to defaults?')) {
      if (onResetTable) onResetTable();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="admin-modal-backdrop no-print" onClick={onClose}>
      <div
        className="admin-modal-card table-manager-card"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="admin-badge-icon active">
              <IconColumns size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>
                Index Table & Column Manager
              </h2>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                Add more columns & edit row content directly in real-time
              </div>
            </div>
          </div>
          <button onClick={onClose} className="admin-close-btn" title="Close modal">
            <IconClose size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="table-manager-tabs">
          <button
            type="button"
            className={`table-tab-btn ${activeTab === 'columns' ? 'active' : ''}`}
            onClick={() => setActiveTab('columns')}
          >
            <IconColumns size={15} />
            <span>Table Columns ({draftColumns.length})</span>
          </button>
          <button
            type="button"
            className={`table-tab-btn ${activeTab === 'rows' ? 'active' : ''}`}
            onClick={() => setActiveTab('rows')}
          >
            <IconFileText size={15} />
            <span>Table Rows & Content ({draftExperiments.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {saveSuccess && (
            <div className="admin-success-box" style={{ marginBottom: '14px' }}>
              <IconCheck size={16} />
              <span>Table columns and content saved successfully!</span>
            </div>
          )}

          {activeTab === 'columns' ? (
            /* TAB 1: Columns Management */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Existing Columns List */}
              <div className="admin-section-card">
                <div className="admin-section-title">
                  <IconColumns size={16} style={{ color: '#38bdf8' }} />
                  <span>Current Table Columns</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {draftColumns.map((col, idx) => (
                    <div key={col.id} className="column-item-card">
                      <div className="column-item-main">
                        <span className="column-idx-badge">{idx + 1}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>
                              {col.label}
                            </span>
                            {col.urdu && (
                              <span style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'Amiri, serif' }}>
                                ({col.urdu})
                              </span>
                            )}
                            <span className={`column-type-pill ${col.isDefault ? 'default' : 'custom'}`}>
                              {col.isDefault ? 'Core' : 'Custom'}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            Width: {col.width} • Align: {col.align || 'center'}
                          </div>
                        </div>

                        {/* Delete for custom columns */}
                        {!col.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveColumn(col.id)}
                            className="btn-delete-col"
                            title="Remove this column"
                          >
                            <IconTrash size={14} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Locked</span>
                        )}
                      </div>

                      {/* Edit labels inline */}
                      <div className="column-edit-row">
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          value={col.label}
                          onChange={e => handleColumnChange(col.id, 'label', e.target.value)}
                          placeholder="Column Name"
                          title="English Column Name"
                        />
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          value={col.urdu || ''}
                          onChange={e => handleColumnChange(col.id, 'urdu', e.target.value)}
                          placeholder="Urdu Name (e.g. تاریخ)"
                          title="Urdu Column Name"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Column Form */}
              <div className="admin-section-card">
                <div className="admin-section-title">
                  <IconPlus size={16} style={{ color: '#10b981' }} />
                  <span>Add New Column to Table</span>
                </div>

                {colError && <div className="admin-error-box">{colError}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Column Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Date, Signature, Marks"
                        value={newColLabel}
                        onChange={e => setNewColLabel(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Urdu Title (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. تاریخ, دستخط"
                        value={newColUrdu}
                        onChange={e => setNewColUrdu(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Column Width</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="12%"
                        value={newColWidth}
                        onChange={e => setNewColWidth(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Initial Row Value</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 18/08/2025, Signed, 10/10"
                        value={newColDefaultVal}
                        onChange={e => setNewColDefaultVal(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="btn-primary"
                    style={{ padding: '9px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <IconPlus size={15} />
                    <span>Add Column to Table</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Rows & Content Editor */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Edit content for each question in the Index Table
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}
                >
                  <IconPlus size={14} />
                  <span>Add Question Row</span>
                </button>
              </div>

              {draftExperiments.map((exp, idx) => (
                <div key={exp.id || idx} className="row-editor-card">
                  <div className="row-editor-header">
                    <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '13px' }}>
                      Question {exp.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(exp.id)}
                      className="btn-delete-row"
                      title="Delete this row"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Program Name / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.title || ''}
                      onChange={e => handleExpChange(exp.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={exp.description || ''}
                      onChange={e => handleExpChange(exp.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Page Number</label>
                      <input
                        type="number"
                        className="form-input"
                        value={exp.page || 1}
                        onChange={e => handleExpChange(exp.id, 'page', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Remarks</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.remarks || 'Completed'}
                        onChange={e => handleExpChange(exp.id, 'remarks', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Dynamic inputs for any custom columns */}
                  {draftColumns.filter(c => !c.isDefault).length > 0 && (
                    <div className="custom-cols-box">
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>
                        Custom Columns for Q{exp.id}:
                      </div>
                      <div className="form-grid-2">
                        {draftColumns.filter(c => !c.isDefault).map(c => (
                          <div key={c.id} className="form-group">
                            <label className="form-label">{c.label}</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder={`Enter ${c.label}`}
                              value={exp.customData?.[c.id] ?? exp[c.id] ?? c.defaultValue ?? ''}
                              onChange={e => handleExpCustomChange(exp.id, c.id, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="admin-modal-footer">
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{ flex: 1, padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <IconSave size={15} />
            <span>Save Table Changes</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '10px 14px', fontSize: '12px', color: '#ef4444' }}
            title="Reset table to initial 4 columns"
          >
            <IconRotateCcw size={14} />
            <span>Reset Table</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '12.5px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
