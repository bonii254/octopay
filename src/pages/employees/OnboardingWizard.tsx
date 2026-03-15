import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Progress, Label } from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Link, useParams } from "react-router-dom";

import { useEmployeesBase } from "../../Components/Hooks/employee/useEmployeebase";
import Step1Primary from "./Step1Primary";
import Step2Employment from "./Step2Employment";
import Step3Contact from "./Step3Contact";
import Step4Emergency from "./Step4Emergency";
import Step5Bank from "./Step5Bank";
import Step6Salary from "./Step6Salary";
import Step7Success from "./Step7Success";

const OnboardingWizard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [passedSteps, setPassedSteps] = useState<number[]>([1]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("New Employee");
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);

  const { data: employees } = useEmployeesBase();

  const customSelectStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      zIndex: 9999,
      border: "1px solid #ebedf2",
      boxShadow: "0 5px 10px rgba(30, 32, 37, 0.12)"
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#405189" 
        : state.isFocused 
        ? "#f3f6f9" 
        : "white",
      color: state.isSelected ? "white" : "#212529",
      cursor: "pointer"
    }),
  };

  React.useEffect(() => {
    if (id && employees && employees.length > 0) {
      const emp = employees.find((e: any) => e.id.toString() === id.toString());
      if (emp) {
        setEmployeeId(emp.id);
        setEmployeeName(emp.full_name || `${emp.first_name} ${emp.last_name}`);
        setSelectedEmployeeData(emp);
        setPassedSteps([1, 2, 3, 4, 5, 6, 7]);
      }
    }
  }, [id, employees]);

  const handleSelectEmployee = (selectedOption: any) => {
    if (selectedOption) {
      const emp = selectedOption.value;
      setEmployeeId(emp.id);
      setEmployeeName(emp.full_name || `${emp.first_name} ${emp.last_name}`);
      setSelectedEmployeeData(emp);
      setPassedSteps([1, 2, 3, 4, 5, 6, 7]);
    } else {
      resetWizard();
    }
  };

  const resetWizard = () => {
    setEmployeeId(null);
    setEmployeeName("New Employee");
    setSelectedEmployeeData(null);
    setPassedSteps([1]);
    setActiveTab(1);
  };

  const handleNext = (id?: number, name?: string, rawData?: any) => {
    if (id) setEmployeeId(id);
    if (name) setEmployeeName(name);
    if (rawData) setSelectedEmployeeData(rawData); 

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
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm bg-light-subtle">
              <CardBody className="p-3">
                <Row className="align-items-center">
                  <Col md={6}>
                    <Label className="fw-bold text-primary mb-1">Search Existing Employee</Label>
                    <Select
                      isClearable
                      placeholder="Filter by Name or Payroll ID..."
                      options={employees?.map((e: any) => ({
                        label: `[${e.employee_code}] ${e.first_name} ${e.last_name}`,
                        value: e
                      }))}
                      onChange={handleSelectEmployee}
                      maxMenuHeight={200}
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body} 
                      styles={customSelectStyles}
                    />
                  </Col>
                  <Col md={6} className="text-md-end mt-2 mt-md-0">
                    <span className="text-muted fs-12 italic">
                       Quick Edit: Select a record to skip directly to specific sections.
                    </span>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="p-4">
                <div className="progress-nav mb-5 position-relative">
                  <Progress 
                    value={((activeTab - 1) / 6) * 100} 
                    style={{ height: "2px", position: "absolute", top: "20px", left: "0", right: "0", zIndex: 1 }} 
                    color="primary" 
                  />
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
                      <NavItem key={item.step} className="bg-white">
                        <NavLink
                          className={classnames("d-flex flex-column align-items-center border-0 bg-transparent p-0", {
                            active: activeTab === item.step,
                            done: passedSteps.includes(item.step) && activeTab !== item.step,
                          })}
                          onClick={() => { if (passedSteps.includes(item.step)) jumpToStep(item.step); }}
                          disabled={!passedSteps.includes(item.step)}
                          tag="button"
                          style={{ minWidth: "80px" }}
                        >
                          <div 
                            className={classnames("step-icon d-flex align-items-center justify-content-center rounded-circle mb-2 transition-all",
                              activeTab === item.step ? "bg-primary text-white" : passedSteps.includes(item.step) ? "bg-success text-white" : "bg-light text-muted"
                            )}
                            style={{ width: "40px", height: "40px", border: activeTab === item.step ? "4px solid #eff2f7" : "4px solid white" }}
                          >
                            <i className={`${item.icon} fs-5`}></i>
                          </div>
                          <span className={classnames("d-none d-sm-block fs-13 fw-medium", activeTab === item.step ? "text-primary" : "text-muted")}>
                            {item.label}
                          </span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </div>
                {employeeId && activeTab < 7 && (
                  <div className="alert alert-light border-start border-primary mb-4 shadow-sm">
                    <div className="d-flex align-items-center">
                      <i className="ri-user-follow-line text-primary fs-20 me-3"></i>
                      <div>Editing Record: <span className="fw-bold text-primary">{employeeName}</span></div>
                    </div>
                  </div>
                )}

                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}><Step1Primary onNext={handleNext} existingData={selectedEmployeeData} /></TabPane>
                  <TabPane tabId={2}><Step2Employment employeeId={employeeId} existingData={selectedEmployeeData} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={3}><Step3Contact employeeId={employeeId} existingData={selectedEmployeeData} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={4}><Step4Emergency employeeId={employeeId} existingData={selectedEmployeeData} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={5}><Step5Bank employeeId={employeeId} existingData={selectedEmployeeData} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={6}><Step6Salary employeeId={employeeId} existingData={selectedEmployeeData} onNext={handleNext} onBack={handleBack} /></TabPane>
                  <TabPane tabId={7}>
                    <Step7Success 
                      employeeId={employeeId} 
                      employeeName={employeeName}
                      existingData={selectedEmployeeData}
                      onJumpToStep={jumpToStep}
                      onResetWizard={resetWizard}
                    />
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