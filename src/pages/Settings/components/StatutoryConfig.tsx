import React, { useState } from 'react';
import { 
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, 
  Form, FormGroup, Label, Input, Spinner, Badge, FormFeedback, Row, Col
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  useStatutoryConfigs, 
  useStatutoryMutation,
  formatAsPercentage,
 } from '../../../Components/Hooks/useStatutory';
import { StatutoryConfiguration, CreateStatutoryConfigRequest } from '../../../types/statutory';

const validationSchema = Yup.object().shape({
  effective_date: Yup.date().required('Effective date is required'),
  effective_to: Yup.date().nullable().min(Yup.ref('effective_date'), 'End date cannot be before effective date'),
  nssf_tier_1_limit: Yup.number().min(0, 'Must be greater than or equal to 0').required('NSSF Tier 1 limit is required'),
  nssf_tier_2_limit: Yup.number().min(0, 'Must be greater than or equal to 0').required('NSSF Tier 2 limit is required'),
  nssf_rate: Yup.number().min(0).max(1).required('NSSF rate is required'),
  housing_levy_rate: Yup.number().min(0).max(1).required('Housing levy rate is required'),
  shif_rate: Yup.number().min(0).max(1).required('SHIF rate is required'),
  personal_relief: Yup.number().min(0).required('Personal relief is required'),
  nita_levy: Yup.number().min(0).nullable(),
  is_active: Yup.boolean()
});

const initialValues: CreateStatutoryConfigRequest = {
  effective_date: '',
  effective_to: '',
  nssf_tier_1_limit: 0,
  nssf_tier_2_limit: 0,
  nssf_rate: 0,
  housing_levy_rate: 0,
  shif_rate: 0,
  personal_relief: 0,
  nita_levy: 0,
  is_active: true,
};

