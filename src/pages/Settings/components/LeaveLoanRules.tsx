import React, { useState } from "react";
import {
  Row, Col, Card, CardBody, CardHeader, Button, Table, Modal,
  ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input,
  FormFeedback, Spinner, Badge, InputGroup, InputGroupText, Alert
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useLeaveTypes, useLeaveTypeMutation } from "../../../Components/Hooks/useLeaveType";
import { LeaveType, CreateLeaveTypeRequest } from "../../../types/leave";
import { handleBackendErrors } from "../../../helpers/form_utils";

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2, "Must be at least 2 characters").required("Name is required"),
  description: Yup.string().max(255, "Description is too long").nullable(),
  default_days: Yup.number().min(0, "Cannot be negative").required("Required"),
  balanceable: Yup.boolean(),
  carry_forward_allowed: Yup.boolean(),
  max_carry_forward_days: Yup.number().when("carry_forward_allowed", {
    is: true,
    then: (schema) => schema.min(0, "Cannot be negative").required("Required"),
    otherwise: (schema) => schema.nullable(),
  }),
  accrual_enabled: Yup.boolean(),
  accrual_rate: Yup.number().when("accrual_enabled", {
    is: true,
    then: (schema) => schema.min(0, "Cannot be negative").required("Required"),
    otherwise: (schema) => schema.nullable(),
  }),
  min_months_before_eligibility: Yup.number().min(0, "Cannot be negative").nullable(),
  gender_restriction: Yup.string().oneOf(["Male", "Female", "none", ""]).nullable(),
  requires_documentation: Yup.boolean(),
  validity_period_start: Yup.date().nullable(),
  validity_period_end: Yup.date().nullable().min(
    Yup.ref('validity_period_start'), 
    "End date must be after start date"
  ),
});

const initialFormValues = {
  name: "",
  description: "",
  default_days: 0,
  balanceable: true,
  carry_forward_allowed: false,
  max_carry_forward_days: 0,
  accrual_enabled: false,
  accrual_rate: 0,
  min_months_before_eligibility: 0,
  gender_restriction: "none",
  requires_documentation: false,
  validity_period_start: "",
  validity_period_end: "",
};

