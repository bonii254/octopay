import React, { useState, useMemo } from 'react';
import { 
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, 
  Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert, 
  Row, Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCoolers, useCoolerMutation } from '../../../Components/Hooks/useCoolers';
import { Cooler, CoolerPayload, UpdateCoolerRequest } from '../../../types/cooler';
import { handleBackendErrors } from '../../../helpers/form_utils';
import TablePagination from "../../TablePagination"; 
import { rankItem } from '@tanstack/match-sorter-utils';

const CoolerManagement = () => {
  // 1. Frontend Pagination State
  const [pageIndex, setPageIndex] = useState(0); 
  const [pageSize, setPageSize] = useState(10);

  // Data Fetching
  const { data, isLoading } = useCoolers(); 
  const { createCooler, updateCooler, deleteCooler, isCreating, isUpdating, isDeleting } = useCoolerMutation();

  // Modal & UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCoolerId, setCurrentCoolerId] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Memoized Data Logic
  const allCoolers = useMemo(() => data?.coolers || [], [data]);
  const selectedCooler = allCoolers.find(c => c.id === currentCoolerId);

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    return allCoolers.slice(start, start + pageSize);
  }, [allCoolers, pageIndex, pageSize]);

  const totalPages = Math.ceil(allCoolers.length / pageSize);

  // Pagination Instance
  const tableInstance = {
    getState: () => ({ pagination: { pageIndex, pageSize } }),
    setPageSize: (size: number) => {
      setPageSize(size);
      setPageIndex(0);
    },
    previousPage: () => setPageIndex(prev => Math.max(prev - 1, 0)),
    nextPage: () => setPageIndex(prev => Math.min(prev + 1, totalPages - 1)),
    getCanPreviousPage: () => pageIndex > 0,
    getCanNextPage: () => pageIndex < totalPages - 1,
    getPageCount: () => totalPages || 1,
    getRowModel: () => ({ rows: paginatedRows }),
    getPrePaginationRowModel: () => ({ rows: allCoolers }),
  };

  // Form Logic
  const formik = useFormik<CoolerPayload>({
    initialValues: { 
      name: '',
      route: '',
      fuel_capacity_liters: 0,
      expected_consumption_rate: 0,
      is_active: true
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Cooler name is required'),
      route: Yup.string().required('Route assignment is required'),
      fuel_capacity_liters: Yup.number().typeError('Must be a number').positive('Must be positive').required('Required'),
      expected_consumption_rate: Yup.number().typeError('Must be a number').positive('Must be positive').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setGlobalError(null);
        if (isEditMode && currentCoolerId) {
          const patchedData: UpdateCoolerRequest = {};
          let hasChanges = false;
          
          (Object.keys(values) as Array<keyof CoolerPayload>).forEach(key => {
            if (values[key] !== formik.initialValues[key]) {
              (patchedData as any)[key] = values[key];
              hasChanges = true;
            }
          });

          if (!hasChanges) return setModalOpen(false);
          await updateCooler({ id: currentCoolerId, data: patchedData });
        } else {
          await createCooler(values);
        }
        setModalOpen(false);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    }
  });

  const handleEdit = (cooler: Cooler) => {
    setIsEditMode(true);
    setCurrentCoolerId(cooler.id);
    formik.resetForm({ values: { 
      name: cooler.name,
      route: cooler.route || '',
      fuel_capacity_liters: cooler.fuel_capacity_liters,
      expected_consumption_rate: cooler.expected_consumption_rate,
      is_active: cooler.is_active
    }});
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCoolerId || deleteConfirmation !== 'DELETE') return;
    try {
      await deleteCooler(currentCoolerId);
      setDeleteModal(false);
      setDeleteConfirmation('');
      setCurrentCoolerId(null);
    } catch (error: any) {
      handleBackendErrors(error, () => {}, setGlobalError);
    }
  };

  return (
    <React.Fragment>
      {globalError && <Alert color="danger" className="mb-3">{globalError}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Coolers Listing</h5>
        <Button 
          color="primary" 
          onClick={() => { 
            setIsEditMode(false); 
            setCurrentCoolerId(null);
            setGlobalError(null);
            
            formik.resetForm({
              values: {
                name: '',
                route: '',
                fuel_capacity_liters: 0,
                expected_consumption_rate: 0,
                is_active: true
              },
              errors: {},
              touched: {}
            }); 
            
            setModalOpen(true); 
          }}
        >
          <i className="ri-add-line align-bottom me-1"></i> Add New Cooler
        </Button>
      </div>

      <Table hover responsive className="align-middle custom-datatable">
        <thead className="table-light">
          <tr>
            <th>Cooler / Route</th>
            <th>Fuel Capacity</th>
            <th>Cons. Rate (L/h)</th>
            <th>Status</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="text-center p-5"><Spinner color="primary" /></td></tr>
          ) : (
            paginatedRows.map((cooler: Cooler) => (
              <tr key={cooler.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="avatar-xs">
                        <div className="avatar-title rounded-circle bg-info-subtle text-info fw-bold">
                          <i className="ri-fridge-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="ms-2">
                      <h5 className="fs-14 mb-0">
                        <Link to={`/coolers/view/${cooler.id}`} className="text-body fw-bold">{cooler.name}</Link>
                      </h5>
                      <p className="text-muted mb-0 fs-12 text-uppercase fw-medium">
                        <i className="ri-map-pin-2-line text-primary me-1"></i>
                        {cooler.route || 'No Route'}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{cooler.fuel_capacity_liters} L</td>
                <td>{cooler.expected_consumption_rate} L/h</td>
                <td>
                   <span className={`badge ${cooler.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                     {cooler.is_active ? 'Active' : 'Deactivated'}
                   </span>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button size="sm" color="soft-info" onClick={() => handleEdit(cooler)}>
                        <i className="ri-edit-box-line"></i>
                    </Button>
                    <Button size="sm" color="soft-danger" onClick={() => { 
                      setCurrentCoolerId(cooler.id); setDeleteConfirmation(''); setDeleteModal(true); 
                    }}>
                        <i className="ri-delete-bin-line"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <TablePagination table={tableInstance} />

      {/* Form Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered size="lg">
        <ModalHeader className="bg-light p-3 border-bottom-dashed">
            {isEditMode ? 'Update Cooler Asset' : 'Register New Cooler'}
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody className="p-4">
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label className="form-label">Cooler Name</Label>
                        <Input 
                            placeholder="e.g. COOLER-001"
                            {...formik.getFieldProps('name')} 
                            invalid={!!(formik.touched.name && formik.errors.name)} 
                        />
                        <FormFeedback>{formik.errors.name}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label className="form-label">Route Assignment</Label>
                        <Input 
                            placeholder="e.g. 8A"
                            {...formik.getFieldProps('route')} 
                            invalid={!!(formik.touched.route && formik.errors.route)} 
                        />
                        <FormFeedback>{formik.errors.route}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={6}>
                    <FormGroup>
                        <Label className="form-label">Fuel Capacity (Liters)</Label>
                        <Input 
                            type="number" 
                            step="0.1"
                            {...formik.getFieldProps('fuel_capacity_liters')} 
                            invalid={!!(formik.touched.fuel_capacity_liters && formik.errors.fuel_capacity_liters)} 
                        />
                        <FormFeedback>{formik.errors.fuel_capacity_liters}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label className="form-label">Expected Consumption (L/h)</Label>
                        <Input 
                            type="number" 
                            step="0.01"
                            {...formik.getFieldProps('expected_consumption_rate')} 
                            invalid={!!(formik.touched.expected_consumption_rate && formik.errors.expected_consumption_rate)} 
                        />
                        <FormFeedback>{formik.errors.expected_consumption_rate}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            {isEditMode && (
                <FormGroup check className="mt-3">
                    <Label check className="text-muted fw-normal">
                        <Input 
                            type="checkbox" 
                            className="form-check-input"
                            checked={formik.values.is_active}
                            onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                        />{' '}
                        Set Asset as Operational
                    </Label>
                </FormGroup>
            )}
          </ModalBody>
          <ModalFooter className="bg-light p-3">
            <Button color="link" className="link-danger text-decoration-none" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary" disabled={isCreating || isUpdating} className="px-4">
              {isCreating || isUpdating ? <Spinner size="sm" /> : (isEditMode ? 'Update Asset' : 'Save Asset')}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="p-5 text-center">
          <i className="ri-error-warning-line display-4 text-warning"></i>
          <div className="mt-4">
              <h4 className="mb-2">Remove Cooler Asset?</h4>
              <p className="text-muted fs-14">
                If logs exist, the system will <strong>Deactivate</strong> the cooler. 
                Otherwise, it will be permanently deleted.
              </p>
              <div className="bg-light p-3 rounded mb-3">
                <p className="text-muted mb-1 fs-12 text-uppercase">Type confirmation below</p>
                <h6 className="mb-0 fw-bold">DELETE</h6>
              </div>
              <Input 
                 type="text" value={deleteConfirmation} 
                 onChange={(e) => setDeleteConfirmation(e.target.value)} 
                 className="text-center mb-4" placeholder="Enter DELETE"
              />
              <div className="hstack gap-2 justify-content-center">
                <Button color="light" className="w-md" onClick={() => setDeleteModal(false)}>Cancel</Button>
                <Button color="danger" className="w-md" onClick={confirmDelete} disabled={isDeleting || deleteConfirmation !== 'DELETE'}>
                  {isDeleting ? <Spinner size="sm" /> : 'Confirm Removal'}
                </Button>
              </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CoolerManagement;