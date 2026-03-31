import React, { useState } from 'react';
import { useLoanStatement } from '../../Components/Hooks/useLoanApplication';
import { LoanStatusBadge } from './dashboard/LoanStatusBadge';
import { FinancialProgressWidget } from './details/FinancialProgressWidget';
import { AmortizationScheduleGrid } from './details/AmortizationScheduleGrid';
import { TransactionHistory } from './details/TransactionHistory';

// Assume you get `id` from useParams() or router query
export default function LoanDetailLayout({ loanId }: { loanId: number }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'history'>('overview');
    const { data: statement, isLoading } = useLoanStatement(loanId);

    if (isLoading || !statement) return <div className="p-4 text-center"><div className="spinner-border"></div></div>;

    const { summary, upcoming_schedule, recent_transactions } = statement;

    return (
        <div className="container-fluid page-content">
            {/* Header */}
            <div className="card shadow-sm mb-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="card-title mb-1">Loan #{summary.loan_id} ({summary.loan_type})</h4>
                        <p className="text-muted mb-0">Started: {new Date(summary.start_date).toLocaleDateString()} | Rate: {summary.interest_rate}%</p>
                    </div>
                    <div className="text-end">
                        <LoanStatusBadge status={summary.status} />
                        <div className="mt-2">
                            {summary.status === 'DISBURSED' && (
                                <>
                                    <button className="btn btn-sm btn-success me-2">Record Repayment</button>
                                    <button className="btn btn-sm btn-outline-primary">Top-Up</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs nav-tabs-custom nav-success mb-3">
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{cursor: 'pointer'}}>Overview</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} style={{cursor: 'pointer'}}>Amortization Schedule</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{cursor: 'pointer'}}>Transactions</a>
                </li>
            </ul>

            {/* Content */}
            <div className="row">
                <div className="col-12">
                    {activeTab === 'overview' && (
                        <div className="row">
                            <div className="col-lg-6">
                                <FinancialProgressWidget statement={statement} />
                            </div>
                            <div className="col-lg-6">
                                <div className="card border border-warning shadow-none">
                                    <div className="card-body">
                                        <h6 className="card-title text-warning"><i className="ri-alarm-warning-line me-1"></i> Next Due Alert</h6>
                                        {upcoming_schedule.find(s => s.status === 'PENDING') ? (
                                            <div>
                                                <h3 className="mb-0 text-dark">KSh {parseFloat(upcoming_schedule.find(s => s.status === 'PENDING')!.amount_due).toLocaleString()}</h3>
                                                <p className="text-muted">Due on {new Date(upcoming_schedule.find(s => s.status === 'PENDING')!.due_date).toLocaleDateString()}</p>
                                            </div>
                                        ) : (
                                            <p className="text-muted mb-0">No upcoming pending payments.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'schedule' && (
                        <div className="card shadow-sm"><div className="card-body p-0"><AmortizationScheduleGrid schedule={upcoming_schedule} /></div></div>
                    )}

                    {activeTab === 'history' && (
                        <div className="card shadow-sm"><div className="card-body"><TransactionHistory transactions={recent_transactions} /></div></div>
                    )}
                </div>
            </div>
        </div>
    );
}