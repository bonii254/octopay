import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Input, Alert } from 'reactstrap';

const ApprovalModal = ({ isOpen, toggle, log, onProcess, isProcessing }: any) => {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!isOpen) setRemarks("");
  }, [isOpen, log]);

  const handleSubmit = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await onProcess({ 
        id: log.id, 
        data: { qae_remarks: remarks, status } 
      });
      toggle();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered className="border-0">
      <ModalHeader toggle={toggle} className="bg-light border-bottom p-3">
        <span className="fw-bold">Review Inventory: {log.cooler_name}</span>
      </ModalHeader>
      <ModalBody className="bg-light-subtle">
        <Row className="mb-4">
          <Col md={4} className="text-center border-end">
            <h6 className="text-muted">Expected Closing</h6>
            <h5>{log.expected_closing_stock} Kg</h5>
          </Col>
          <Col md={4} className="text-center border-end">
            <h6 className="text-muted">Actual Reported</h6>
            <h5>{log.closing_stock_actual} Kg</h5>
          </Col>
          <Col md={4} className="text-center">
            <h6 className="text-muted">Variance</h6>
            <h5 className={Math.abs(log.variance_percent) > 5 ? "text-danger" : "text-success"}>
                {log.variance} Kg ({log.variance_percent}%)
            </h5>
          </Col>
        </Row>

        {Math.abs(log.variance_percent) > 5 && (
          <Alert color="danger" className="border-0 shadow-sm">
            <i className="ri-error-warning-line me-2"></i>
            This record has a high variance. Please verify before approving.
          </Alert>
        )}

        {log.opening_variance_reason && (
          <div className="mb-3 p-3 bg-white rounded border">
            <Label className="fw-bold text-primary">Attendant's Opening Note:</Label>
            <p className="mb-0 fst-italic text-muted">"{log.opening_variance_reason}"</p>
          </div>
        )}

        {log.qae_remarks && (
          <div className="mb-3 p-3 bg-white rounded border">
            <Label className="fw-bold text-primary">QAE Audit Remarks:</Label>
            <p className="mb-0 fst-italic text-muted">"{log.qae_remarks}"</p>
          </div>
        )}

        <div className="mt-3">
          <Label className="fw-bold">QAE Audit Remarks <span className="text-danger">*</span></Label>
          <Input 
            type="textarea" 
            rows={3} 
            placeholder="Add notes about your verification..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border-0 shadow-sm"
          />
        </div>
      </ModalBody>
      <ModalFooter className="bg-light border-top">
        <Button 
          color="danger" 
          outline 
          disabled={isProcessing || !remarks} 
          onClick={() => handleSubmit('REJECTED')}
          className="btn-label waves-effect waves-light"
        >
          <i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i>
          Reject & Revert
        </Button>
        <Button 
          color="success" 
          disabled={isProcessing || !remarks} 
          onClick={() => handleSubmit('APPROVED')}
          className="btn-label waves-effect waves-light"
        >
          <i className="ri-check-double-line label-icon align-middle fs-16 me-2"></i>
          {isProcessing ? "Processing..." : "Confirm & Approve"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ApprovalModal;