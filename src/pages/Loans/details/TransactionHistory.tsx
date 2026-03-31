import React from 'react';
import { LoanTransaction } from '../../../types/loanApplication';

export const TransactionHistory = ({ transactions }: { transactions: LoanTransaction[] }) => {
    if (transactions.length === 0) return <div className="text-center text-muted p-4">No transactions recorded yet.</div>;

    return (
        <ul className="list-group list-group-flush">
            {transactions.map(tx => (
                <li key={tx.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div>
                        <h6 className="mb-1"><i className="ri-arrow-right-up-line text-success me-1"></i> Payment via {tx.method}</h6>
                        <small className="text-muted">Ref: {tx.reference} | {new Date(tx.date).toLocaleString()}</small>
                    </div>
                    <div className="text-end">
                        <span className="fw-bold text-success">+ KSh {parseFloat(tx.amount).toLocaleString()}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
};