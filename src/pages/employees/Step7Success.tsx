import React from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";

interface Step7Props {
  employeeId: number | null;
  employeeName: string;
  onJumpToStep: (step: number) => void;
}

const Step7Success = ({ employeeId, employeeName, onJumpToStep }: Step7Props) => {
  return (
    <div className="text-center py-4">
      <div className="mb-4">
        <lord-icon
          src="https://cdn.lordicon.com/lupuorrc.json"
          trigger="loop"
          colors="primary:#0ab39c,secondary:#405189"
          style={{ width: "120px", height: "120px" }}
        ></lord-icon>
      </div>
      <h5>Onboarding Complete!</h5>
      <p className="text-muted">
        The employee profile for <b>{employeeName}</b> has been successfully created and synchronized with the payroll and HR systems.
      </p>

      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Card className="border shadow-none bg-light-subtle">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <span className="fw-semibold text-uppercase fs-12 text-muted">Summary of Records</span>
                <Badge color="success">Active Status</Badge>
              </div>
              
              <Row className="text-start g-3">
                <Col md={4}>
                  <p className="text-muted mb-1 fs-11 text-uppercase">Identification</p>
                  <h6 className="fs-13">{employeeName}</h6>
                  <Button color="link" className="p-0 fs-12" onClick={() => onJumpToStep(1)}>Edit Primary Info</Button>
                </Col>
                <Col md={4}>
                  <p className="text-muted mb-1 fs-11 text-uppercase">Organization</p>
                  <h6 className="fs-13">Assigned to Dept/Role</h6>
                  <Button color="link" className="p-0 fs-12" onClick={() => onJumpToStep(2)}>Adjust Placement</Button>
                </Col>
                <Col md={4}>
                  <p className="text-muted mb-1 fs-11 text-uppercase">Statutory</p>
                  <h6 className="fs-13">Tax & Banking Ready</h6>
                  <Button color="link" className="p-0 fs-12" onClick={() => onJumpToStep(6)}>Update Salary</Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <div className="d-flex gap-2 justify-content-center mt-4">
        <Link to="/apps-hr-employee-list" className="btn btn-primary">
          <i className="ri-list-check me-1"></i> View Employee Directory
        </Link>
        <Button color="soft-success" onClick={() => window.location.reload()}>
          <i className="ri-user-add-line me-1"></i> Onboard Another
        </Button>
      </div>
    </div>
  );
};

export default Step7Success;