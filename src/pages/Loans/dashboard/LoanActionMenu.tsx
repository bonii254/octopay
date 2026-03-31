import React from 'react';
import { Loan } from '../../../types/loanApplication';

interface LoanActionMenuProps {
  loan: Loan;
  onAction: (action: string, loan: Loan) => void;
}

export const LoanActionMenu: React.FC<LoanActionMenuProps> = ({ loan, onAction }) => {
  return (
    <div className="dropdown d-inline-block">
      <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="ri-more-fill align-middle"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {loan.status === 'PENDING' && (
          <>
            <li><button className="dropdown-item edit-item-btn" onClick={() => onAction('EDIT', loan)}><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit Application</button></li>
            <li><button className="dropdown-item text-success" onClick={() => onAction('APPROVE', loan)}><i className="ri-check-line align-bottom me-2 text-success"></i> Approve</button></li>
            <li><button className="dropdown-item text-danger" onClick={() => onAction('REJECT', loan)}><i className="ri-close-line align-bottom me-2 text-danger"></i> Reject</button></li>
          </>
        )}
        
        {loan.status === 'APPROVED' && (
          <li><button className="dropdown-item" onClick={() => onAction('VIEW_SCHEDULE', loan)}><i className="ri-calendar-todo-line align-bottom me-2 text-muted"></i> View Schedule</button></li>
        )}

        {loan.status === 'DISBURSED' && (
          <>
            <li><button className="dropdown-item" onClick={() => onAction('STATEMENT', loan)}><i className="ri-file-list-3-line align-bottom me-2 text-muted"></i> Statement & Ledger</button></li>
            <li><button className="dropdown-item" onClick={() => onAction('REPAY', loan)}><i className="ri-hand-coin-line align-bottom me-2 text-muted"></i> Record Repayment</button></li>
            <div className="dropdown-divider"></div>
            <li><button className="dropdown-item text-info" onClick={() => onAction('TOP_UP', loan)}><i className="ri-arrow-up-circle-line align-bottom me-2 text-info"></i> Top-Up Loan</button></li>
          </>
        )}

        {loan.status === 'CLOSED' && (
          <li><button className="dropdown-item" onClick={() => onAction('STATEMENT', loan)}><i className="ri-history-line align-bottom me-2 text-muted"></i> View History</button></li>
        )}
      </ul>
    </div>
  );
};