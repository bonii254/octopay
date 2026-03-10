import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Progress,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";


const OnboardingWizard = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [passedSteps, setPassedSteps] = useState<number[]>([1]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("New Employee");

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleNext = (id?: number, name?: string) => {
    if (id) setEmployeeId(id);
    if (name) setEmployeeName(name);

    const nextTab = activeTab + 1;
    if (nextTab <= 6) {
      setPassedSteps([...passedSteps, nextTab]);
      setActiveTab(nextTab);
    }
  };

  const handleBack = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Employee Onboarding</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link to="/dashboard">HRM</Link></li>
                  <li className="breadcrumb-item active">Onboarding</li>
                </ol>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="p-4">
                <div className="progress-nav mb-4">
                  <Progress value={(activeTab / 6) * 100} style={{ height: "1px" }} />
                  
                  <Nav className="nav-pills progress-bar-tab custom-nav" role="tablist">
                    {[
                      { step: 1, icon: "ri-user-2-line", label: "Primary Info" },
                      { step: 2, icon: "ri-building-line", label: "Job Details" },
                      { step: 3, icon: "ri-contacts-book-line", label: "Contacts" },
                      { step: 4, icon: "ri-heart-pulse-line", label: "Emergency" },
                      { step: 5, icon: "ri-bank-card-line", label: "Banking" },
                      { step: 6, icon: "ri-money-dollar-circle-line", label: "Salary" },
                    ].map((item) => (
                      <NavItem key={item.step}>
                        <NavLink
                          className={classnames({
                            active: activeTab === item.step,
                            done: passedSteps.includes(item.step) && activeTab !== item.step,
                          })}
                          onClick={() => {
                            if (passedSteps.includes(item.step)) toggleTab(item.step);
                          }}
                          disabled={!passedSteps.includes(item.step)}
                          tag="button"
                        >
                          <div className="step-icon">
                            <i className={item.icon}></i>
                          </div>
                          <span className="d-none d-sm-block mt-2">{item.label}</span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </div>

                {employeeId && (
                  <div className="alert alert-info alert-dismissible fade show mb-4" role="alert">
                    <i className="ri-information-line me-2"></i>
                    Onboarding Session for: <strong>{employeeName}</strong> (ID: {employeeId})
                  </div>
                )}

                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <div className="text-center mb-4">
                      <h5>Primary Identification</h5>
                      <p className="text-muted">Register the basic identity and legal name of the employee.</p>
                    </div>
                  </TabPane>

                  <TabPane tabId={2}>
                    <div className="text-center mb-4">
                      <h5>Employment & Hierarchy</h5>
                      <p className="text-muted">Assign department, designation, and work shifts.</p>
                    </div>
                  </TabPane>

                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OnboardingWizard;