import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Input, Alert } from 'reactstrap';

const FuelApprovalModal = ({ isOpen, toggle, log, onProcess, isProcessing }: any) => {
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (!isOpen) setRemarks("");
    }, [isOpen]);

    const handleSubmit = async (status: 'APPROVED' | 'REJECTED') => {
        await onProcess({ 
            id: log.id, 
            data: { qae_remarks: remarks, status } 
        });
        toggle();
    };

    const isHighVariance = Math.abs(log.variance_percent) > 3;

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Fuel Inventory Review: {log.cooler_name}</ModalHeader>
            <ModalBody>
                <Row className="text-center mb-3">
                    <Col>
                        <p className="text-muted mb-1">Expected Consumption Rate</p>
                        <h6>{log.expected_consumption_rate} L/H</h6>
                    </Col>
                    <Col>
                        <p className="text-muted mb-1">Actual Consumption Rate</p>
                        <h6>{log.actual_consumption_rate} L/H</h6>
                    </Col>
                    <Col>
                        <p className="text-muted mb-1">Closing Stock liters</p>
                        <h6>{log.closing_stock_liters} L</h6>
                       </Col>
                </Row>

                {isHighVariance && (
                    <Alert color="warning" className="small">
                        High fuel variance detected. Attendant need to cross-check readings.
                    </Alert>
                )}

                {log.qae_remarks && (
                  <div className="mb-3 p-3 bg-white rounded border">
                    <Label className="fw-bold text-primary">QAE Audit Remarks:</Label>
                    <p className="mb-0 fst-italic text-muted">"{log.qae_remarks}"</p>
                  </div>
                )}

                <div className="mb-3">
                    <Label className="fw-bold">QAE Audit Remarks <span className="text-danger">*</span></Label>
                    <Input 
                        type="textarea" 
                        value={remarks} 
                        onChange={(e) => setRemarks(e.target.value)} 
                        placeholder="Explain approval/rejection reason..."
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="light" onClick={toggle} disabled={isProcessing}>Cancel</Button>
                <Button 
                    color="danger" 
                    outline 
                    onClick={() => handleSubmit('REJECTED')}
                    disabled={isProcessing || !remarks}
                >Reject</Button>
                <Button 
                    color="success" 
                    onClick={() => handleSubmit('APPROVED')}
                    disabled={isProcessing || !remarks}
                >
                    {isProcessing ? "Processing..." : "Approve Fuel Log"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default FuelApprovalModal;