import React from 'react';
import { Loan } from '../../../types/loanApplication';

export const LoanKPIWidgets = ({ loans }: { loans: Loan[] }) => {
    const totalLoans = loans.length;
    const pendingApprovals = loans.filter(l => l.status === 'PENDING').length;
    const totalOutstanding = loans.reduce((acc, l) => acc + parseFloat(l.outstanding_principal || '0'), 0);

    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <div className="card card-animate border-bottom border-3 border-primary shadow-sm">
                    <div className="card-body">
                        <h5 className="text-muted text-uppercase fs-13">Total Active Loans</h5>
                        <h2 className="mb-0">{totalLoans}</h2>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card card-animate border-bottom border-3 border-warning shadow-sm">
                    <div className="card-body">
                        <h5 className="text-muted text-uppercase fs-13">Pending Approvals</h5>
                        <h2 className="mb-0">{pendingApprovals}</h2>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card card-animate border-bottom border-3 border-success shadow-sm">
                    <div className="card-body">
                        <h5 className="text-muted text-uppercase fs-13">Total Outstanding Value</h5>
                        <h2 className="mb-0">KSh {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};