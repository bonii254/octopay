import React from 'react';

interface PreviewProps {
    principal: number;
    tenure: number;
    rate: number;
    interestType: 'FLAT' | 'REDUCING';
}

export const RepaymentPreviewCard = ({ principal, tenure, rate, interestType }: PreviewProps) => {
    if (!principal || !tenure || !rate) return null;

    // Basic calculation for UI feedback (Backend handles exact precision)
    let totalInterest = 0;
    let monthlyInstallment = 0;

    if (interestType === 'FLAT') {
        totalInterest = (principal * rate * tenure) / 100;
        monthlyInstallment = (principal + totalInterest) / tenure;
    } else {
        // Simple reducing balance estimation
        const monthlyRate = rate / 100 / 12;
        monthlyInstallment = principal * (monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
        totalInterest = (monthlyInstallment * tenure) - principal;
    }

    const totalPayable = principal + totalInterest;

    return (
        <div className="card bg-light border-info mt-3 shadow-none">
            <div className="card-body p-3">
                <h6 className="card-title text-info mb-2"><i className="ri-information-line me-1"></i> Financial Preview</h6>
                <div className="row g-2 text-center text-muted">
                    <div className="col-4 border-end">
                        <small className="d-block">Est. Monthly</small>
                        <strong className="text-dark">KSh {monthlyInstallment.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong>
                    </div>
                    <div className="col-4 border-end">
                        <small className="d-block">Total Interest</small>
                        <strong className="text-dark">KSh {totalInterest.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong>
                    </div>
                    <div className="col-4">
                        <small className="d-block">Total Payable</small>
                        <strong className="text-dark">KSh {totalPayable.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};