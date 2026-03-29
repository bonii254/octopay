import React from 'react';
import { Card, CardBody, Alert, Progress, Table, Badge, Spinner, Row, Col } from 'reactstrap';
import { useLeaveIntelligence } from '../../../Components/Hooks/useLeaveApplications';
import { AlertLevel, LeaveStatus } from '../../../types/leaveApplication';

interface LeaveIntelligencePanelProps {
    leaveId: number;
}

export const LeaveIntelligencePanel: React.FC<LeaveIntelligencePanelProps> = ({ leaveId }) => {
    const { data: response, isLoading, isError } = useLeaveIntelligence(leaveId);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner color="primary" />
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <Alert color="danger" className="m-3">
                Failed to load department intelligence data. Please try again.
            </Alert>
        );
    }

    const intel = response.data;

    const getAlertConfig = (level: AlertLevel) => {
        switch (level) {
            case 'CRITICAL': return { color: 'danger', icon: 'ri-error-warning-line', text: 'Critical Capacity Risk' };
            case 'WARNING': return { color: 'warning', icon: 'ri-alert-line', text: 'Capacity Warning' };
            case 'NORMAL': default: return { color: 'success', icon: 'ri-checkbox-circle-line', text: 'Normal Operations' };
        }
    };

    const getStatusBadgeColor = (status: LeaveStatus) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    const alertConfig = getAlertConfig(intel.alert_level);

    return (
        <div className="d-flex flex-column gap-3">
            {/* Alert Banner */}
            <Alert color={alertConfig.color} className="mb-0 shadow-none border-0 d-flex align-items-center">
                <i className={`${alertConfig.icon} fs-16 me-2`}></i>
                <strong>{alertConfig.text}:</strong>&nbsp; 
                Projected to operate at {intel.remaining_capacity_percent}% capacity.
            </Alert>

            {/* Core Metrics */}
            <Row className="g-3">
                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Department Size</h6>
                            <h4 className="mb-0">{intel.department_size} <span className="text-muted fs-13 fw-normal">Employees</span></h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Projected Headcount</h6>
                            <h4 className="mb-0">{intel.projected_headcount} <span className="text-muted fs-13 fw-normal">Available</span></h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Capacity Progress */}
            <div>
                <div className="d-flex justify-content-between mb-1">
                    <span className="fs-13 text-muted fw-medium">Remaining Capacity</span>
                    <span className="fs-13 fw-medium">{intel.remaining_capacity_percent}%</span>
                </div>
                <Progress 
                    value={intel.remaining_capacity_percent} 
                    color={alertConfig.color} 
                    className="animated-progress" 
                    style={{ height: "8px" }} 
                />
            </div>

            {/* Conflict Table */}
            <div className="mt-2">
                <h6 className="fw-semibold fs-14 mb-3 d-flex align-items-center">
                    Department Overlaps
                    <Badge color="soft-secondary" className="text-secondary ms-2 rounded-pill">
                        {intel.conflict_count}
                    </Badge>
                </h6>
                
                {intel.conflicts.length > 0 ? (
                    <div className="table-responsive border rounded">
                        <Table className="table-sm table-borderless align-middle mb-0">
                            <thead className="table-light text-muted fs-12">
                                <tr>
                                    <th className="ps-3">Employee</th>
                                    <th>Dates</th>
                                    <th>Days</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="fs-13">
                                {intel.conflicts.map((conflict, index) => (
                                    <tr key={index} className="border-top">
                                        <td className="ps-3 fw-medium">{conflict.employee_name}</td>
                                        <td>{conflict.dates}</td>
                                        <td>{conflict.total_days}</td>
                                        <td>
                                            <Badge color={getStatusBadgeColor(conflict.status)} className="badge-soft-custom text-uppercase fs-11">
                                                {conflict.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center p-4 border rounded bg-light-subtle text-muted fs-13">
                        <i className="ri-calendar-check-line fs-24 d-block mb-1 text-success opacity-75"></i>
                        No overlapping leave applications found in this department.
                    </div>
                )}
            </div>
        </div>
    );
};