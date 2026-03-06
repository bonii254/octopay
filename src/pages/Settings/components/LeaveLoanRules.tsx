import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, Button, Table,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup,
  Label, Input, FormFeedback, Spinner, Badge
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useLeaveTypes, useLeaveTypeMutation } from '../../../Components/Hooks/useLeaveType';
import { LeaveType, CreateLeaveTypeRequest } from '../../../types/leave';


const validationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Must be at least 2 characters').required('Name is required'),
  description: Yup.string().max(255, 'Description is too long').nullable(),
  default_days: Yup.number().min(0, 'Cannot be negative').required('Default days are required'),
  balanceable: Yup.boolean(),
  carry_forward_allowed: Yup.boolean(),
  max_carry_forward_days: Yup.number().when('carry_forward_allowed', {
    is: true,
    then: (schema) => schema.min(0, 'Cannot be negative').required('Required'),
    otherwise: (schema) => schema.nullable(),
  }),
  accrual_enabled: Yup.boolean(),
  accrual_rate: Yup.number().when('accrual_enabled', {
    is: true,
    then: (schema) => schema.min(0, 'Cannot be negative').required('Required'),
    otherwise: (schema) => schema.nullable(),
  }),
  min_months_before_eligibility: Yup.number().min(0).nullable(),
  gender_restriction: Yup.string().oneOf(['Male', 'Female', 'none', '']).nullable(),
  requires_documentation: Yup.boolean(),
});

const initialValues: CreateLeaveTypeRequest = {
  name: '',
  description: '',
  default_days: 0,
  balanceable: true,
  carry_forward_allowed: false,
  max_carry_forward_days: 0,
  accrual_enabled: false,
  accrual_rate: 0,
  min_months_before_eligibility: null,
  gender_restriction: null,
  requires_documentation: false,
  validity_period_start: null,
  validity_period_end: null,
  policy_metadata: {},
};

interface LeaveTypeFormValues extends Omit<CreateLeaveTypeRequest, 'gender_restriction'> {
  gender_restriction: "Male" | "Female" | "none" | ""; 
}

