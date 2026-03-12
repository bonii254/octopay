import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Progress } from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

import Step1Primary from "./Step1Primary";
import Step2Employment from "./Step2Employment";
import Step3Contact from "./Step3Contact";
import Step4Emergency from "./Step4Emergency";
import Step5Bank from "./Step5Bank";
import Step6Salary from "./Step6Salary";
import Step7Success from "./Step7Success";

const OnboardingWizard = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [passedSteps, setPassedSteps] = useState<number[]>([1]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("New Employee");

  const handleNext = (id?: number, name?: string) => {
    if (id) setEmployeeId(id);
    if (name) setEmployeeName(name);

    const nextTab = activeTab + 1;
    if (nextTab <= 7) {
      if (!passedSteps.includes(nextTab)) {
        setPassedSteps([...passedSteps, nextTab]);
      }
      setActiveTab(nextTab);
    }
  };

  const handleBack = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  const jumpToStep = (step: number) => {
    setActiveTab(step);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Employee Onboarding Wizard</h4>
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
                {/* FIX: Added wrapper div with relative positioning for the progress line.
                  The Nav is set to justify-content-between to spread items evenly.
                */}
                <div className="progress-nav mb-5 position-relative">
                  <Progress 
                    value={((activeTab - 1) / 6) * 100} 
                    style={{ height: "2px", position: "absolute", top: "20px", left: "0", right: "0", zIndex: 1 }} 
                    color="primary" 
                  />
                  
                  {/* FIX: justify-content-between to span full width, position-relative/z-index-2 to sit above line */}
                  <Nav className="nav-pills progress-bar-tab custom-nav justify-content-between position-relative z-2" role="tablist">
                    {[
                      { step: 1, icon: "ri-user-2-line", label: "Primary" },
                      { step: 2, icon: "ri-building-line", label: "Job" },
                      { step: 3, icon: "ri-contacts-book-line", label: "Contact" },
                      { step: 4, icon: "ri-heart-pulse-line", label: "Emergency" },
                      { step: 5, icon: "ri-bank-card-line", label: "Bank" },
                      { step: 6, icon: "ri-money-dollar-circle-line", label: "Salary" },
                      { step: 7, icon: "ri-checkbox-circle-line", label: "Finish" },
                    ].map((item) => (
                      <NavItem key={item.step} className="bg-white"> {/* bg-white blocks out the line behind the icon */}
                        <NavLink
                          className={classnames(
                            "d-flex flex-column align-items-center border-0 bg-transparent p-0", // Clean up default padding/borders
                            {
                              active: activeTab === item.step,
                              done: passedSteps.includes(item.step) && activeTab !== item.step,
                            }
                          )}
                          onClick={() => { if (passedSteps.includes(item.step)) jumpToStep(item.step); }}
                          disabled={!passedSteps.includes(item.step)}
                          tag="button"
                          style={{ minWidth: "80px" }} // Gives enough width so text doesn't squish
                        >
                          {/* FIX: The icon container needs a solid background and explicit sizing 
                            to look like a corporate step indicator. 
                          */}
                          <div 
                            className={classnames(
                              "step-icon d-flex align-items-center justify-content-center rounded-circle mb-2 transition-all",
                              activeTab === item.step ? "bg-primary text-white" : passedSteps.includes(item.step) ? "bg-success text-white" : "bg-light text-muted"
                            )}
                            style={{ width: "40px", height: "40px", border: activeTab === item.step ? "4px solid #eff2f7" : "4px solid white" }}
                          >
                            <i className={`${item.icon} fs-5`}></i>
                          </div>
                          
                          {/* FIX: text-nowrap forces the word onto a single line */}
                          <span className={classnames(
                            "d-none d-sm-block fs-13 fw-medium text-nowrap",
                            activeTab === item.step ? "text-primary" : passedSteps.includes(item.step) ? "text-success" : "text-muted"
                          )}>
                            {item.label}
                          </span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </div>

                {/* Session Identity Banner */}
                {employeeId && activeTab < 7 && (
                  <div className="alert alert-light border-start border-start-width-3 border-primary mb-4 shadow-sm" role="alert">
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                            <i className="ri-user-follow-line text-primary fs-20"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            Currently Onboarding: <span className="fw-bold text-primary">{employeeName}</span> 
                            <span className="text-muted ms-2 fs-12">(System ID: {employeeId})</span>
                        </div>
                    </div>
                  </div>
                )}

                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}><Step1Primary onNext={handleNext} /></TabPane>
                  <TabPane tabId={2}><Step2Employment employeeId={employeeId} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={3}><Step3Contact employeeId={employeeId} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={4}><Step4Emergency employeeId={employeeId} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={5}><Step5Bank employeeId={employeeId} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={6}><Step6Salary employeeId={employeeId} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={7}><Step7Success employeeId={employeeId} employeeName={employeeName} onJumpToStep={jumpToStep} /></TabPane>
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