// src/pages/Settings/components/LeaveLoanRules.tsx
import React, { useState } from "react";
import { Card, CardBody, Row, Col, ListGroup, ListGroupItem, Button, Label, Input, Form, Badge } from "reactstrap";

const LeaveLoanRules = () => {
  const [selectedType, setSelectedType] = useState<any>(null);

  // Mock Data
  const leaveTypes = [
    { id: 1, name: "Annual Leave", days: 21, accrual: true },
    { id: 2, name: "Sick Leave", days: 14, accrual: false },
    { id: 3, name: "Maternity", days: 90, accrual: false },
  ];

  return (
    <Row>
      <Col lg={4}>
        <Card>
          <CardBody>
            <div className="d-flex mb-3 align-items-center">
              <h5 className="card-title flex-grow-1 mb-0">Leave Types</h5>
              <Button size="sm" color="soft-primary">+ Add</Button>
            </div>
            <ListGroup>
              {leaveTypes.map((type) => (
                <ListGroupItem 
                  key={type.id} 
                  action 
                  active={selectedType?.id === type.id}
                  onClick={() => setSelectedType(type)}
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                >
                  {type.name}
                  {type.accrual && <Badge color="info" pill>Accrual</Badge>}
                </ListGroupItem>
              ))}
            </ListGroup>
          </CardBody>
        </Card>
        
        {/* Placeholder for Loan Types List below */}
        <Card>
            <CardBody>
                <h5 className="card-title">Loan Types</h5>
                {/* Similar ListGroup for Loans */}
            </CardBody>
        </Card>
      </Col>

      <Col lg={8}>
        {selectedType ? (
          <Card>
            <CardBody>
              <h5 className="mb-4">Editing: {selectedType.name}</h5>
              <Form>
                <Row className="g-3">
                  <Col md={12}>
                    <Label>Leave Name</Label>
                    <Input defaultValue={selectedType.name} />
                  </Col>
                  <Col md={6}>
                    <Label>Default Days / Year</Label>
                    <Input type="number" defaultValue={selectedType.days} />
                  </Col>
                  <Col md={6}>
                    <Label>Gender Restriction</Label>
                    <select className="form-select">
                        <option>None</option>
                        <option>Female Only</option>
                        <option>Male Only</option>
                    </select>
                  </Col>
                  
                  <Col md={12} className="mt-4">
                    <h6 className="fw-medium">Accrual & Carry Forward</h6>
                    <div className="form-check form-switch mb-2">
                        <Input type="checkbox" role="switch" id="accrualSwitch" defaultChecked={selectedType.accrual} />
                        <Label className="form-check-label" htmlFor="accrualSwitch">Enable Monthly Accrual (e.g. 1.75 days/mo)</Label>
                    </div>
                    <div className="form-check form-switch mb-2">
                        <Input type="checkbox" role="switch" id="cfSwitch" />
                        <Label className="form-check-label" htmlFor="cfSwitch">Allow Carry Forward to next year</Label>
                    </div>
                    <div className="form-check form-switch">
                        <Input type="checkbox" role="switch" id="docSwitch" />
                        <Label className="form-check-label" htmlFor="docSwitch">Require Attachment (Proof)</Label>
                    </div>
                  </Col>

                  <Col md={12} className="text-end mt-4">
                    <Button color="success">Save Leave Rule</Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        ) : (
          <Card className="bg-light-subtle border-0">
             <CardBody className="p-5 text-center text-muted">
                <i className="ri-list-settings-line display-4"></i>
                <p className="mt-3">Select a Leave or Loan type to configure rules.</p>
             </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default LeaveLoanRules;