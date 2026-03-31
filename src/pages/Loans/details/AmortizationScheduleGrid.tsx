import React from 'react';
import { LoanStatement } from '../../../types/loanApplication';

export const AmortizationScheduleGrid = ({ schedule }: { schedule: LoanStatement['upcoming_schedule'] }) => {
    return (
        <div className="table-responsive">
            <table className="table table-sm table-bordered table-striped align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Due Date</th>
                        <th className="text-end">Principal Comp.</th>
                        <th className="text-end">Interest Comp.</th>
                        <th className="text-end fw-bold">Total Due</th>
                        <th className="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((row, idx) => (
                        <tr key={idx} className={row.status === 'PAID' ? 'table-success text-muted' : ''}>
                            <td>{new Date(row.due_date).toLocaleDateString()}</td>
                            <td className="text-end">{parseFloat(row.principal).toLocaleString()}</td>
                            <td className="text-end">{parseFloat(row.interest).toLocaleString()}</td>
                            <td className="text-end fw-bold">{parseFloat(row.amount_due).toLocaleString()}</td>
                            <td className="text-center">
                                <span className={`badge bg-${row.status === 'PAID' ? 'success' : row.status === 'OVERDUE' ? 'danger' : 'warning'}`}>
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};