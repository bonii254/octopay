import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

import CompanyProfile from "./components/company/CompanyProfile";
import CompanyStructureSettings from "./components/department/CompanyStructureSettings";
import StatutoryConfig from "./components/StatutoryConfig";
import PayrollMaster from "./components/PayrollMaster";
import LeaveLoanRules from "./components/LeaveLoanRules";

const SettingsHub = () => {
  const [activeTab, setActiveTab] = useState("1");

  const getActiveTitle = () => {
    switch (activeTab) {
      case "1":
        return "Company Profile";
      case "2":
        return "Organizational Structure";
      case "3":
        return "User Roles & Permissions";
      case "4":
        return "Statutory Configuration";
      case "5":
        return "Payroll Components";
      case "6":
        return "Leave & Loan Rules";
      default:
        return "Settings";
    }
  };

  const toggleTab = (tab: string): void => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* 1. Page Header with Breadcrumbs */}
        <Row>
          <Col xs={12}>
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">System Configuration</h4>
              <div className="page-title-right">
                <Breadcrumb listClassName="m-0">
                  <BreadcrumbItem>
                    <Link to="/dashboard">Dashboard</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>Settings</BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {/* 2. LEFT SIDEBAR: Navigation */}
          <Col lg={3}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Settings Menu</h5>
              </CardHeader>
              <CardBody>
                <Nav pills vertical className="nav-pills-custom">
                  {/* Section: Organization */}
                  <div className="p-2 text-muted text-uppercase fw-bold fs-12 mb-1">
                    Organization
                  </div>

                  <NavItem className="mb-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "1",
                        "text-body": activeTab !== "1",
                      })}
                      onClick={() => toggleTab("1")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-building-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Company Profile</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Logo, Address, Contact Info
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "2",
                        "text-body": activeTab !== "2",
                      })}
                      onClick={() => toggleTab("2")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-node-tree fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Structure</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Departments & Designations
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-3">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "3",
                        "text-body": activeTab !== "3",
                      })}
                      onClick={() => toggleTab("3")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-shield-user-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">User Roles</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Access Control & Admins
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  {/* Section: Payroll */}
                  <div className="p-2 text-muted text-uppercase fw-bold fs-12 mb-1 border-top">
                    Payroll & Finance
                  </div>

                  <NavItem className="mb-2 mt-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "4",
                        "text-body": activeTab !== "4",
                      })}
                      onClick={() => toggleTab("4")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-government-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Statutory</h5>
                          <p className="mb-0 fs-12 text-muted">
                            KRA, NSSF, NHIF Rates
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-3">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "5",
                        "text-body": activeTab !== "5",
                      })}
                      onClick={() => toggleTab("5")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-money-dollar-box-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Pay Components</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Earnings, Deductions & Tax
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  {/* Section: HR */}
                  <div className="p-2 text-muted text-uppercase fw-bold fs-12 mb-1 border-top">
                    HR Rules
                  </div>

                  <NavItem className="mb-2 mt-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "6",
                        "text-body": activeTab !== "6",
                      })}
                      onClick={() => toggleTab("6")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-calendar-check-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Leave & Loans</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Policies & Entitlements
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </Card>
          </Col>

          {/* 3. RIGHT CONTENT AREA */}
          <Col lg={9}>
            <Card>
              <CardHeader className="align-items-center d-flex">
                {/* Dynamic Header based on selection */}
                <h4 className="card-title mb-0 flex-grow-1">
                  {getActiveTitle()}
                </h4>
                <div className="flex-shrink-0">
                  {/* Optional: Add a 'Save' or 'Action' button common to all tabs here if needed */}
                </div>
              </CardHeader>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <CompanyProfile />
                  </TabPane>
                  <TabPane tabId="2">
                    <CompanyStructureSettings />
                  </TabPane>
                  <TabPane tabId="3">
                    <div className="text-center p-5">
                      <i className="ri-shield-user-line display-5 text-muted mb-3"></i>
                      <h5>User Roles Component</h5>
                      <p className="text-muted">
                        Manage system administrators and user access levels
                        here.
                      </p>
                    </div>
                  </TabPane>
                  <TabPane tabId="4">
                    <StatutoryConfig />
                  </TabPane>
                  <TabPane tabId="5">
                    <PayrollMaster />
                  </TabPane>
                  <TabPane tabId="6">
                    <LeaveLoanRules />
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

export default SettingsHub;