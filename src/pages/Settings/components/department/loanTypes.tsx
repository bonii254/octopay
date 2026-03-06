import React, { useState } from 'react';
import {
  Row, Col, Card, CardBody, CardHeader, Button, Table,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup,
  Label, Input, FormFeedback, Spinner, Alert
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useLoanTypes, useLoanTypeMutation } from '../../../../Components/Hooks/useLoanType'; 
import { LoanType, LoanTypePayload, UpdateLoanTypeRequest } from '../../../../types/loanTypes';
import { handleBackendErrors } from "../../../../helpers/form_utils";

const LoanTypeSettings = () => {
  const { data: loanTypes, isLoading } = useLoanTypes();
  const { 
    createLoanType, 
    updateLoanType, 
    deleteLoanType, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useLoanTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    interest_rate: Yup.number().required("Required").min(0).max(100),
    max_tenure_months: Yup.number().required("Required").positive().integer(),
    max_amount_percentage: Yup.number().required("Required").positive(),
  });

  const formik = useFormik<LoanTypePayload>({
    initialValues: {
      name: '',
      interest_rate: 0,
      max_tenure_months: 12,
      max_amount_percentage: 50,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        if (isEditMode && currentId) {
          // --- DIRTY CHECKING ---
          const patchedData: UpdateLoanTypeRequest = {};
          let hasChanges = false;

          (Object.keys(values) as Array<keyof LoanTypePayload>).forEach(key => {
            if (values[key] !== formik.initialValues[key]) {
              (patchedData as any)[key] = values[key];
              hasChanges = true;
            }
          });

          if (!hasChanges) {
            toggleModal();
            return;
          }

          await updateLoanType({ id: currentId, data: patchedData });
        } else {
          await createLoanType(values);
        }
        toggleModal();
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      formik.resetForm();
      setIsEditMode(false);
      setCurrentId(null);
      setGlobalError(null);
    }
  };

  const handleEdit = (item: LoanType) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    formik.resetForm({ values: {
      name: item.name,
      interest_rate: Number(item.interest_rate),
      max_tenure_months: item.max_tenure_months,
      max_amount_percentage: Number(item.max_amount_percentage),
    }});
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentId) return;
    try {
      setGlobalError(null);
      await deleteLoanType(currentId);
      setDeleteModal(false);
      setCurrentId(null);
    } catch (error: any) {
      handleBackendErrors(error, formik.setErrors, setGlobalError);
      setDeleteModal(false);
    }
  };

  return (
    <React.Fragment>
      {/* Global Error Alert */}
      {globalError && !modalOpen && (
        <Alert color="danger" className="mb-3 alert-dismissible fade show">
          {globalError}
          <Button type="button" className="btn-close" onClick={() => setGlobalError(null)} />
        </Alert>
      )}

      <div className="d-flex align-items-center mb-3">
        <h5 className="flex-grow-1 mb-0">Loan Type Configuration</h5>
        <Button color="primary" onClick={toggleModal}>
          <i className="ri-add-line align-bottom me-1"></i> Add Loan Type
        </Button>
      </div>

      <div className="table-responsive">
        <Table className="align-middle table-nowrap mb-0" hover>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Interest</th>
              <th>Max Tenure</th>
              <th>Max Amount %</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center"><Spinner size="sm" color="primary" /></td></tr>
            ) : loanTypes?.map((lt) => (
              <tr key={lt.id}>
                <td className="fw-medium">{lt.name}</td>
                <td>{lt.interest_rate}%</td>
                <td>{lt.max_tenure_months} Months</td>
                <td>{lt.max_amount_percentage}%</td>
                <td className="text-end">
                  <div className="hstack gap-2 justify-content-end">
                    <button className="btn btn-sm btn-soft-info" onClick={() => handleEdit(lt)}>
                      <i className="ri-pencil-fill"></i>
                    </button>
                    <button className="btn btn-sm btn-soft-danger" onClick={() => { setCurrentId(lt.id); setDeleteModal(true); }}>
                      <i className="ri-delete-bin-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className="bg-light p-3">
          {isEditMode ? "Edit Loan Type" : "Create Loan Type"}
        </ModalHeader>
        <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
          <ModalBody>
            {globalError && <Alert color="danger">{globalError}</Alert>}
            <Row className="g-3">
              <Col lg={12}>
                <FormGroup>
                  <Label>Loan Name</Label>
                  <Input {...formik.getFieldProps('name')} invalid={!!(formik.touched.name && formik.errors.name)} />
                  <FormFeedback>{formik.errors.name}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('interest_rate')} invalid={!!(formik.touched.interest_rate && formik.errors.interest_rate)} />
                  <FormFeedback>{formik.errors.interest_rate}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label>Max Tenure (Months)</Label>
                  <Input type="number" {...formik.getFieldProps('max_tenure_months')} invalid={!!(formik.touched.max_tenure_months && formik.errors.max_tenure_months)} />
                  <FormFeedback>{formik.errors.max_tenure_months}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label>Max Amount (% of Salary)</Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('max_amount_percentage')} invalid={!!(formik.touched.max_amount_percentage && formik.errors.max_amount_percentage)} />
                  <FormFeedback>{formik.errors.max_amount_percentage}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>Cancel</Button>
            <Button color="success" type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? <Spinner size="sm" /> : isEditMode ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="p-5 text-center">
          <i className="ri-delete-bin-line display-4 text-danger"></i>
          <div className="mt-4">
            <h4 className="mb-3">Are you sure?</h4>
            <p className="text-muted mb-4">You are about to delete this loan type. This action cannot be undone.</p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="light" onClick={() => setDeleteModal(false)}>Close</Button>
              <Button color="danger" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" /> : "Yes, Delete It!"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default LoanTypeSettings;