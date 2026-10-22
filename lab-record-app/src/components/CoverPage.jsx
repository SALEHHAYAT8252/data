import React from 'react';

export default function CoverPage({ data = {}, student = {} }) {
  const rollNo = student?.rollNo !== undefined ? student.rollNo : (data?.defaultStudent?.rollNo ?? '');
  const name = student?.name !== undefined ? student.name : (data?.defaultStudent?.name ?? '');
  const enrollmentNo = student?.enrollmentNo !== undefined ? student.enrollmentNo : (data?.defaultStudent?.enrollmentNo ?? '');

  return (
    <div className="a4-page" id="page-cover">
      <div className="academic-border">
        {/* Top Titles */}
        <div className="cover-top-title">A Lab Manual For</div>
        <div className="cover-lab-title">{data?.labTitle || 'DATA SCIENCE LAB'}</div>
        <div className="cover-top-roll">{rollNo || '25MMCA019HY'}</div>

        {/* Requirements */}
        <div className="cover-requirement">
          A RECORD SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR “{data?.labTitle || 'DATA SCIENCE LAB'}” OF
        </div>
        <div className="cover-degree">{data?.course || 'MASTER OF COMPUTER APPLICATION'}</div>
        <div className="cover-sem">{data?.semester || '2ND Year /3RD Semester'}</div>
        <div className="cover-year">{data?.academicYear || '2025-26'}</div>

        {/* By Student */}
        <div className="cover-by-section">
          <div className="cover-by">By</div>
          <div className="cover-student-name">{name || 'SALEH HAYAT'}</div>
          <div className="cover-student-meta">
            Roll Number: <span className="roll-hl">{rollNo || '25MMCA019HY'}</span>
          </div>
          <div className="cover-student-meta">
            Enrolment Number: {enrollmentNo || 'A250017'}
          </div>
        </div>

        {/* Submitted To */}
        <div className="cover-submitted-section">
          <div className="cover-submitted-to">Submitted to</div>
          <div className="cover-supervisor-name">{data?.submittedTo?.name || 'Mr. Kamran Siddiqui'}</div>
          <div className="cover-supervisor-desig">{data?.submittedTo?.designation || 'Assistant Professor'}</div>
          <div className="cover-supervisor-dept">{data?.submittedTo?.department || 'Department of CS & IT, MANUU'}</div>
        </div>

        {/* University Logo */}
        <div className="cover-logo-wrapper">
          {data?.logoBase64 && (
            <img
              src={data.logoBase64}
              alt="Maulana Azad National Urdu University Logo"
              className="cover-logo-img"
            />
          )}
        </div>

        {/* University Footer Section */}
        <div className="cover-footer-school">{data?.school || 'SCHOOL OF TECHNOLOGY'}</div>
        <div className="cover-footer-dept">{data?.department || 'DEPARTMENT OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY'}</div>
        <div className="cover-footer-uni">{data?.university || 'MAULANA AZAD NATIONAL URDU UNIVERSITY'}</div>
        <div className="cover-footer-sub">{data?.universitySub || '(A Central University established by an Act of Parliament in 1998)'}</div>
        <div className="cover-footer-naac">{data?.accreditation || 'Accredited Grade “A+” by NAAC'}</div>
        <div className="cover-footer-addr">{data?.address || 'Gachibowli, Hyderabad-500032, T.S. www.manuu.edu.in'}</div>
      </div>
    </div>
  );
}
