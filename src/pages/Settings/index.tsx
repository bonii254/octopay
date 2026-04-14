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


import UserManagement from "./users"

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
        return "Tax Bands";
      case "7":
        return "Leave & Loan Rules";
      case "8":
        return "Loan Types"
      case "9":
        return "Public Holidays"
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
          <Col lg={3}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Settings Menu</h5>
              </CardHeader>
              <CardBody>
                <Nav pills vertical className="nav-pills-custom">
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
                            KRA, NSSF, NHIF Rates and taxes
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
                            Earnings, Deductions
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-3">
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
                          <i className="ri-percent-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Income Tax (PAYE)</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Progressive tax brackets & bands
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <div className="p-2 text-muted text-uppercase fw-bold fs-12 mb-1 border-top">
                    HR Rules
                  </div>

                  <NavItem className="mb-2 mt-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "7",
                        "text-body": activeTab !== "7",
                      })}
                      onClick={() => toggleTab("7")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-calendar-check-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Leave</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Policies & Entitlements
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-2 mt-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "8", 
                        "text-body": activeTab !== "8",
                      })}
                      onClick={() => toggleTab("8")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-money-dollar-circle-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Loan Types</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Interest, Tenure & Limits
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem className="mb-2">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        "active bg-light text-primary": activeTab === "9",
                        "text-body": activeTab !== "9",
                      })}
                      onClick={() => toggleTab("9")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="ri-flag-line fs-18 me-3"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fs-14">Public Holidays</h5>
                          <p className="mb-0 fs-12 text-muted">
                            Statutory & Observed Dates
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </Card>
          </Col>

          <Col lg={9}>
            <Card>
              <CardHeader className="align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {getActiveTitle()}
                </h4>
                <div className="flex-shrink-0">
                </div>
              </CardHeader>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="3">
                    <UserManagement/>
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