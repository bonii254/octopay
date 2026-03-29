import React, { useState, useRef, useMemo } from "react";
import {
  Card, CardBody, Col, Row, Container, Input, Label, Button, 
  Nav, NavItem, NavLink, TabContent, TabPane, FormFeedback, Spinner, Alert
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCompany, useCompanyMutation } from "../../../../Components/Hooks/useCompany";
import { handleBackendErrors } from "../../../../helpers/form_utils";

const DAYS_OF_WEEK = [
  { id: 0, name: "Monday" },
  { id: 1, name: "Tuesday" },
  { id: 2, name: "Wednesday" },
  { id: 3, name: "Thursday" },
  { id: 4, name: "Friday" },
  { id: 5, name: "Saturday" },
  { id: 6, name: "Sunday" },
];

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

  // Memoized initial values for pre-filling and dirty checking
  const initialValues = useMemo(() => ({
    name: company?.name || "",
    prefix: company?.prefix || "",
    address: company?.address || "",
    contact_email: company?.contact_email || "",
    contact_phone: company?.contact_phone || "",
    fiscal_year_start: company?.fiscal_year_start || "",
    working_days: company?.working_days ?? [],
    logo: null as File | null,
  }), [company]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Organization name is required"),
      contact_email: Yup.string().email().required("Email is required"),
      contact_phone: Yup.string().required("Phone is required"),
      working_days: Yup.array().min(1, "Select at least one working day"),
    }),
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        const formData = new FormData();
        let hasChanges = false;

        // Loop through keys to send only changed (dirty) fields
        (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
          const currentValue = values[key];
          const initialValue = initialValues[key];

          if (key === "working_days") {
            if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
              formData.append(key, JSON.stringify(currentValue));
              hasChanges = true;
            }
          } else if (key === "logo") {
            if (currentValue instanceof File) {
              formData.append(key, currentValue);
              hasChanges = true;
            }
          } else if (currentValue !== initialValue) {
            formData.append(key, String(currentValue || ""));
            hasChanges = true;
          }
        });

        if (!hasChanges) {
          setGlobalError("No changes detected.");
          return;
        }

        await updateCompany(formData as any);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  const handleDayToggle = (dayId: number) => {
    const currentDays = [...formik.values.working_days];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(id => id !== dayId)
      : [...currentDays, dayId].sort();
    formik.setFieldValue("working_days", newDays);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const currentLogoUrl = useMemo(() => {
    if (company?.logo_url && company.logo_url !== 'default.jpg') {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      return `${baseUrl}/static/uploads/logo/${company.logo_url}?t=${new Date().getTime()}`;
    }
  
    return "/assets/images/users/multi-user.jpg";
  }, [company?.logo_url]);
  if (isLoading) return <Spinner color="primary" className="m-5" />;

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
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
                        <input id="profile-img-file-input" type="file" ref={fileInputRef} className="profile-img-file-input" onChange={handleLogoChange} />
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
                      <p className="text-white-75">ID Prefix: <span className="fw-bold">{company?.prefix || "N/A"}</span></p>
                      <div className="hstack text-white-75 gap-3">
                        <div><i className="ri-building-line me-1 align-bottom"></i> {company?.address || "No address set"}</div>
                        <div><i className="ri-mail-line me-1 align-bottom"></i> {company?.contact_email || "No email set"}</div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Nav tabs className="nav-tabs-custom border-bottom-0">
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => toggleTab("1")} style={{ cursor: "pointer" }}>General Info</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => toggleTab("2")} style={{ cursor: "pointer" }}>Fiscal & Compliance</NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            {globalError && <Alert color="info">{globalError}</Alert>}
            <form onSubmit={formik.handleSubmit}>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-4">Organization Details</h5>
                      <Row className="g-3">
                        <Col lg={6}>
                          <Label>Legal Name</Label>
                          <Input {...formik.getFieldProps("name")} invalid={!!formik.errors.name} />
                          <FormFeedback>{formik.errors.name}</FormFeedback>
                        </Col>
                        <Col lg={6}>
                          <Label>ID Prefix</Label>
                          <Input {...formik.getFieldProps("prefix")} />
                        </Col>
                        <Col lg={6}>
                          <Label>Contact Email</Label>
                          <Input {...formik.getFieldProps("contact_email")} />
                        </Col>
                        <Col lg={6}>
                          <Label>Contact Phone</Label>
                          <Input {...formik.getFieldProps("contact_phone")} />
                        </Col>
                        <Col lg={12}>
                          <Label>Headquarters Address</Label>
                          <Input type="textarea" rows={3} {...formik.getFieldProps("address")} />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>

                <TabPane tabId="2">
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-4">Operational Settings</h5>
                      <Row className="g-4">
                        <Col lg={6}>
                          <Label>Fiscal Year Start Date</Label>
                          <Input type="date" {...formik.getFieldProps("fiscal_year_start")} />
                        </Col>
                        <Col lg={12}>
                          <Label className="fw-bold d-block mb-3">Official Working Days</Label>
                          <div className="d-flex flex-wrap gap-3">
                            {DAYS_OF_WEEK.map((day) => (
                              <div key={day.id} className="form-check form-check-inline form-check-primary">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`day-${day.id}`}
                                  checked={formik.values.working_days.includes(day.id)}
                                  onChange={() => handleDayToggle(day.id)}
                                />
                                <Label className="form-check-label" htmlFor={`day-${day.id}`}>{day.name}</Label>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </TabPane>
              </TabContent>

              <div className="text-end mb-4">
                <Button color="primary" type="submit" size="lg" className="px-5" disabled={isUpdating || !formik.dirty}>
                  {isUpdating ? <Spinner size="sm" /> : "Save Configuration"}
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanySettings;