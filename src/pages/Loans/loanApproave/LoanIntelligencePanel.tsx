import React, { useMemo } from 'react';
import { Card, CardBody, Alert, Progress, Table, Badge, Spinner, Row, Col } from 'reactstrap';
import { useLoanDetails, useLoanStatement } from '../../../Components/Hooks/useLoanApplication';
import { useEmployeesBase } from '../../../Components/Hooks/employee/useEmployeebase';

interface Props {
    loanId: number;
}

export const LoanIntelligencePanel: React.FC<Props> = ({ loanId }) => {
    const { data: loan, isLoading: loanLoading } = useLoanDetails(loanId);
    const { data: statement, isLoading: statementLoading, isError } = useLoanStatement(loanId);
    const { data: employees } = useEmployeesBase();

    // ✅ Get employee like your form does
    const employee = useMemo(() => {
        return employees?.find(e => e.id === loan?.employee_id);
    }, [employees, loan]);

    if (loanLoading || statementLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner color="primary" />
            </div>
        );
    }

    if (isError || !loan || !statement) {
        return (
            <Alert color="danger" className="m-3">
                Failed to load loan intelligence data.
            </Alert>
        );
    }

    const financials = statement.summary.financials;

    // ✅ SAFE salary source
    const salary = Number(employee?.salary || 0);
    const principal = Number(loan.principal_amount || 0);

    // 🔥 Risk Engine (UPDATED)
    const getRiskLevel = () => {
        const ratio = salary > 0 ? (principal / salary) * 100 : 0;

        if (ratio > 50 || financials.repayment_progress_percentage < 20) {
            return { color: 'danger', icon: 'ri-error-warning-line', text: 'High Financial Risk' };
        }
        if (ratio > 30) {
            return { color: 'warning', icon: 'ri-alert-line', text: 'Moderate Risk' };
        }
        return { color: 'success', icon: 'ri-checkbox-circle-line', text: 'Healthy Loan' };
    };

    const risk = getRiskLevel();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'OVERDUE': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="d-flex flex-column gap-3">

            {/* 🔴 Risk Alert */}
            <Alert color={risk.color} className="mb-0 border-0 d-flex align-items-center">
                <i className={`${risk.icon} fs-16 me-2`}></i>
                <strong>{risk.text}:</strong>&nbsp;
                Repayment progress at {financials.repayment_progress_percentage}%.
            </Alert>

            {/* 📊 Core Metrics */}
            <Row className="g-3">
                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Loan Amount</h6>
                            <h4 className="mb-0">KES {Number(loan.principal_amount).toLocaleString()}</h4>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Outstanding Balance</h6>
                            <h4 className="mb-0">KES {Number(financials.total_balance_remaining).toLocaleString()}</h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* 💰 Salary Insight (NEW but matches style) */}
            <Row className="g-3">
                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Employee Salary</h6>
                            <h4 className="mb-0">
                                {salary ? `KES ${salary.toLocaleString()}` : 'N/A'}
                            </h4>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm={6}>
                    <Card className="border shadow-none mb-0">
                        <CardBody className="p-3 text-center">
                            <h6 className="text-muted text-uppercase fs-12 mb-2">Debt Ratio</h6>
                            <h4 className="mb-0">
                                {salary ? `${((principal / salary) * 100).toFixed(1)}%` : 'N/A'}
                            </h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* 📈 Progress */}
            <div>
                <div className="d-flex justify-content-between mb-1">
                    <span className="fs-13 text-muted fw-medium">Repayment Progress</span>
                    <span className="fs-13 fw-medium">{financials.repayment_progress_percentage}%</span>
                </div>
                <Progress
                    value={financials.repayment_progress_percentage}
                    color={risk.color}
                    style={{ height: "8px" }}
                />
            </div>

            {/* 📅 Repayment Table */}
            <div className="mt-2">
                <h6 className="fw-semibold fs-14 mb-3 d-flex align-items-center">
                    Upcoming Repayments
                    <Badge color="soft-secondary" className="ms-2">
                        {statement.upcoming_schedule.length}
                    </Badge>
                </h6>

                {statement.upcoming_schedule.length > 0 ? (
                    <div className="table-responsive border rounded">
                        <Table className="table-sm table-borderless align-middle mb-0">
                            <thead className="table-light text-muted fs-12">
                                <tr>
                                    <th className="ps-3">Due Date</th>
                                    <th>Amount</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="fs-13">
                                {statement.upcoming_schedule.map((item, index) => (
                                    <tr key={index} className="border-top">
                                        <td className="ps-3">{item.due_date}</td>
                                        <td>KES {Number(item.amount_due).toLocaleString()}</td>
                                        <td>KES {Number(item.principal).toLocaleString()}</td>
                                        <td>KES {Number(item.interest).toLocaleString()}</td>
                                        <td>
                                            <Badge color={getStatusColor(item.status)} className="text-uppercase fs-11">
                                                {item.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center p-4 border rounded bg-light-subtle text-muted fs-13">
                        No pending repayments.
                    </div>
                )}
            </div>
        </div>
    );
};