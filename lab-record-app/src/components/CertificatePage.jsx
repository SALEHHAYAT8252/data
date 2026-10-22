import React from 'react';

export default function CertificatePage({ data = {}, student = {} }) {
  const rollNo = student?.rollNo !== undefined ? student.rollNo : (data?.defaultStudent?.rollNo ?? '');
  const name = student?.name !== undefined ? student.name : (data?.defaultStudent?.name ?? '');

  return (
    <div className="a4-page" id="page-certificate">
      <div className="academic-border">
        {/* Top Logo */}
        <div className="cert-logo-wrapper">
          {data?.logoBase64 && (
            <img
              src={data.logoBase64}
              alt="University Logo"
              className="cert-logo-img"
            />
          )}
        </div>

        {/* Department Header */}
        <div className="cert-dept-header">
          DEPARTMENT OF<br />
          {data?.department || 'COMPUTER SCIENCE & INFORMATION TECHNOLOGY'}
        </div>

        {/* Certificate Script Heading */}
        <div className="cert-heading">Certificate</div>

        {/* Certificate Text Body */}
        <div className="cert-body-text">
          Certified that this is the Bonafide <strong>DATA SCIENCE Lab ({data?.courseCode || 'MMCA311PCT'})</strong> Record of Mr./Ms. <strong>{name || 'SALEH HAYAT'}</strong>, Roll No <strong>{rollNo || '25MMCA019HY'}</strong>, MCA II Year, III Semester, of the academic year {data?.academicYear || '2025-26'}.
        </div>

        {/* Signatures */}
        <div className="cert-signatures">
          <div className="cert-head-sig">
            <div className="cert-head-title">Head,</div>
            <div className="cert-head-title">Department of CS & IT</div>
          </div>

          <div className="cert-examiners-row">
            <div className="cert-examiner-item">
              Internal<br />Examiner
            </div>
            <div className="cert-examiner-item">
              External<br />Examiner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