const LeaveTypeSettings = () => {
  const { data: leaveTypes, isLoading } = useLeaveTypes();
  const {
    createLeaveType, updateLeaveType, deleteLeaveType,
    isCreating, isUpdating, isDeleting
  } = useLeaveTypeMutation();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const formik = useFormik<LeaveTypeFormValues>({
    initialValues: {
      ...initialValues,
      gender_restriction: "none"
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload: CreateLeaveTypeRequest = {
        ...values,
        max_carry_forward_days: values.carry_forward_allowed ? values.max_carry_forward_days : 0,
        accrual_rate: values.accrual_enabled ? values.accrual_rate : 0,
        gender_restriction: values.gender_restriction === "none" 
            ? null 
            : (values.gender_restriction as "Male" | "Female"),
      };

      try {
        if (isEditMode && currentId) {
          await updateLeaveType({ id: currentId, data: payload });
        } else {
          await createLeaveType(payload);
        }
        toggleModal();
      } catch (error) {
        console.error("Submission failed", error);
      }
    },
  });
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      formik.resetForm();
      setIsEditMode(false);
      setCurrentId(null);
    }
  };

  const handleEdit = (leaveType: LeaveType) => {
    formik.setValues({
      ...leaveType,
      gender_restriction: leaveType.gender_restriction || "none",
    });
    setCurrentId(leaveType.id);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (currentId) {
      await deleteLeaveType(currentId);
      setDeleteModal(false);
      setCurrentId(null);
    }
  };

  return (
    <React.Fragment>
          {/* Page Title / Header */}
          <Row className="mb-3 pb-1">
            <Col xs={12}>
              <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                <div className="flex-grow-1">
                  <h4 className="fs-16 mb-1">Leave Policies Configuration</h4>
                  <p className="text-muted mb-0">Manage organizational leave types, accruals, and limits.</p>
                </div>
                <div className="mt-3 mt-lg-0">
                  <Button color="success" className="add-btn" onClick={() => { setIsEditMode(false); setModalOpen(true); }}>
                    <i className="ri-add-line align-bottom me-1"></i> Add Leave Type
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Data Table */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Active Leave Types</h5>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mb-1">
                    <Table className="align-middle table-nowrap" hover id="leaveTypeTable">
                      <thead className="table-light">
                        <tr>
                          <th>Policy Name</th>
                          <th>Default Days</th>
                          <th>Carry Forward</th>
                          <th>Accrual</th>
                          <th>Scope</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              <Spinner color="primary" />
                            </td>
                          </tr>
                        ) : leaveTypes && leaveTypes.length > 0 ? (
                          leaveTypes.map((lt) => (
                            <tr key={lt.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="flex-grow-1 fw-medium">{lt.name}</div>
                                  {lt.requires_documentation && (
                                    <Badge color="warning" className="ms-2 badge-border">Proof Req.</Badge>
                                  )}
                                </div>
                              </td>
                              <td>{lt.default_days} Days</td>
                              <td>
                                {lt.carry_forward_allowed ? (
                                  <span className="text-success"><i className="ri-check-double-line me-1 align-bottom"></i>Max {lt.max_carry_forward_days}</span>
                                ) : (
                                  <span className="text-muted">Disabled</span>
                                )}
                              </td>
                              <td>
                                {lt.accrual_enabled ? (
                                  <Badge color="info" pill>{lt.accrual_rate}/mo</Badge>
                                ) : (
                                  <span className="text-muted small">Fixed Allocation</span>
                                )}
                              </td>
                              <td>
                                {lt.gender_restriction ? (
                                  <Badge color="secondary-subtle" className="text-secondary">{lt.gender_restriction}</Badge>
                                ) : (
                                  <span className="text-muted">Universal</span>
                                )}
                              </td>
                              <td className="text-end">
                                <ul className="list-inline hstack gap-2 mb-0 justify-content-end">
                                  <li className="list-inline-item edit">
                                    <button className="btn btn-sm btn-soft-info edit-item-btn" onClick={() => handleEdit(lt)}>
                                      <i className="ri-pencil-fill align-bottom" />
                                    </button>
                                  </li>
                                  <li className="list-inline-item remove">
                                    <button className="btn btn-sm btn-soft-danger remove-item-btn" onClick={() => { setCurrentId(lt.id); setDeleteModal(true); }}>
                                      <i className="ri-delete-bin-fill align-bottom" />
                                    </button>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-5">
                              <div className="avatar-sm mx-auto mb-3">
                                <div className="avatar-title bg-light text-primary rounded-circle fs-24">
                                  <i className="ri-calendar-todo-line"></i>
                                </div>
                              </div>
                              <h5 className="mt-2">No Leave Policies Found</h5>
                              <p className="text-muted">Create your first leave policy to get started.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

      {/* --- Add / Edit Modal --- */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg" backdrop="static">
        <ModalHeader toggle={toggleModal} className="bg-light p-3">
          {isEditMode ? "Edit Leave Policy" : "Create Leave Policy"}
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Row className="g-3">
              <Col lg={8}>
                <FormGroup>
                  <Label htmlFor="name">Policy Name <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    id="name"
                    {...formik.getFieldProps('name')}
                    invalid={!!(formik.touched.name && formik.errors.name)}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <FormFeedback>{formik.errors.name as string}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              
              <Col lg={4}>
                <FormGroup>
                  <Label htmlFor="default_days">Default Yearly Days <span className="text-danger">*</span></Label>
                  <Input
                    type="number"
                    step="0.5"
                    id="default_days"
                    {...formik.getFieldProps('default_days')}
                    invalid={!!(formik.touched.default_days && formik.errors.default_days)}
                  />
                  {formik.touched.default_days && formik.errors.default_days && (
                    <FormFeedback>{formik.errors.default_days as string}</FormFeedback>
                  )}
                </FormGroup>
              </Col>

              <Col lg={4}>
                <FormGroup>
                  <Label htmlFor="gender_restriction">Gender Scope</Label>
                  <Input type="select" id="gender_restriction" {...formik.getFieldProps('gender_restriction')}>
                    <option value="none">Universal</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col lg={8} className="d-flex align-items-center gap-4 mt-4">
                <FormGroup check>
                  <Input type="checkbox" id="balanceable" {...formik.getFieldProps('balanceable')} checked={formik.values.balanceable} />
                  <Label check htmlFor="balanceable">Track Balance</Label>
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="requires_documentation" {...formik.getFieldProps('requires_documentation')} checked={formik.values.requires_documentation} />
                  <Label check htmlFor="requires_documentation">Require Documentation (e.g., Doctor's Note)</Label>
                </FormGroup>
              </Col>

              <Col lg={6}>
                <div className="border border-dashed rounded p-3">
                  <FormGroup switch className="form-switch-md mb-2">
                    <Input type="switch" id="carry_forward_allowed" checked={formik.values.carry_forward_allowed} onChange={(e) => formik.setFieldValue('carry_forward_allowed', e.target.checked)} />
                    <Label check htmlFor="carry_forward_allowed" className="fw-bold">Allow Carry Forward</Label>
                  </FormGroup>
                  <Label className={`form-label mb-1 ${!formik.values.carry_forward_allowed ? 'text-muted' : ''}`}>Max Carry Forward Days</Label>
                  <Input
                    type="number"
                    disabled={!formik.values.carry_forward_allowed}
                    {...formik.getFieldProps('max_carry_forward_days')}
                    invalid={!!(formik.touched.max_carry_forward_days && formik.errors.max_carry_forward_days)}
                  />
                  {formik.touched.max_carry_forward_days && formik.errors.max_carry_forward_days && (
                    <FormFeedback>{formik.errors.max_carry_forward_days as string}</FormFeedback>
                  )}
                </div>
              </Col>

              <Col lg={6}>
                <div className="border border-dashed rounded p-3">
                  <FormGroup switch className="form-switch-md mb-2">
                    <Input type="switch" id="accrual_enabled" checked={formik.values.accrual_enabled} onChange={(e) => formik.setFieldValue('accrual_enabled', e.target.checked)} />
                    <Label check htmlFor="accrual_enabled" className="fw-bold">Enable Monthly Accrual</Label>
                  </FormGroup>
                  <Label className={`form-label mb-1 ${!formik.values.accrual_enabled ? 'text-muted' : ''}`}>Accrual Rate (days/month)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={!formik.values.accrual_enabled}
                    {...formik.getFieldProps('accrual_rate')}
                    invalid={!!(formik.touched.accrual_rate && formik.errors.accrual_rate)}
                  />
                  {formik.touched.accrual_rate && formik.errors.accrual_rate && (
                    <FormFeedback>{formik.errors.accrual_rate as string}</FormFeedback>
                  )}
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>Cancel</Button>
            <Button color="success" type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? <Spinner size="sm" className="me-2" /> : null}
              {isEditMode ? "Save Changes" : "Create Policy"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* --- Delete Confirmation Modal --- */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered id="removeItemModal">
        <ModalBody className="p-5 text-center">
          <lord-icon
            src="https://cdn.lordicon.com/gsqxdxog.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#f06548"
            style={{ width: "90px", height: "90px" }}
          ></lord-icon>
          <div className="mt-4 text-center">
            <h4 className="fs-semibold">You are about to delete this leave type?</h4>
            <p className="text-muted fs-14 mb-4 pt-1">
              Deleting this policy will remove it from the system and might affect user historical records.
            </p>
            <div className="hstack gap-2 justify-content-center remove">
              <button className="btn btn-link btn-ghost-success fw-medium text-decoration-none" onClick={() => setDeleteModal(false)}>
                <i className="ri-close-line me-1 align-bottom"></i> Close
              </button>
              <button className="btn btn-danger" id="delete-record" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" /> : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default LeaveTypeSettings;