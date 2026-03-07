import React, { useState, useRef } from "react";
import {
  Card, CardBody, Col, Row, Container, Input, Label, Button, 
  Nav, NavItem, NavLink, TabContent, TabPane, FormFeedback, Spinner, Alert
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCompany, useCompanyMutation } from "../../../../Components/Hooks/useCompany";
import { handleBackendErrors } from "../../../../helpers/form_utils";

const CompanySettings = () => {
  const { data: company, isLoading } = useCompany();
  const { updateCompany, isUpdating } = useCompanyMutation();
  
  const [activeTab, setActiveTab] = useState("1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const UPLOAD_URL = `${process.env.REACT_APP_API_URL}/static/uploads/logo`;
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: company?.name || "",
      prefix: company?.prefix || "",
      address: company?.address || "",
      contact_email: company?.contact_email || "",
      contact_phone: company?.contact_phone || "",
      fiscal_year_start: company?.fiscal_year_start || "",
      logo: null as File | null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Organization name is required"),
      contact_email: Yup.string().email().required("Email is required"),
      contact_phone: Yup.string().required("Phone is required"),
    }),
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        // Dirty checking logic here...
        await updateCompany(values);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Construct URL for existing logo from Flask static folder
  const currentLogoUrl = company?.logo_url && company.logo_url !== 'default.jpg' 
    ? `${process.env.REACT_APP_API_URL}/static/uploads/logo/${company.logo_url}`
    : "/assets/images/users/multi-user.jpg"; // Placeholder

  if (isLoading) return <Spinner color="primary" className="m-5" />;

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            {/* Header Section */}
            <Card className="mt-n4 mx-n4 border-0 rounded-0 bg-soft-primary">
              <CardBody className="pb-0 px-4">
                <Row className="mb-3">
                  <Col md="auto">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                      <img
                        src={logoPreview || currentLogoUrl}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt="user-profile"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <input 
                          id="profile-img-file-input" 
                          type="file" 
                          ref={fileInputRef}
                          className="profile-img-file-input" 
                          onChange={handleLogoChange} 
                        />
                        <label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                          <span className="avatar-title rounded-circle bg-light text-body shadow">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="p-2">
                      <h3 className="text-white mb-1">{company?.name || "Register Organization"}</h3>
                      <p className="text-white-75">ID Prefix: <span className="fw-bold">{company?.prefix}</span></p>
                      <div className="hstack text-white-75 gap-3">
                        <div><i className="ri-building-line me-1 align-bottom"></i> {company?.address}</div>
                        <div><i className="ri-mail-line me-1 align-bottom"></i> {company?.contact_email}</div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Tab Navigation */}
                <Nav tabs className="nav-tabs-custom border-bottom-0">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => toggleTab("1")}
                      style={{ cursor: "pointer" }}
                    >
                      General Info
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => toggleTab("2")}
                      style={{ cursor: "pointer" }}
                    >
                      Fiscal & Compliance
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-4">Organization Details</h5>
                    <form onSubmit={formik.handleSubmit}>
                      <Row className="g-3">
                        <Col lg={6}>
                          <Label>Legal Name</Label>
                          <Input {...formik.getFieldProps("name")} invalid={!!formik.errors.name} />
                          <FormFeedback>{formik.errors.name}</FormFeedback>
                        </Col>
                        <Col lg={6}>
                          <Label>ID Prefix (for Employee IDs)</Label>
                          <Input {...formik.getFieldProps("prefix")} />
                        </Col>
                        <Col lg={6}>
                          <Label>Contact Email</Label>
                          <Input {...formik.getFieldProps("contact_email")} />
                        </Col>
                        <Col lg={6}>
                          <Label>Contact Phone</Label>
                          <Input {...formik.getFieldProps("contact_phone")} placeholder="+254..." />
                        </Col>
                        <Col lg={12}>
                          <Label>Headquarters Address</Label>
                          <Input type="textarea" rows={3} {...formik.getFieldProps("address")} />
                        </Col>
                        <Col lg={12} className="text-end">
                          <Button color="primary" type="submit" disabled={isUpdating}>
                            {isUpdating ? <Spinner size="sm" /> : "Save Changes"}
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
              </TabPane>

              <TabPane tabId="2">
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-4">Fiscal Configuration</h5>
                    <Row>
                      <Col lg={4}>
                        <Label>Fiscal Year Start Date</Label>
                        <Input 
                          type="date" 
                          {...formik.getFieldProps("fiscal_year_start")} 
                          className="form-control"
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanySettings;