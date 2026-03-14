import React from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


interface Step7Props {
  employeeId: number | null;
  employeeName: string;
  onJumpToStep: (step: number) => void;
  onResetWizard?: () => void;
  existingData?: any; 
}

const Step7Success = ({ employeeId, employeeName,  onJumpToStep, onResetWizard, existingData }: Step7Props) => {
  
  const payrollNumber = existingData?.employee_code || existingData?.payroll_no || "N/A";
  const copyToClipboard = () => {
    if (payrollNumber) {
      navigator.clipboard.writeText(payrollNumber.toString());
      toast.success("Employee Payroll No copied to clipboard!");
    }
  };

  const handleReset = () => {
    if (onResetWizard) {
      onResetWizard();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="py-4">
      <div className="no-print text-center">
        <div className="mb-4">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#405189"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
        </div>

        <h4 className="fw-semibold">Onboarding Complete!</h4>
        <p className="text-muted mb-4 px-3">
          The profile for <span className="text-dark fw-bold">{employeeName || "the employee"}</span> is now active. 
          All statutory and banking records have been synchronized.
        </p>

        <Row className="justify-content-center mx-0">
          <Col md={10}>
            <Card className="border shadow-none bg-light-subtle overflow-hidden">
              <CardBody className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div className="text-start">
                    <span className="fw-semibold text-uppercase fs-12 text-muted d-block">Employee Payroll</span>
                    <h5 className="mb-0 text-primary">Payroll No: {payrollNumber || "N/A"}</h5>
                  </div>
                  <div className="d-flex gap-2">
                    <Badge color="success" className="fs-12 px-3 py-2 d-flex align-items-center">
                      <i className="ri-checkbox-circle-fill me-1"></i> Active Record
                    </Badge>
                  </div>
                </div>
                
                <Row className="text-start g-4">
                  <Col md={4}>
                    <div className="d-flex flex-column h-100">
                      <p className="text-muted mb-2 fs-11 text-uppercase fw-bold">Identification</p>
                      <h6 className="fs-14 mb-2 text-truncate">{employeeName}</h6>
                      <Button color="link" className="p-0 fs-12 text-decoration-none mt-auto text-start text-primary" onClick={() => onJumpToStep(1)}>
                        <i className="ri-edit-box-line me-1"></i> Review Identity
                      </Button>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="d-flex flex-column h-100">
                      <p className="text-muted mb-2 fs-11 text-uppercase fw-bold">Organization</p>
                      <h6 className="fs-14 mb-2">{existingData?.designation_name || "Structure Assigned"}</h6>
                      <Button color="link" className="p-0 fs-12 text-decoration-none mt-auto text-start text-primary" onClick={() => onJumpToStep(2)}>
                        <i className="ri-git-branch-line me-1"></i> Adjust Placement
                      </Button>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="d-flex flex-column h-100">
                      <p className="text-muted mb-2 fs-11 text-uppercase fw-bold">Financials</p>
                      <h6 className="fs-14 mb-2">Payroll & Tax Ready</h6>
                      <Button color="link" className="p-0 fs-12 text-decoration-none mt-auto text-start text-primary" onClick={() => onJumpToStep(6)}>
                        <i className="ri-money-dollar-box-line me-1"></i> Update Salary
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-2 justify-content-center mt-5">
          <Link to="/apps-hr-employee-list" className="btn btn-primary btn-label">
            <i className="ri-list-check label-icon align-middle fs-16 me-2"></i>
            View Directory
          </Link>
          
          <Button color="soft-info" onClick={copyToClipboard} className="btn-label">
            <i className="ri-file-copy-2-line label-icon align-middle fs-16 me-2"></i>
            Copy Payroll No
          </Button>

          <Button color="soft-success" onClick={handleReset} className="btn-label">
            <i className="ri-user-add-line label-icon align-middle fs-16 me-2"></i>
            Onboard Another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step7Success;