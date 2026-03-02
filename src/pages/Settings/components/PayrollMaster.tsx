import React, { useState, useMemo, useEffect } from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Spinner, Badge, FormFeedback, 
  Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, 
  Alert,
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import {
  useSalaryComponents,
  useSalaryComponentMutation
} from '../../../Components/Hooks/useSalaryComponent';
import {
  SalaryComponent,
  CreateSalaryComponentRequest,
  UpdateSalaryComponentRequest,
  PayrollComponentType,
  SalaryCalculationMethod
} from '../../../types/salaryComponent';

/**
 * UTILITY FUNCTION
 * Handles flattening backend errors and routing logic errors to the Global Alert.
 */
export const handleBackendErrors = (
  error: any, 
  setErrors: (errors: any) => void,
  setGlobalError: (msg: string | null) => void
) => {
  setGlobalError(null);
  const errorData = error?.response?.data || error;

  if (typeof errorData === 'object' && errorData !== null) {
    const flattenedErrors: Record<string, string> = {};
    
    Object.keys(errorData).forEach((key) => {
      const val = errorData[key];
      const message = Array.isArray(val) ? val[0] : String(val);

      // Business logic errors (like 'type' validation conflicts) should be global
      if (['error', 'details', 'message', 'type', 'non_field_errors'].includes(key)) {
        setGlobalError(message);
      } else {
        flattenedErrors[key] = message;
      }
    });

    setErrors(flattenedErrors);
  } else if (typeof errorData === 'string') {
    setGlobalError(errorData);
  } else {
    setGlobalError("An unexpected error occurred. Please try again.");
  }
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').max(100),
  code: Yup.string().required('Code is required').max(20),
  type: Yup.mixed<PayrollComponentType>().oneOf(Object.values(PayrollComponentType)).required(),
  calculation_method: Yup.mixed<SalaryCalculationMethod>().oneOf(Object.values(SalaryCalculationMethod)).required(),
  is_taxable: Yup.boolean(),
  is_statutory: Yup.boolean(),
  is_pensionable: Yup.boolean(),
  is_recurring: Yup.boolean(),
  affects_nssf: Yup.boolean(),
});

const initialValues: CreateSalaryComponentRequest = {
  name: '',
  code: '',
  is_taxable: true,
  is_statutory: false,
  is_pensionable: false,
  is_recurring: true,
  type: PayrollComponentType.EARNING,
  affects_nssf: false,
  calculation_method: SalaryCalculationMethod.FIXED,
};

