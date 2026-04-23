import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, Badge, Input } from 'reactstrap';

import { useFuelAdmin } from '../../../Components/Hooks/useFuelAdmin';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import FuelApprovalModal from './FuelApprovalModal';
import TablePagination from '../../BackendPagination';

const FuelAuditList = () => {
    const [filters, setFilters] = useState({ 
        status: 'SUBMITTED', 
        search: '', 
        page: 1, 
        per_page: 10 
    });

    const { logs, pagination, isLoading, approveOrReject, isProcessing } = useFuelAdmin(filters);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (log?: any) => {
        if (log) setSelectedLog(log);
        setIsModalOpen(!isModalOpen);
    };

    const getStationInitials = (name: string) => {
        if (!name) return "ST";
        return name.split(' ').map(n => n).join('').toUpperCase().substring(0, 2);
    };
    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: number) => {
        setFilters(prev => ({ ...prev, per_page: newLimit, page: 1 }));
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Fuel Review" pageTitle="Inventory" />

                <Row className="mb-4 g-3">
                    <Col lg={3}>
                        <select 
                            className="form-select border-0 shadow-sm"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                        >
                            <option value="DRAFT">Returned / Drafts</option>
                            <option value="APPROVED">Approved Records</option>
                            <option value="REJECTED">Rejected Records</option>
                        </select>
                    </Col>
                    <Col lg={4}>
                        <div className="search-box">
                            <Input 
                                type="text" 
                                className="form-control border-0 shadow-sm" 
                                placeholder="Search by station..." 
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </Col>
                </Row>

                <Card className="shadow-sm border-0">
                    <CardBody>
                        <div className="d-flex align-items-center mb-4">
                            <div className="flex-grow-1">
                                <h5 className="mb-0 text-dark fw-bold">Fuel Audit Queue</h5>
                                <p className="text-muted small mb-0">Verify fuel levels and consumption variances</p>
                            </div>
                        </div>

                        <Table hover responsive className="align-middle table-nowrap mb-0">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>Station</th>
                                    <th>Date</th>
                                    <th>Opening</th>
                                    <th>Top Up</th>
                                    <th>Consumption</th>
                                    <th>Variance</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Loading fuel logs...
                                        </td>
                                    </tr>
                                ) : logs.length > 0 ? (
                                    logs.map((log: any) => (
                                        <tr key={log.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-xs me-2">
                                                        <div className="avatar-title rounded-circle bg-soft-info text-info fw-bold">
                                                            {getStationInitials(log.cooler_name)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-13 mb-0 text-dark fw-bold">{log.cooler_name}</h5>
                                                        <p className="text-muted mb-0 fs-11">
                                                            Attendant: {log.attendant_name || 'System'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{new Date(log.date).toLocaleDateString()}</td>
                                            <td>{log.opening_stock_liters} L</td>
                                            <td>{log.receipt_top_up} L</td>
                                            <td>{log.fuel_used_liters} L</td>
                                            <td>
                                                <span className={Math.abs(log.variance_percent) > 3 ? "text-danger fw-bold" : "text-success"}>
                                                    {log.variance_liters} L ({log.variance_percent}%)
                                                </span>
                                            </td>
                                            <td>
                                                <Badge color={log.status === 'APPROVED' ? 'success' : log.status === 'REJECTED' ? 'danger' : 'secondary'}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                            <td className="text-end">
                                                <Button color="primary" size="sm" outline onClick={() => toggleModal(log)}>
                                                    Review
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4 text-muted">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {!isLoading && logs.length > 0 && (
                            <TablePagination 
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                                pageSize={filters.per_page}
                                currentLength={logs.length}
                            />
                        )}
                    </CardBody>
                </Card>
            </Container>

            {selectedLog && (
                <FuelApprovalModal 
                    isOpen={isModalOpen} 
                    toggle={() => setIsModalOpen(false)} 
                    log={selectedLog}
                    onProcess={approveOrReject}
                    isProcessing={isProcessing}
                />
            )}
        </div>
    );
};

export default FuelAuditList;