import React, { useState } from 'react';
import { useLoans, useLoanMutation } from '../../Components/Hooks/useLoanApplication';
import { LoanKPIWidgets } from './dashboard/LoanKPIWidgets';
import { LoanDataGrid } from './dashboard/LoanDataGrid';
import { LoanApplicationDrawer } from './forms/LoanApplicationDrawer';

export default function LoanDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: loans = [], isLoading } = useLoans();
    const { approveLoan } = useLoanMutation();

    const handleViewDetail = (id: number) => {
        window.location.href = `/loans/${id}`; // Adjust based on your router (Next.js/React Router)
    };

    const handleApprove = async (id: number) => {
        if (window.confirm('Are you sure you want to approve this loan and generate the schedule?')) {
            await approveLoan(id);
        }
    };

    if (isLoading) return <div className="p-4 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid page-content">
            <div className="row mb-3 pb-1 border-bottom">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Loan Management Center</h4>
                    <button className="btn btn-primary shadow-sm" onClick={() => setIsDrawerOpen(true)}>
                        <i className="ri-add-line align-middle me-1"></i> New Application
                    </button>
                </div>
            </div>

            <LoanKPIWidgets loans={loans} />
            <LoanDataGrid loans={loans} onViewDetail={handleViewDetail} onApprove={handleApprove} />
            <LoanApplicationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            
            {/* Backdrop for Offcanvas */}
            {isDrawerOpen && <div className="offcanvas-backdrop fade show" onClick={() => setIsDrawerOpen(false)}></div>}
        </div>
    );
}