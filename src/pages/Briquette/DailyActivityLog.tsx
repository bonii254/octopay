import React from 'react';
import { useFormik } from 'formik';
import { Row, Col, Card, CardBody, Label, Input, Button, Form, Spinner, FormFeedback } from 'reactstrap';
import * as Yup from 'yup';
import { useBriquetteAttendant } from '../../Components/Hooks/useBriquette';
import { BriquetteLog } from '../../types/briquette';

const DailyActivityLog = ({ log }: { log: BriquetteLog }) => {
  const { saveProgress, isUpdating } = useBriquetteAttendant();

  const formik = useFormik({
    initialValues: {
      receipts: log.receipts || 0,
      receipt_serial: log.receipt_serial || '',
      am_consumption: log.am_consumption || 0,
      pm_consumption: log.pm_consumption || 0,
      transfers: log.transfers || 0,
      closing_stock_actual: log.closing_stock_actual || 0,
      remarks: log.remarks || '',
    },
    validationSchema: Yup.object({
        closing_stock_actual: Yup.number().min(0).nullable(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => saveProgress({ id: log.id, data: values }),
  });

  const handleFinalSubmit = () => {
    // Marshmallow schema requires 'closing_stock_actual' if status is SUBMITTED
    if (!formik.values.closing_stock_actual || formik.values.closing_stock_actual === 0) {
        formik.setFieldError('closing_stock_actual', "Physical closing is required to submit.");
        return;
    }
    saveProgress({ id: log.id, data: { ...formik.values, status: 'SUBMITTED' } });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col lg={8}>
          {/* Stock In & Transfers Card */}
          <Card className="shadow-sm border-0 mb-3">
            <CardBody className="p-4">
              <h6 className="text-muted text-uppercase fw-semibold mb-4 fs-12">Stock In & Transfers</h6>
              <Row>
                <Col md={6}>
                  <Label className="form-label fs-13">New Receipts (KG)</Label>
                  <Input name="receipts" type="number" placeholder="0.00" value={formik.values.receipts} onChange={formik.handleChange} />
                </Col>
                <Col md={6}>
                  <Label className="form-label fs-13">Receipt Serial Number</Label>
                  <Input name="receipt_serial" placeholder="SR123..." value={formik.values.receipt_serial} onChange={formik.handleChange} />
                </Col>
              </Row>
              <Row className="mt-3 mb-0">
                <Col md={12}>
                  <Label className="form-label fs-13">Stock Transfers Out (KG)</Label>
                  <Input name="transfers" type="number" placeholder="0.00" value={formik.values.transfers} onChange={formik.handleChange} />
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Consumption & Closing Card */}
          <Card className="shadow-sm border-0 mb-0">
            <CardBody className="p-4">
              <h6 className="text-muted text-uppercase fw-semibold mb-4 fs-12">Consumption & Closing</h6>
              <Row>
                <Col md={6}>
                  <Label className="form-label fs-13">AM Consumption (KG)</Label>
                  <Input name="am_consumption" type="number" placeholder="0.00" value={formik.values.am_consumption} onChange={formik.handleChange} />
                </Col>
                <Col md={6}>
                  <Label className="form-label fs-13">PM Consumption (KG)</Label>
                  <Input name="pm_consumption" type="number" placeholder="0.00" value={formik.values.pm_consumption} onChange={formik.handleChange} />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={12}>
                  <Label className="form-label text-danger fw-bold fs-14 mb-1">Actual Physical Closing Stock (KG)</Label>
                  <p className="text-muted mb-2 fs-11">Input physical count before end of day.</p>
                  <Input 
                    name="closing_stock_actual" 
                    type="number" 
                    className="form-control-lg border-danger fs-18 fw-bold" 
                    placeholder="0.00"
                    value={formik.values.closing_stock_actual} 
                    onChange={formik.handleChange} 
                    invalid={!!formik.errors.closing_stock_actual}
                  />
                  <FormFeedback>{formik.errors.closing_stock_actual}</FormFeedback>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* Action Column */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 sticky-side-div">
            <CardBody className="p-4">
              <h6 className="text-muted text-uppercase fw-semibold mb-4 fs-12">Actions</h6>
              <Button color="success" className="w-100 mb-2 btn-label" type="submit" disabled={isUpdating}>
                <i className="ri-save-line label-icon align-middle fs-16 me-2"></i>
                {isUpdating ? <Spinner size="sm" /> : "Save Progress (Draft)"}
              </Button>
              <Button color="primary" className="w-100 btn-label" onClick={handleFinalSubmit} disabled={isUpdating}>
                <i className="ri-lock-2-line label-icon align-middle fs-16 me-2"></i>
                {isUpdating ? <Spinner size="sm" /> : "Submit to QAE for Approval"}
              </Button>
              
              <hr className="text-muted my-4" />
              
              <Label className="form-label fs-13 text-muted">Attendant Remarks (Optional)</Label>
              <Input 
                  name="remarks" 
                  type="textarea" 
                  rows={6} 
                  placeholder="Notes about today's inventory..."
                  value={formik.values.remarks} 
                  onChange={formik.handleChange} 
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default DailyActivityLog;