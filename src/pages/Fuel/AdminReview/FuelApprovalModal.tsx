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
                        <p className="text-muted mb-1">Expected</p>
                        <h6>{log.expected_closing_stock} L</h6>
                    </Col>
                    <Col>
                        <p className="text-muted mb-1">Actual</p>
                        <h6>{log.closing_stock_actual} L</h6>
                    </Col>
                    <Col>
                        <p className="text-muted mb-1">Variance</p>
                        <h6 className={isHighVariance ? "text-danger" : "text-success"}>
                            {log.variance} L ({log.variance_percent}%)
                        </h6>
                    </Col>
                </Row>

                {isHighVariance && (
                    <Alert color="warning" className="small">
                        High fuel variance detected. Please cross-check dip-stick readings.
                    </Alert>
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