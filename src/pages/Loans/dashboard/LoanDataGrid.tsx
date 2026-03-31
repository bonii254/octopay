import React from 'react';
import { Loan } from '../../../types/loanApplication';
import { LoanStatusBadge } from './LoanStatusBadge';

interface Props {
    loans: Loan[];
    onViewDetail: (id: number) => void;
    onApprove: (id: number) => void;
}

export const LoanDataGrid = ({ loans, onViewDetail, onApprove }: Props) => {
    return (
        <div className="card shadow-sm">
            <div className="card-header border-bottom-dashed d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Loan Portfolio</h5>
                <input type="text" className="form-control form-control-sm w-25" placeholder="Search loans..." />
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-sm table-hover table-nowrap align-middle mb-0">
                        <thead className="table-light text-muted">
                            <tr>
                                <th>ID</th>
                                <th>Employee ID</th>
                                <th>Principal</th>
                                <th>Tenure</th>
                                <th>Interest</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map(loan => (
                                <tr key={loan.id}>
                                    <td><a href="#" onClick={(e) => { e.preventDefault(); onViewDetail(loan.id); }} className="fw-medium text-primary">#LN-{loan.id}</a></td>
                                    <td>EMP-{loan.employee_id}</td>
                                    <td>{parseFloat(loan.principal_amount).toLocaleString()}</td>
                                    <td>{loan.tenure_months} mo</td>
                                    <td>{loan.interest_rate}% ({loan.interest_type})</td>
                                    <td><LoanStatusBadge status={loan.status} /></td>
                                    <td className="text-end">
                                        <div className="dropdown">
                                            <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="ri-more-fill align-middle"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><button className="dropdown-item" onClick={() => onViewDetail(loan.id)}><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View Ledger</button></li>
                                                {loan.status === 'PENDING' && (
                                                    <li><button className="dropdown-item text-success" onClick={() => onApprove(loan.id)}><i className="ri-check-line align-bottom me-2 text-success"></i> Approve</button></li>
                                                )}
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};