const LeaveTypeSettings = () => {
  const { data: leaveTypes, isLoading } = useLeaveTypes();
  const { createLeaveType, updateLeaveType, deleteLeaveType, isCreating, isUpdating, isDeleting } = useLeaveTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setGlobalError(null);

      const sanitize = (data: any) => {
        const payload = { ...data };
        if (payload.gender_restriction === "none") payload.gender_restriction = null;
        if (payload.validity_period_start === "") payload.validity_period_start = null;
        if (payload.validity_period_end === "") payload.validity_period_end = null;
        
        ['default_days', 'max_carry_forward_days', 'accrual_rate', 'min_months_before_eligibility'].forEach(key => {
          if (key in payload && payload[key] !== null) payload[key] = Number(payload[key]);
        });
        return payload;
      };

      try {
        if (isEditMode && currentId) {
          const changedFields: any = {};
          Object.keys(values).forEach((key) => {
            const typedKey = key as keyof typeof values;
            if (values[typedKey] !== formik.initialValues[typedKey]) {
                changedFields[typedKey] = values[typedKey];
            }
          });

          if (Object.keys(changedFields).length > 0) {
            await updateLeaveType({ id: currentId, data: sanitize(changedFields) });
          }
        } else {
          await createLeaveType(sanitize(values) as CreateLeaveTypeRequest);
        }
        toggleModal();
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setGlobalError(null);
    if (modalOpen) {
      formik.resetForm({ values: initialFormValues });
      setIsEditMode(false);
      setCurrentId(null);
    }
  };

  const handleCreateNew = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setGlobalError(null);
    formik.resetForm({ values: initialFormValues });
    setModalOpen(true);
  };

  const handleEdit = (lt: LeaveType) => {
    setIsEditMode(true);
    setCurrentId(lt.id);
    setGlobalError(null);
    formik.resetForm({
        values: {
            name: lt.name || "",
            description: lt.description || "",
            default_days: lt.default_days || 0,
            balanceable: lt.balanceable ?? true,
            carry_forward_allowed: lt.carry_forward_allowed ?? false,
            max_carry_forward_days: lt.max_carry_forward_days || 0,
            accrual_enabled: lt.accrual_enabled ?? false,
            accrual_rate: lt.accrual_rate || 0,
            min_months_before_eligibility: lt.min_months_before_eligibility || 0,
            gender_restriction: lt.gender_restriction || "none",
            requires_documentation: lt.requires_documentation ?? false,
            validity_period_start: lt.validity_period_start || "",
            validity_period_end: lt.validity_period_end || "",
        }
    });
    setModalOpen(true);
  };

  return (
    <React.Fragment>
      <Row className="mb-4">
        <Col className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="fw-bold">Leave Policies Configuration</h4>
            <p className="text-muted mb-0">Define how different leave types are earned and consumed.</p>
          </div>
          <Button color="primary" onClick={handleCreateNew}>
            <i className="ri-add-circle-line align-bottom me-1"></i> New Leave Policy
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <CardBody>
                <Table className="align-middle" hover borderless>
                    <thead className="table-light">
                        <tr>
                            <th>Policy Name</th>
                            <th>Allocation</th>
                            <th>Accrual</th>
                            <th>Eligibility</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-5"><Spinner color="primary" /></td></tr>
                        ) : leaveTypes?.map((lt) => (
                            <tr key={lt.id}>
                                <td>
                                    <div className="fw-semibold text-dark">{lt.name}</div>
                                    <small className="text-muted">{lt.description || "No description provided"}</small>
                                </td>
                                <td><Badge color="info-subtle" className="text-info">{lt.default_days} Days</Badge></td>
                                <td>{lt.accrual_enabled ? `${lt.accrual_rate}/mo` : "Fixed"}</td>
                                <td>{lt.min_months_before_eligibility || 0} Months</td>
                                <td className="text-end">
                                    <Button color="soft-info" size="sm" className="me-2" onClick={() => handleEdit(lt)}><i className="ri-edit-2-line" /></Button>
                                    <Button color="soft-danger" size="sm" onClick={() => { setCurrentId(lt.id); setDeleteModal(true); }}><i className="ri-delete-bin-line" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" centered backdrop="static">
        <ModalHeader toggle={toggleModal} className="bg-light p-3">
          {isEditMode ? "Update Leave Policy" : "Create New Leave Policy"}
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody className="p-4">
            {globalError && <Alert color="danger">{globalError}</Alert>}
            
            <h6 className="fw-bold text-uppercase fs-12 mb-3 text-primary">1. Basic Configuration</h6>
            <Row className="g-3 mb-4">
              <Col lg={6}>
                <FormGroup>
                  <Label>Policy Name <span className="text-danger">*</span></Label>
                  <Input {...formik.getFieldProps("name")} invalid={!!(formik.touched.name && formik.errors.name)} />
                  <FormFeedback>{formik.errors.name}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label>Default Days Per Year <span className="text-danger">*</span></Label>
                  <InputGroup>
                    <Input type="number" step="0.5" {...formik.getFieldProps("default_days")} invalid={!!(formik.touched.default_days && formik.errors.default_days)} />
                    <InputGroupText>Days</InputGroupText>
                  </InputGroup>
                  <FormFeedback>{formik.errors.default_days}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label>Description</Label>
                  <Input type="textarea" rows={2} {...formik.getFieldProps("description")} />
                </FormGroup>
              </Col>
            </Row>

            <h6 className="fw-bold text-uppercase fs-12 mb-3 text-primary">2. Accrual & Rollover Logic</h6>
            <Row className="g-3 mb-4">
              <Col lg={6}>
                <div className="p-3 border rounded bg-light-subtle">
                  <FormGroup switch className="mb-2">
                    <Input type="switch" checked={formik.values.accrual_enabled} onChange={(e) => formik.setFieldValue("accrual_enabled", e.target.checked)} />
                    <Label check className="fw-semibold">Enable Accrual</Label>
                  </FormGroup>
                  <Input type="number" step="0.01" disabled={!formik.values.accrual_enabled} {...formik.getFieldProps("accrual_rate")} invalid={!!formik.errors.accrual_rate} />
                  <FormFeedback>{formik.errors.accrual_rate}</FormFeedback>
                </div>
              </Col>
              <Col lg={6}>
                <div className="p-3 border rounded bg-light-subtle">
                  <FormGroup switch className="mb-2">
                    <Input type="switch" checked={formik.values.carry_forward_allowed} onChange={(e) => formik.setFieldValue("carry_forward_allowed", e.target.checked)} />
                    <Label check className="fw-semibold">Allow Carry Forward</Label>
                  </FormGroup>
                  <Input type="number" disabled={!formik.values.carry_forward_allowed} {...formik.getFieldProps("max_carry_forward_days")} invalid={!!formik.errors.max_carry_forward_days} />
                  <FormFeedback>{formik.errors.max_carry_forward_days}</FormFeedback>
                </div>
              </Col>
            </Row>

            <h6 className="fw-bold text-uppercase fs-12 mb-3 text-primary">3. Eligibility & Validity</h6>
            <Row className="g-3">
              <Col lg={4}>
                <FormGroup>
                  <Label>Gender Scope</Label>
                  <Input type="select" {...formik.getFieldProps("gender_restriction")}>
                    <option value="none">Universal (All)</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={4}>
                <FormGroup>
                    <Label>Probation (Months)</Label>
                    <Input type="number" {...formik.getFieldProps("min_months_before_eligibility")} />
                </FormGroup>
              </Col>
              <Col lg={4} className="d-flex align-items-center mt-4">
                <FormGroup check>
                  <Input type="checkbox" id="docs" {...formik.getFieldProps("requires_documentation")} checked={formik.values.requires_documentation} />
                  <Label check for="docs">Docs Required</Label>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                    <Label>Validity Start</Label>
                    <Input type="date" {...formik.getFieldProps("validity_period_start")} />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                    <Label>Validity End</Label>
                    <Input type="date" {...formik.getFieldProps("validity_period_end")} invalid={!!formik.errors.validity_period_end} />
                    <FormFeedback>{formik.errors.validity_period_end as string}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="bg-light">
            <Button color="link" onClick={toggleModal}>Discard</Button>
            <Button color="primary" type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? <Spinner size="sm" /> : isEditMode ? "Save Changes" : "Create Policy"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="p-5 text-center">
          <div className="text-danger mb-4">
            <i className="ri-delete-bin-5-line display-4"></i>
          </div>
          <h4>Confirm Deletion</h4>
          <p className="text-muted">
            Are you sure you want to remove this policy? This action cannot be undone and may impact existing employee balances.
          </p>
          <div className="d-flex gap-2 justify-content-center mt-4">
            <Button color="light" onClick={() => setDeleteModal(false)}>No, Keep it</Button>
            <Button color="danger" disabled={isDeleting} onClick={async () => { 
                if (currentId) { 
                    try {
                        await deleteLeaveType(currentId); 
                        setDeleteModal(false); 
                    } catch (e) { console.error(e); }
                } 
            }}>
              {isDeleting ? <Spinner size="sm" /> : "Yes, Delete Policy"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default LeaveTypeSettings;