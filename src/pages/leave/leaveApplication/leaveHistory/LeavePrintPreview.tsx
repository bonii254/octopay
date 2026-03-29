import React, { useMemo, useRef } from "react";
import { Modal, ModalBody, ModalFooter, Button, Row, Col, Table } from "reactstrap";
import html2pdf from "html2pdf.js";
import { useGetCompany } from "../../../../Components/Hooks/useCompanyProfile";
import logoDark from "../../../../assets/images/logo-sm.png"; 

interface PrintPreviewProps {
  show: boolean;
  onClose: () => void;
  data: any;
}

const BE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LeavePrintPreview = ({ show, onClose, data }: PrintPreviewProps) => {
  const { data: companyRes } = useGetCompany();
  const company = companyRes;
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!printRef.current) return;

    const element = printRef.current;
    
    // Configure PDF options
    const opt = {
      margin:       10, // 10mm margins
      filename:     `Leave_Advice_${data?.employee_name?.replace(/\s+/g, '_') || 'Note'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true }, // scale: 2 gives high resolution, useCORS handles external logos
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    } as const;

    html2pdf().set(opt).from(element).save();
  };

  const logoSrc = useMemo(() => {
    if (company?.logo_url && company.logo_url !== 'default.jpg') {
      return `${BE_URL}/static/uploads/logo/${company.logo_url}?t=${new Date().getTime()}`;
    }
    return logoDark;
  }, [company?.logo_url]);

  if (!data) return null;

  return (
    <Modal isOpen={show} toggle={onClose} size="lg" centered>
      <ModalBody className="p-0 bg-light">
        {/* Document Container - Styled to look like an A4 paper in the preview */}
        <div 
          ref={printRef}
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            color: "#333",
            fontFamily: "Arial, sans-serif"
          }}
        >
          {/* --- HEADER (Letterhead Style) --- */}
          <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
            <div className="d-flex align-items-center">
              <img 
                src={logoSrc} 
                alt="Company Logo" 
                style={{ height: '70px', objectFit: 'contain', marginRight: '20px' }}
                crossOrigin="anonymous"
                onError={(e) => { (e.target as HTMLImageElement).src = logoDark; }}
              />
              <div>
                <h3 className="fw-bolder mb-1 text-uppercase" style={{ color: "#2c3e50" }}>
                  {company?.name || "ORGANIZATION NAME"}
                </h3>
                <div className="text-muted fs-13">
                  {company?.address && <p className="mb-0">{company.address}</p>}
                  <p className="mb-0">
                    {company?.contact_email && `Email: ${company.contact_email}`} 
                    {company?.prefix && ` | PIN: ${company.prefix}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- DOCUMENT TITLE & META --- */}
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "1px" }}>LEAVE ADVICE NOTE</h4>
            </div>
            <div className="text-end fs-13 text-muted">
              <p className="mb-1"><strong>Ref:</strong> LEAVE/{data.id}/{new Date().getFullYear()}</p>
              <p className="mb-0"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* --- DATA TABLE --- */}
          <Table bordered style={{ borderColor: "#dee2e6" }} className="mb-5 align-middle">
            <tbody>
              <tr>
                <td className="bg-light fw-bold" style={{ width: '20%', color: "#495057" }}>Employee Name</td>
                <td style={{ width: '30%' }} className="fw-medium">{data.employee_name}</td>
                <td className="bg-light fw-bold" style={{ width: '20%', color: "#495057" }}>Payroll No.</td>
                <td style={{ width: '30%' }}>{data.employee_payroll || 'N/A'}</td>
              </tr>
              <tr>
                <td className="bg-light fw-bold" style={{ color: "#495057" }}>Leave Type</td>
                <td colSpan={3}>{data.leave_type_name}</td>
              </tr>
              <tr>
                <td className="bg-light fw-bold" style={{ color: "#495057" }}>Duration</td>
                <td colSpan={3}>
                  <span className="fw-bold" style={{ color: "#2c3e50" }}>{data.applied_days} Working Days</span>
                  <span className="ms-2 text-muted">
                    ({data.start_date} to {data.end_date})
                  </span>
                </td>
              </tr>
              <tr>
                <td className="bg-light fw-bold" style={{ color: "#495057" }}>Resumption Date</td>
                <td colSpan={3} className="fw-medium">{data.resumption_date || 'The next regular working day'}</td>
              </tr>
            </tbody>
          </Table>

          {/* --- SIGNATURE SECTION --- */}
          <div className="mt-5 pt-3">
            <Row className="gy-5">
              <Col xs={6}>
                <div style={{ paddingRight: "30px" }}>
                  <p className="fw-bold mb-5" style={{ color: "#495057" }}>Employee Signature</p>
                  <div style={{ borderTop: "1px solid #000", width: "100%", marginBottom: "5px" }}></div>
                  <small className="text-muted">Date: ____/____/_______</small>
                </div>
              </Col>
              <Col xs={6}>
                <div style={{ paddingRight: "30px" }}>
                  <p className="fw-bold mb-5" style={{ color: "#495057" }}>Manager / HOD Approval</p>
                  <div style={{ borderTop: "1px solid #000", width: "100%", marginBottom: "5px" }}></div>
                  <small className="text-muted">Date: ____/____/_______</small>
                </div>
              </Col>
              <Col xs={6}>
                <div style={{ paddingRight: "30px" }}>
                  <p className="fw-bold mb-5" style={{ color: "#495057" }}>HR Authorization</p>
                  <div style={{ borderTop: "1px solid #000", width: "100%", marginBottom: "5px" }}></div>
                  <small className="text-muted">Date: ____/____/_______</small>
                </div>
              </Col>
              <Col xs={6}>
                <div 
                  className="rounded text-center bg-light" 
                  style={{ 
                    border: '2px dashed #adb5bd', 
                    height: '120px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '30px'
                  }}
                >
                  <span className="text-muted text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
                    Official Stamp
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          {/* --- FOOTER --- */}
          <div className="mt-5 pt-4 text-center">
            <div style={{ borderTop: "1px solid #dee2e6", width: "100%", margin: "0 auto 10px auto" }}></div>
            <small className="text-muted fs-12">
              Generated securely by Payroll System | {new Date().toLocaleString()}
            </small>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter className="bg-light border-top-0">
        <Button color="light" onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleExportPDF} className="px-4">
          <i className="ri-download-2-line me-1"></i> Download PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LeavePrintPreview;