const SalaryComponentSettings = () => {
  const { data: components, isLoading, isError } = useSalaryComponents();
  const { createSalaryComponent, updateSalaryComponent, deleteSalaryComponent, isCreating, isUpdating, isDeleting } = useSalaryComponentMutation();

  const [activeTab, setActiveTab] = useState<PayrollComponentType>(PayrollComponentType.EARNING);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

 
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const filteredComponents = useMemo(() => {
    return (components || []).filter(c => c.type === activeTab);
  }, [components, activeTab]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        setApiError(null);
        if (isEditMode && currentId) {
          const original = components?.find(c => c.id === currentId);
          const changedFields: UpdateSalaryComponentRequest = {};
          
          (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
            if (values[key] !== original?.[key]) {
              changedFields[key] = values[key] as any;
            }
          });

          if (Object.keys(changedFields).length > 0) {
            await updateSalaryComponent({ id: currentId, data: changedFields });
          } else {
            toast.info("No changes detected");
          }
        } else {
          await createSalaryComponent(values);
        }
        toggleModal();
        resetForm();
      } catch (error: any) {
        handleBackendErrors(error, setErrors, setApiError);
      }
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      formik.resetForm({ values: initialValues });
      setIsEditMode(false);
      setCurrentId(null);
      setApiError(null);
    }
  };

  const handleEdit = (comp: SalaryComponent) => {
    formik.setValues({
      name: comp.name,
      code: comp.code,
      is_taxable: comp.is_taxable,
      is_statutory: comp.is_statutory,
      is_pensionable: comp.is_pensionable,
      is_recurring: comp.is_recurring,
      type: comp.type,
      affects_nssf: comp.affects_nssf,
      calculation_method: comp.calculation_method,
    });
    setCurrentId(comp.id);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentId) {
      try {
        await deleteSalaryComponent(currentId);
        setDeleteModal(false);
        setCurrentId(null);
      } catch (error) {
        toast.error("Failed to delete component");
      }
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-grow-1">
          <Nav tabs className="nav-tabs-custom nav-success mb-0">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === PayrollComponentType.EARNING })}
                onClick={() => setActiveTab(PayrollComponentType.EARNING)}
                style={{ cursor: 'pointer' }}
              >
                Earnings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === PayrollComponentType.DEDUCTION })}
                onClick={() => setActiveTab(PayrollComponentType.DEDUCTION)}
                style={{ cursor: 'pointer' }}
              >
                Deductions
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="flex-shrink-0">
          <Button color="primary" onClick={toggleModal}>
            <i className="ri-add-line align-bottom me-1"></i> Add Component
          </Button>
        </div>
      </div>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={activeTab}>
          {isLoading ? (
            <div className="text-center py-4"><Spinner color="primary" /></div>
          ) : isError ? (
            <div className="alert alert-danger">Failed to load components.</div>
          ) : (
            <div className="table-responsive">
              <Table className="align-middle table-nowrap mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Method</th>
                    <th>Taxable</th>
                    <th>Recurring</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.length > 0 ? filteredComponents.map((comp) => (
                    <tr key={comp.id}>
                      <td className="fw-medium text-primary">{comp.code}</td>
                      <td>{comp.name}</td>
                      <td>
                        <Badge color="info" className="badge-soft-info">
                          {comp.calculation_method?.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td>
                        <i className={comp.is_taxable ? "ri-checkbox-circle-fill text-success fs-17" : "ri-close-circle-fill text-danger fs-17"}></i>
                      </td>
                      <td>
                        {comp.is_recurring ? <Badge color="light" className="text-body">Yes</Badge> : <Badge color="light" className="text-muted">No</Badge>}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button size="sm" color="light" onClick={() => handleEdit(comp)}>
                            <i className="ri-pencil-fill text-muted"></i>
                          </Button>
                          <Button size="sm" color="light" onClick={() => { setCurrentId(comp.id); setDeleteModal(true); }}>
                            <i className="ri-delete-bin-fill text-danger"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="text-center py-4 text-muted">No {activeTab.toLowerCase()}s configured.</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </TabPane>
      </TabContent>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" centered>
        <ModalHeader className='bg-light p-3' toggle={toggleModal}>
          {isEditMode ? 'Edit Component' : 'Add New Salary Component'}
        </ModalHeader>
        <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
          <ModalBody>
            {/* --- AUTO-DISMISSING GLOBAL ALERT --- */}
            {apiError && (
              <Alert 
                color="danger" 
                className="border-0 shadow-sm" 
                toggle={() => setApiError(null)}
              >
                <i className="ri-error-warning-line me-2"></i>
                {apiError}
              </Alert>
            )}
            
            <Row className="g-3">
              <Col md={6}>
                <FormGroup>
                  <Label>Name <span className="text-danger">*</span></Label>
                  <Input 
                    placeholder="Basic Salary" 
                    {...formik.getFieldProps('name')} 
                    invalid={!!(formik.touched.name && formik.errors.name)} 
                  />
                  <FormFeedback>{formik.errors.name as string}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Code <span className="text-danger">*</span></Label>
                  <Input 
                    placeholder="BASIC" 
                    {...formik.getFieldProps('code')} 
                    invalid={!!(formik.touched.code && formik.errors.code)} 
                  />
                  <FormFeedback>{formik.errors.code as string}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Type</Label>
                  <Input type="select" {...formik.getFieldProps('type')}>
                    <option value={PayrollComponentType.EARNING}>Earning</option>
                    <option value={PayrollComponentType.DEDUCTION}>Deduction</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Calculation Method</Label>
                  <Input type="select" {...formik.getFieldProps('calculation_method')}>
                    {Object.values(SalaryCalculationMethod).map(method => (
                      <option key={method} value={method}>{method.replace(/_/g, ' ')}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col md={12}><hr /></Col>

              <Col md={4}>
                <FormGroup switch>
                  <Input type="switch" checked={formik.values.is_taxable} onChange={(e) => formik.setFieldValue('is_taxable', e.target.checked)} />
                  <Label check>Taxable</Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup switch>
                  <Input type="switch" checked={formik.values.is_statutory} onChange={(e) => formik.setFieldValue('is_statutory', e.target.checked)} />
                  <Label check>Statutory</Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup switch>
                  <Input type="switch" checked={formik.values.is_pensionable} onChange={(e) => formik.setFieldValue('is_pensionable', e.target.checked)} />
                  <Label check>Pensionable</Label>
                </FormGroup>
              </Col>
              <Col md={4} className="mt-3">
                <FormGroup switch>
                  <Input type="switch" checked={formik.values.is_recurring} onChange={(e) => formik.setFieldValue('is_recurring', e.target.checked)} />
                  <Label check>Is Recurring</Label>
                </FormGroup>
              </Col>
              <Col md={4} className="mt-3">
                <FormGroup switch>
                  <Input type="switch" checked={formik.values.affects_nssf} onChange={(e) => formik.setFieldValue('affects_nssf', e.target.checked)} />
                  <Label check>Affects NSSF</Label>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal} disabled={isCreating || isUpdating}>Cancel</Button>
            <Button color="primary" type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Spinner size="sm" className="me-2" />}
              {isEditMode ? 'Update Component' : 'Save Component'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="text-center p-5">
          <div className="text-danger"><i className="ri-error-warning-line display-4"></i></div>
          <div className="mt-4">
            <h4>Delete Component?</h4>
            <p className="text-muted">Deleting this may affect existing payroll records. Are you sure?</p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button color="light" onClick={() => setDeleteModal(false)}>Cancel</Button>
              <Button color="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" /> : "Yes, Delete It!"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default SalaryComponentSettings;