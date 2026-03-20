import React, { useState, useMemo, useEffect } from 'react';
import {
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Spinner, Badge, FormFeedback, 
  Row, Col, Alert, Card, CardBody, Nav, NavItem, NavLink
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useTaxBands, useTaxBandMutation } from '../../../Components/Hooks/useTaxBand';
import { TaxBand, CreateTaxBandRequest } from '../../../types/taxBand';

const validationSchema = Yup.object().shape({
  effective_from: Yup.date().required('Effective date is required'),
  lower_bound: Yup.number().min(0, 'Must be positive').required('Lower bound is required'),
  upper_bound: Yup.number().nullable().test(
    'is-greater',
    'Upper bound must be greater than lower bound',
    function(value) {
      const { lower_bound } = this.parent;
      return !value || value > (lower_bound || 0);
    }
  ),
  rate: Yup.number().min(0).max(1, 'Rate must be between 0 and 1').required('Rate is required'),
  is_active: Yup.boolean(),
});

const initialValues: CreateTaxBandRequest = {
  effective_from: new Date().toISOString().split('T')[0],
  lower_bound: 0,
  upper_bound: null,
  rate: 0,
  is_active: true,
};

const TaxBandSettings = () => {
  const { data: bands, isLoading } = useTaxBands();
  const { createTaxBand, updateTaxBand, deleteTaxBand, isCreating, isUpdating, isDeleting } = useTaxBandMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  
  // States for Calculator & Year Filtering
  const [testSalary, setTestSalary] = useState<number | "">(100000);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // 1. Extract Unique Years for Tabs
  const availableYears = useMemo(() => {
    if (!bands) return [];
    const years = bands.map(b => b.effective_from.split('-')[0]);
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [bands]);

  // 2. Filter and Sort logic
  const filteredBands = useMemo(() => {
    if (!bands) return [];
    let result = [...bands];
    if (selectedYear !== 'All') {
      result = result.filter(b => b.effective_from.startsWith(selectedYear));
    }
    return result.sort((a, b) => {
      const dateDiff = new Date(b.effective_from).getTime() - new Date(a.effective_from).getTime();
      return dateDiff !== 0 ? dateDiff : Number(a.lower_bound) - Number(b.lower_bound);
    });
  }, [bands, selectedYear]);

  // 3. Tax Calculation logic
  const calculateBandTax = (income: number, lower: number, upper: number | null, rate: number) => {
    if (income <= lower) return 0;
    const taxableInThisBand = upper ? Math.min(income, upper) - lower : income - lower;
    return Math.max(0, taxableInThisBand * rate);
  };

  const totalTaxCalculated = useMemo(() => {
    if (!bands || bands.length === 0) return 0;
    const yearToCalc = selectedYear === 'All' ? availableYears[0] : selectedYear;
    return bands
      .filter(b => b.is_active && b.effective_from.startsWith(yearToCalc))
      .reduce((acc, band) => acc + calculateBandTax(Number(testSalary), Number(band.lower_bound), band.upper_bound ? Number(band.upper_bound) : null, Number(band.rate)), 0);
  }, [bands, testSalary, selectedYear, availableYears]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode && currentId) {
          await updateTaxBand({ id: currentId, data: values });
          toast.success("Tax band updated");
        } else {
          await createTaxBand(values);
          toast.success("New tax band registered");
        }
        setModalOpen(false);
      } catch (e) { toast.error("Operation failed"); }
    },
  });

  const handleEdit = (band: TaxBand) => {
    formik.setValues({
      effective_from: band.effective_from,
      lower_bound: Number(band.lower_bound),
      upper_bound: band.upper_bound ? Number(band.upper_bound) : null,
      rate: Number(band.rate),
      is_active: band.is_active,
    });
    setCurrentId(band.id);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleClone = (band: TaxBand) => {
    formik.setValues({
      effective_from: new Date().toISOString().split('T')[0],
      lower_bound: Number(band.lower_bound),
      upper_bound: band.upper_bound ? Number(band.upper_bound) : null,
      rate: Number(band.rate),
      is_active: true,
    });
    setCurrentId(null);
    setIsEditMode(false);
    setModalOpen(true);
    toast.info("Details copied to new entry");
  };

  return (
    <React.Fragment>
      <Card className="border-0 bg-light mb-4 shadow-none">
        <CardBody>
          <Row className="align-items-center">
            <Col md={3}>
              <Label className="text-uppercase fw-bold fs-11">PAYE Simulator ({selectedYear === 'All' ? 'Latest' : selectedYear})</Label>
              <Input type="number" value={testSalary === 0 ? "" : testSalary } 
              onChange={(e) => setTestSalary(Number(e.target.value))} placeholder="Enter Gross Salary" />
            </Col>
            <Col md={3} className="border-start text-center">
              <p className="text-muted mb-1 fs-12">ESTIMATED PAYE</p>
              <h4 className="text-danger mb-0">KES {totalTaxCalculated.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            </Col>
            <Col md={3} className="border-start text-center">
              <p className="text-muted mb-1 fs-12">NET AFTER PAYE</p>
              <h4 className="text-success mb-0">KES {(Number(testSalary) - totalTaxCalculated).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            </Col>
            <Col md={3} className="text-end">
              <Button color="primary" onClick={() => { setIsEditMode(false); setModalOpen(true); }}>
                <i className="ri-add-fill me-1"></i> Add Band
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="d-flex align-items-center mb-3">
        <Label className="me-3 mb-0 text-muted fw-bold fs-12 text-uppercase">Historical View:</Label>
        <Nav pills className="nav-pills-sm">
          <NavItem>
            <NavLink className={classnames({ active: selectedYear === 'All' })} onClick={() => setSelectedYear('All')} style={{cursor:'pointer'}}>All Time</NavLink>
          </NavItem>
          {availableYears.map(year => (
            <NavItem key={year}>
              <NavLink className={classnames({ active: selectedYear === year })} onClick={() => setSelectedYear(year)} style={{cursor:'pointer'}}>{year}</NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle table-nowrap">
          <thead className="table-light">
            <tr>
              <th>Effective Date</th>
              <th>Lower Bound</th>
              <th>Upper Bound</th>
              <th>Rate (%)</th>
              <th className="text-end">Band Tax</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-5"><Spinner color="primary" /></td></tr>
            ) : filteredBands.map((band) => {
              const bandTax = calculateBandTax(Number(testSalary), Number(band.lower_bound), band.upper_bound ? Number(band.upper_bound) : null, Number(band.rate));
              return (
                <tr key={band.id}>
                  <td className="fw-medium">{band.effective_from}</td>
                  <td>{Number(band.lower_bound).toLocaleString()}</td>
                  <td>{band.upper_bound ? Number(band.upper_bound).toLocaleString() : <Badge color="soft-dark">No Limit</Badge>}</td>
                  <td>
                    <span className="badge bg-info-subtle text-info fs-12">
                    {(Number(band.rate) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-end fw-bold text-primary">{bandTax > 0 ? bandTax.toLocaleString() : '-'}</td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button size="sm" color="light" onClick={() => handleEdit(band)}><i className="ri-pencil-fill"></i></Button>
                      <Button size="sm" color="soft-primary" onClick={() => handleClone(band)} title="Clone to today"><i className="ri-file-copy-2-line"></i></Button>
                      <Button size="sm" color="light" onClick={() => { setCurrentId(band.id); setDeleteModal(true); }}><i className="ri-delete-bin-fill text-danger"></i></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
        <ModalHeader className="bg-light p-3">{isEditMode ? 'Update Band' : 'Create Band'}</ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Row className="g-3">
              <Col md={12}>
                <FormGroup>
                  <Label>Effective Date</Label>
                  <Input type="date" {...formik.getFieldProps('effective_from')} invalid={!!(formik.touched.effective_from && formik.errors.effective_from)} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Lower Bound</Label>
                  <Input type="number" {...formik.getFieldProps('lower_bound')} invalid={!!(formik.touched.lower_bound && formik.errors.lower_bound)} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Upper Bound (Optional)</Label>
                  <Input type="number" {...formik.getFieldProps('upper_bound')} invalid={!!(formik.touched.upper_bound && formik.errors.upper_bound)} placeholder="Leave empty for infinity" />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Rate (e.g. 0.3 for 30%)</Label>
                  <Input type="number" step="0.0001" {...formik.getFieldProps('rate')} invalid={!!(formik.touched.rate && formik.errors.rate)} />
                  <FormFeedback>{formik.errors.rate as string}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit" disabled={isCreating || isUpdating}>Save Changes</Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalBody className="text-center p-5">
          <div className="text-danger mb-4"><i className="ri-delete-bin-line display-4"></i></div>
          <h4>Delete this band?</h4>
          <p className="text-muted">This action cannot be undone and will affect payroll calculations for this period.</p>
          <div className="d-flex gap-2 justify-content-center mt-4">
            <Button color="light" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button color="danger" onClick={async () => { if(currentId) await deleteTaxBand(currentId); setDeleteModal(false); }} disabled={isDeleting}>Delete Permanently</Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default TaxBandSettings;