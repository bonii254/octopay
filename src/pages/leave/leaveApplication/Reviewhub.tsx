import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useLeaveApplications } from '../../../Components/Hooks/useLeaveApplications';
import { LeaveIntelligencePanel } from './LeaveIntelligencePanel';
import { ApprovalActions } from './ApprovalActions';

const HRLeaveManagementList = () => {
    const { data: allLeaves } = useLeaveApplications();
    const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (id?: number) => {
        setSelectedLeaveId(id || null);
        setIsModalOpen(!isModalOpen);
    };

    const getInitials = (name: string ) => {
        if (!name) return "??";
        return name
            .split(' ')
            .map(n => n)
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="page-content">
            <Card className="shadow-sm border-0">
                <CardBody>
                    <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                            <h5 className="mb-0 text-dark fw-bold">Leave Approval Queue</h5>
                            <p className="text-muted small mb-0">Manage pending leave requests and track employee attendance</p>
                        </div>
                    </div>

                    <Table hover responsive className="align-middle table-nowrap mb-0">
                        <thead className="table-light text-muted">
                            <tr>
                                <th scope="col">Employee Identity</th>
                                <th scope="col">Leave Type</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Status</th>
                                <th scope="col" className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLeaves?.filter(l => l.status === 'pending').map((leave) => (
                                <tr key={leave.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="avatar-xs">
                                                    <div className="avatar-title rounded-circle bg-primary-subtle text-primary fw-bold text-uppercase">
                                                        {getInitials(leave.employee_name ?? "")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ms-2">
                                                <h5 className="fs-14 mb-0">
                                                    <Link to={`/employees/view/${leave.employee_id}`} className="text-body fw-bold">
                                                        {leave.employee_name}
                                                    </Link>
                                                </h5>
                                                <p className="text-muted mb-0 fs-11 text-uppercase">
                                                    <i className="ri-fingerprint-line align-middle me-1"></i>
                                                    ID: {leave.employee_payroll || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fw-medium text-dark">{leave.leave_type_name}</span>
                                    </td>
                                    <td>
                                        <div className="text-muted small">
                                            <span className="text-dark fw-semibold">{leave.start_date}</span>
                                            <span className="mx-1">to</span>
                                            <span className="text-dark fw-semibold">{leave.end_date}</span>
                                        </div>
                                        <div className="text-muted fs-11 mt-1">
                                            {leave.total_days} {leave.total_days === 1 ? 'Day' : 'Days'}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge color="warning" className="text-uppercase border border-warning-subtle px-2 py-1">
                                            {leave.status}
                                        </Badge>
                                    </td>
                                    <td className="text-end">
                                        <Button 
                                            color="primary" 
                                            size="sm" 
                                            className="btn-soft-primary waves-effect waves-light shadow-none border-0"
                                            onClick={() => toggleModal(leave.id)}
                                        >
                                            <i className="ri-eye-line align-bottom me-1"></i> Review & Action
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {(!allLeaves || allLeaves.filter(l => l.status === 'pending').length === 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        No pending leave applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isModalOpen} toggle={() => toggleModal()} size="lg" centered className="border-0">
                <ModalHeader toggle={() => toggleModal()} className="bg-light border-bottom p-3">
                    <span className="fw-bold">Review Leave Application #{selectedLeaveId}</span>
                </ModalHeader>
                <ModalBody className="bg-light-subtle p-4">
                    {selectedLeaveId && (
                        <Row>
                            <Col md={7}>
                                <LeaveIntelligencePanel leaveId={selectedLeaveId} />
                            </Col>
                            
                            <Col md={5}>
                                <Card className="border-0 shadow-sm mb-0">
                                    <CardBody>
                                        <h6 className="fw-bold text-uppercase fs-12 mb-3">Final Decision</h6>
                                        <div className="alert alert-info alert-dismissible fade show border-0 mb-4" role="alert">
                                            <i className="ri-information-line me-2 align-middle fs-16"></i>
                                            Review department capacity and team overlaps before deciding.
                                        </div>
                                        <ApprovalActions 
                                            leaveId={selectedLeaveId} 
                                            onComplete={() => toggleModal()} 
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </ModalBody>
            </Modal>
        </div>
    );
};

export default HRLeaveManagementList;