const StatutorySettings = () => {
  const { data: configs, isLoading, isError } = useStatutoryConfigs();
  const { createStatutoryConfig, updateStatutoryConfig, deleteStatutoryConfig, isCreating, isUpdating, isDeleting } = useStatutoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single');

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditMode && currentId) {
          const changedPayload: Partial<CreateStatutoryConfigRequest> = {};
          (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
            if (values[key] !== formik.initialValues[key]) {
              changedPayload[key] = values[key] === '' ? null : (values[key] as any);
            }
          });
          if (Object.keys(changedPayload).length > 0) {
            await updateStatutoryConfig({ id: currentId, data: changedPayload });
          }
        } else {
          const payload = { ...values, effective_to: values.effective_to === '' ? null : values.effective_to };
          await createStatutoryConfig(payload);
        }
        toggleModal();
        resetForm();
      } catch (error) { console.error("Submission failed", error); }
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
        formik.resetForm({ values: initialValues });
        setIsEditMode(false);
        setCurrentId(null);
    }
  };

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleEdit = (config: StatutoryConfiguration) => {
    const mappedValues: CreateStatutoryConfigRequest = {
      effective_date: config.effective_date,
      effective_to: config.effective_to || '',
      nssf_tier_1_limit: Number(config.nssf_tier_1_limit),
      nssf_tier_2_limit: Number(config.nssf_tier_2_limit),
      nssf_rate: Number(config.nssf_rate),
      housing_levy_rate: Number(config.housing_levy_rate),
      shif_rate: Number(config.shif_rate),
      personal_relief: Number(config.personal_relief),
      nita_levy: Number(config.nita_levy) || 0,
      is_active: config.is_active,
    };
    formik.resetForm({ values: mappedValues });
    setCurrentId(config.id);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && configs) { setSelectedRows(configs.map(item => item.id)); } 
    else { setSelectedRows([]); }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) { setSelectedRows(selectedRows.filter(rowId => rowId !== id)); } 
    else { setSelectedRows([...selectedRows, id]); }
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'single' && currentId) { await deleteStatutoryConfig(currentId); } 
      else {
        for (const id of selectedRows) { await deleteStatutoryConfig(id); }
        setSelectedRows([]);
      }
      setDeleteModal(false);
    } catch (error) { console.error("Delete failed", error); }
  };

  return (
    <React.Fragment>
      {/* HEADER SECTION - Positioned at the very top of the parent TabPane */}
      <div className="d-flex align-items-center mb-4">
        <div className="flex-grow-1">
          <p className="text-muted mb-0">Configure NSSF, Housing Levy, and SHIF deduction parameters.</p>
        </div>
        <div className="flex-shrink-0 d-flex gap-2">
          {selectedRows.length > 0 && (
            <Button color="soft-danger" onClick={() => { setDeleteType('bulk'); setDeleteModal(true); }}>
              <i className="ri-delete-bin-2-line align-bottom me-1"></i> Bulk Delete ({selectedRows.length})
            </Button>
          )}
          <Button color="primary" onClick={toggleModal}>
            <i className="ri-add-line align-bottom me-1"></i> Add Configuration
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4"><Spinner color="primary" /></div>
      ) : isError ? (
        <div className="alert alert-danger">Failed to load configurations.</div>
      ) : (
        <div className="table-responsive">
          <Table className="align-middle table-nowrap mb-0" hover>
            <thead className="table-light">
              <tr>
                <th style={{ width: "40px" }}>
                  <Input type="checkbox" onChange={handleSelectAll} checked={configs?.length ? selectedRows.length === configs.length : false} />
                </th>
                <th>Effective Date</th>
                <th>NSSF Rate</th>
                <th>Housing Levy</th>
                <th>SHIF Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs && configs.length > 0 ? configs.map((config) => (
                <tr key={config.id}>
                  <td><Input type="checkbox" checked={selectedRows.includes(config.id)} onChange={() => handleSelectRow(config.id)} /></td>
                  <td className="fw-medium">{new Date(config.effective_date).toLocaleDateString()}</td>
                  <td>{formatAsPercentage(config.nssf_rate)}</td>
                  <td>{formatAsPercentage(config.housing_levy_rate)}</td>
                  <td>{formatAsPercentage(config.shif_rate)}</td>
                  <td>
                    <Badge color={config.is_active ? "success" : "secondary"} className={config.is_active ? "badge-soft-success" : "badge-soft-secondary"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" color="light" onClick={() => handleEdit(config)}><i className="ri-pencil-fill text-muted"></i></Button>
                      <Button size="sm" color="light" onClick={() => { setCurrentId(config.id); setDeleteType('single'); setDeleteModal(true); }} disabled={isDeleting}><i className="ri-delete-bin-fill text-danger"></i></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No statutory configurations found.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* MODALS REMAIN UNCHANGED AS THEY ARE PORTALS */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" centered>
        <ModalHeader className='bg-light p-3' toggle={toggleModal}>
          {isEditMode ? 'Edit Statutory Configuration' : 'Add Statutory Configuration'}
        </ModalHeader>
        <Form onSubmit={(e) => {e.preventDefault(); formik.handleSubmit(e);}}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Effective Date <span className="text-danger">*</span></Label>
                  <Input type="date" {...formik.getFieldProps('effective_date')} invalid={!!(formik.touched.effective_date && formik.errors.effective_date)} />
                  <FormFeedback>{formik.errors.effective_date}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Effective To</Label>
                  <Input type="date" {...formik.getFieldProps('effective_to')} invalid={!!(formik.touched.effective_to && formik.errors.effective_to)} />
                  <FormFeedback>{formik.errors.effective_to}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>NSSF Tier 1 Limit <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('nssf_tier_1_limit')} invalid={!!(formik.touched.nssf_tier_1_limit && formik.errors.nssf_tier_1_limit)} />
                  <FormFeedback>{formik.errors.nssf_tier_1_limit}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>NSSF Tier 2 Limit <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('nssf_tier_2_limit')} invalid={!!(formik.touched.nssf_tier_2_limit && formik.errors.nssf_tier_2_limit)} />
                  <FormFeedback>{formik.errors.nssf_tier_2_limit}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>NSSF Rate <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.0001" {...formik.getFieldProps('nssf_rate')} invalid={!!(formik.touched.nssf_rate && formik.errors.nssf_rate)} />
                  <FormFeedback>{formik.errors.nssf_rate}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Housing Levy <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.0001" {...formik.getFieldProps('housing_levy_rate')} invalid={!!(formik.touched.housing_levy_rate && formik.errors.housing_levy_rate)} />
                  <FormFeedback>{formik.errors.housing_levy_rate}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>SHIF Rate <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.0001" {...formik.getFieldProps('shif_rate')} invalid={!!(formik.touched.shif_rate && formik.errors.shif_rate)} />
                  <FormFeedback>{formik.errors.shif_rate}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Personal Relief <span className="text-danger">*</span></Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('personal_relief')} invalid={!!(formik.touched.personal_relief && formik.errors.personal_relief)} />
                  <FormFeedback>{formik.errors.personal_relief}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>NITA Levy</Label>
                  <Input type="number" step="0.01" {...formik.getFieldProps('nita_levy')} invalid={!!(formik.touched.nita_levy && formik.errors.nita_levy)} />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup switch className="mt-2">
                  <Input type="switch" checked={formik.values.is_active} onChange={(e) => formik.setFieldValue('is_active', e.target.checked)} />
                  <Label check className="ms-2">Set as Active Configuration</Label>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleModal}>Cancel</Button>
            <Button color="primary" type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Spinner size="sm" className="me-2" />}
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered>
        <ModalBody className="text-center p-5">
            <div className="text-danger"><i className="ri-error-warning-line display-4"></i></div>
            <div className="mt-4">
                <h4 className="mb-2">Are you sure?</h4>
                <p className="text-muted fs-14 mb-4">
                    {deleteType === 'bulk' ? `Delete ${selectedRows.length} records?` : "Permanently delete this configuration?"}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <Button color="light" onClick={toggleDeleteModal}>Cancel</Button>
                    <Button color="danger" onClick={confirmDelete} disabled={isDeleting}>Yes, Delete It!</Button>
                </div>
            </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default StatutorySettings;