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
    Progress, 
    Label 
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Link } from "react-router-dom";

// Hooks and Components
import { useEmployeesBase } from "../../Components/Hooks/employee/useEmployeebase";
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
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);

  // Fetch employees for the search filter
  const { data: employees, isLoading: loadingEmployees } = useEmployeesBase();

  /**
   * Handles selecting an employee from the search dropdown.
   * Pre-fills the wizard and unlocks all steps.
   */
  const handleSelectEmployee = (selectedOption: any) => {
    if (selectedOption) {
      const emp = selectedOption.value;
      setEmployeeId(emp.id);
      setEmployeeName(emp.full_name || `${emp.first_name} ${emp.last_name}`);
      setSelectedEmployeeData(emp);
      // Unlock all steps if an existing employee is selected
      setPassedSteps([1, 2, 3, 4, 5, 6, 7]);
    } else {
      // Reset wizard to "New Employee" mode
      setEmployeeId(null);
      setEmployeeName("New Employee");
      setSelectedEmployeeData(null);
      setPassedSteps([1]);
      setActiveTab(1);
    }
  };

  /**
   * Progresses the wizard and updates the global employee context
   */
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
        {/* Breadcrumbs */}
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

        {/* Search & Filter Section with Solid Background fix */}
        <Row className="mb-4 justify-content-center">
          <Col lg={12}>
            <Card className="border-0 shadow-sm bg-white" style={{ zIndex: 1001 }}>
              <CardBody className="p-3">
                <Row className="align-items-center">
                  <Col md={8}>
                    <Label className="fw-bold text-primary mb-1">
                      <i className="ri-search-eye-line me-1"></i> Quick Search Existing Employee
                    </Label>
                    <Select
                      isClearable
                      isLoading={loadingEmployees}
                      placeholder="Type name or Payroll ID to resume onboarding..."
                      options={employees?.map((e: any) => ({
                        label: `[${e.employee_code || 'NEW'}] ${e.first_name} ${e.last_name}`,
                        value: e
                      }))}
                      onChange={handleSelectEmployee}
                      maxMenuHeight={250}
                      classNamePrefix="react-select"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999, backgroundColor: "white" }),
                        control: (provided) => ({ ...provided, backgroundColor: "white" })
                      }}
                    />
                  </Col>
                  <Col md={4} className="text-md-end mt-2 mt-md-0 d-none d-md-block">
                    <div className="text-muted fs-12 italic">
                       Search results are synced with central database.
                    </div>
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
                  <div className="alert alert-light border-start border-primary mb-4 shadow-sm py-2">
                    <div className="d-flex align-items-center">
                      <i className="ri-user-follow-line text-primary fs-20 me-3"></i>
                      <div>
                        Currently managing: <span className="fw-bold text-primary">{employeeName}</span> 
                        <span className="ms-2 badge bg-primary-subtle text-primary">ID: {employeeId}</span>
                      </div>
                    </div>
                  </div>
                )}

                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <Step1Primary onNext={handleNext} existingData={selectedEmployeeData} />
                  </TabPane>
                  
                  <TabPane tabId={2}>
                    <Step2Employment 
                      employeeId={employeeId} 
                      existingData={selectedEmployeeData} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  </TabPane>
                  
                  <TabPane tabId={3}>
                    <Step3Contact 
                      employeeId={employeeId} 
                      existingData={selectedEmployeeData} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  </TabPane>
                  
                  <TabPane tabId={4}>
                    <Step4Emergency 
                      employeeId={employeeId} 
                      existingData={selectedEmployeeData} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  </TabPane>
                  
                  <TabPane tabId={5}>
                    <Step5Bank 
                      employeeId={employeeId} 
                      existingData={selectedEmployeeData} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  </TabPane>
                  
                  <TabPane tabId={6}>
                    <Step6Salary 
                      employeeId={employeeId} 
                      existingData={selectedEmployeeData} 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  </TabPane>
                  
                  <TabPane tabId={7}>
                    <Step7Success 
                      employeeId={employeeId} 
                      employeeName={employeeName} 
                      onJumpToStep={jumpToStep} 
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