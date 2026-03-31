import React from 'react';
import { LoanStatus } from '../../../types/loanApplication';

export const LoanStatusBadge = ({ status }: { status: LoanStatus }) => {
    const badgeColor = {
        PENDING: 'warning',
        APPROVED: 'info',
        DISBURSED: 'success',
        CLOSED: 'dark',
        REJECTED: 'danger'
    }[status] || 'primary';

    return (
        <span className={`badge bg-${badgeColor} text-uppercase shadow-sm`}>
            {status}
        </span>
    );
};