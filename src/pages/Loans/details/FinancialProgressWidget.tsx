import React from 'react';
import { LoanStatement } from '../../../types/loanApplication';

export const FinancialProgressWidget = ({ statement }: { statement: LoanStatement }) => {
    const { financials } = statement.summary;
    const progress = financials.repayment_progress_percentage;

    return (
        <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-uppercase fw-semibold text-muted mb-0">Repayment Progress</h6>
                    <span className="badge bg-success">{progress}% Paid</span>
                </div>
                <div className="progress progress-xl bg-soft-success">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="row mt-3 text-center">
                    <div className="col-4 border-end">
                        <p className="text-muted mb-1 fs-12">Total Expected</p>
                        <h6 className="mb-0">{parseFloat(financials.total_repayment_amount).toLocaleString()}</h6>
                    </div>
                    <div className="col-4 border-end">
                        <p className="text-muted mb-1 fs-12">Total Paid</p>
                        <h6 className="mb-0 text-success">{parseFloat(financials.total_amount_paid).toLocaleString()}</h6>
                    </div>
                    <div className="col-4">
                        <p className="text-muted mb-1 fs-12">Remaining Balance</p>
                        <h6 className="mb-0 text-danger">{parseFloat(financials.total_balance_remaining).toLocaleString()}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};