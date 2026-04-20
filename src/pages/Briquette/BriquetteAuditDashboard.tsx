import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Button, Badge } from 'reactstrap';
import { 
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel, 
    ColumnDef 
} from '@tanstack/react-table';

import { useBriquetteAdmin } from '../../Components/Hooks/useOversightBriqurtte';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ApprovalModal from './BriquetteApprovalModal';
import TablePagination from '../TablePagination';

const BriquetteAuditList = () => {
    const [filters, setFilters] = useState({ status: 'DRAFT', search: '' });

    
    const { logs, isLoading, approveOrReject, isProcessing } = useBriquetteAdmin(filters);
    
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const columns = useMemo<ColumnDef<any>[]>(() => [
        { header: "Station & Attendant", accessorKey: "cooler_name" },
        { header: "Date", accessorKey: "date" },
        { header: "Opening Stock", accessorKey: "opening_stock" },
        { header: "Consumption", accessorKey: "total_consumption" },
        { header: "Variance", accessorKey: "variance" },
        { header: "Status", accessorKey: "status" },
    ], []);

    const tableData = useMemo(() => logs || [], [logs]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 }
        }
    });

    const toggleModal = (log?: any) => {
        if (log) setSelectedLog(log);
        setIsModalOpen(!isModalOpen);
    };

    const getStationInitials = (name: string) => {
        if (!name) return "ST";
        return name.split(' ').map(n => n).join('').toUpperCase().substring(0, 2);
    };

    // 🔥 FIX: Strict status options (match backend validation)
    const STATUS_OPTIONS = [
        { value: "DRAFT", label: "Returned / Drafts" },
        { value: "APPROVED", label: "Approved Records" },
        { value: "REJECTED", label: "Rejected Records" }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DRAFT": return "secondary";
            case "REJECTED": return "danger";
            case "APPROVED": return "success";
            default: return "light";
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Inventory Review" pageTitle="QAE" />

                <Row className="mb-4">

                    <Col lg={3}>
                        <select 
                            className="form-select border-0 shadow-sm"
                            value={filters.status}
                            onChange={(e) => 
                                setFilters(prev => ({ ...prev, status: e.target.value }))
                            }
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>

                <Card className="shadow-sm border-0">
                    <CardBody>
                        <div className="d-flex align-items-center mb-4">
                            <div className="flex-grow-1">
                                <h5 className="mb-0 text-dark fw-bold">Briquette Audit Queue</h5>
                                <p className="text-muted small mb-0">
                                    Review daily consumption logs and verify stock variances
                                </p>
                            </div>
                        </div>

                        <Table hover responsive className="align-middle table-nowrap mb-0">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>Station & Attendant</th>
                                    <th>Date</th>
                                    <th>Opening Stock</th>
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
                                            <div className="spinner-border text-primary spinner-border-sm"></div>
                                            <span className="ms-2 text-muted">Loading logs...</span>
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.map(row => {
                                    const log = row.original;

                                    return (
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

                                            <td><span className="fw-medium">{log.opening_stock} Kg</span></td>

                                            <td><span className="fw-medium">{log.total_consumption} Kg</span></td>

                                            <td>
                                                <span className={
                                                    Math.abs(log.variance_percent) > 5 
                                                        ? "text-danger fw-bold" 
                                                        : "text-success"
                                                }>
                                                    {log.variance} Kg ({log.variance_percent}%)
                                                </span>
                                            </td>

                                            <td>
                                                <Badge 
                                                    color={getStatusColor(log.status)} 
                                                    className="text-uppercase px-2"
                                                >
                                                    {log.status}
                                                </Badge>
                                            </td>

                                            <td className="text-end">
                                                <Button 
                                                    color="primary" 
                                                    size="sm" 
                                                    className="btn-soft-primary border-0" 
                                                    onClick={() => toggleModal(log)}
                                                >
                                                    <i className="ri-eye-line align-bottom me-1"></i> Review
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {tableData.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            No audit records found for <strong>{filters.status}</strong> 
                                            {filters.search && ` matching "${filters.search}"`}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {!isLoading && tableData.length > 0 && (
                            <TablePagination table={table} />
                        )}
                    </CardBody>
                </Card>
            </Container>

            {selectedLog && (
                <ApprovalModal 
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

export default BriquetteAuditList;