import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useLoans } from '../../../Components/Hooks/useLoanApplication';
import { LoanIntelligencePanel } from './LoanIntelligencePanel';
import { LoanApprovalActions } from './ApprovalActions';

const HRLoanManagementList = () => {
    const { data: loans } = useLoans();
    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (id?: number) => {
        setSelectedLoanId(id || null);
        setIsModalOpen(!isModalOpen);
    };

    const getInitials = (name: string) => {
        if (!name) return "??";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="page-content">
            <Card className="shadow-sm border-0">
                <CardBody>
                    <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                            <h5 className="mb-0 fw-bold">Loan Approval Queue</h5>
                            <p className="text-muted small mb-0">Review and approve employee loan requests</p>
                        </div>
                    </div>

                    <Table hover responsive className="align-middle table-nowrap mb-0">
                        <thead className="table-light text-muted">
                            <tr>
                                <th>Employee</th>
                                <th>Loan Type</th>
                                <th>Amount</th>
                                <th>Tenure</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loans?.filter(l => l.status === 'PENDING').map((loan) => (
                                <tr key={loan.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-xs">
                                                <div className="avatar-title rounded-circle bg-primary-subtle text-primary fw-bold">
                                                    {getInitials((loan as any).employee_name ?? "")}
                                                </div>
                                            </div>
                                            <div className="ms-2">
                                                <h6 className="mb-0">
                                                    <Link to={`/employees/view/${loan.employee_id}`}>
                                                        {(loan as any).employee_name}
                                                    </Link>
                                                </h6>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{(loan as any).loan_type_name}</td>

                                    <td>
                                        <strong>{loan.principal_amount}</strong>
                                    </td>

                                    <td>{loan.tenure_months} months</td>

                                    <td>
                                        <Badge color="warning">{loan.status}</Badge>
                                    </td>

                                    <td className="text-end">
                                        <Button size="sm" color="primary" onClick={() => toggleModal(loan.id)}>
                                            Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {(!loans || loans.filter(l => l.status === 'PENDING').length === 0) && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        No pending loan applications
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isModalOpen} toggle={() => toggleModal()} size="lg" centered>
                <ModalHeader toggle={() => toggleModal()}>
                    Loan Application #{selectedLoanId}
                </ModalHeader>

                <ModalBody>
                    {selectedLoanId && (
                        <Row>
                            <Col md={7}>
                                <LoanIntelligencePanel loanId={selectedLoanId} />
                            </Col>

                            <Col md={5}>
                                <LoanApprovalActions
                                    loanId={selectedLoanId}
                                    onComplete={() => toggleModal()}
                                />
                            </Col>
                        </Row>
                    )}
                </ModalBody>
            </Modal>
        </div>
    );
};

export default HRLoanManagementList;