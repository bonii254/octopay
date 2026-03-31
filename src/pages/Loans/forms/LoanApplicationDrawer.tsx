import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateLoanRequest, InterestType } from '../../../types/loanApplication';
import { useLoanMutation } from '../../../Components/Hooks/useLoanApplication';
import { RepaymentPreviewCard } from '../shared/RepaymentPreviewCard';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoanApplicationDrawer = ({ isOpen, onClose }: DrawerProps) => {
    const { applyForLoan, isApplying } = useLoanMutation();

    const formik = useFormik<CreateLoanRequest>({
        initialValues: {
            employee_id: 0,
            loan_type_id: 1,
            principal_amount: '',
            tenure_months: 12,
            interest_type: 'REDUCING',
            interest_rate: '14.0' // Smart default based on loan_type_id
        },
        validationSchema: Yup.object({
            employee_id: Yup.number().required('Required').min(1, 'Select an employee'),
            principal_amount: Yup.number().required('Required').positive('Must be positive').max(5000000, 'Exceeds limit'),
            tenure_months: Yup.number().required('Required').min(1).max(48, 'Max tenure is 48 months'),
            interest_rate: Yup.number().required('Required').positive()
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await applyForLoan(values);
                resetForm();
                onClose();
            } catch (error) {
                console.error("Application failed", error);
            }
        }
    });

    return (
        <div className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} tabIndex={-1} style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title">New Loan Application</h5>
                <button type="button" className="btn-close text-reset" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Employee ID</label>
                        <input type="number" className={`form-control ${formik.errors.employee_id && formik.touched.employee_id ? 'is-invalid' : ''}`} {...formik.getFieldProps('employee_id')} />
                        {formik.touched.employee_id && formik.errors.employee_id ? <div className="invalid-feedback">{formik.errors.employee_id}</div> : null}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Principal Amount (KSh)</label>
                        <input type="number" className={`form-control ${formik.errors.principal_amount && formik.touched.principal_amount ? 'is-invalid' : ''}`} {...formik.getFieldProps('principal_amount')} />
                        {formik.touched.principal_amount && formik.errors.principal_amount ? <div className="invalid-feedback">{formik.errors.principal_amount}</div> : null}
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tenure (Months)</label>
                            <input type="number" className={`form-control ${formik.errors.tenure_months && formik.touched.tenure_months ? 'is-invalid' : ''}`} {...formik.getFieldProps('tenure_months')} />
                            {formik.touched.tenure_months && formik.errors.tenure_months ? <div className="invalid-feedback">{formik.errors.tenure_months}</div> : null}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Interest Rate (%)</label>
                            <input type="number" step="0.1" className={`form-control ${formik.errors.interest_rate && formik.touched.interest_rate ? 'is-invalid' : ''}`} {...formik.getFieldProps('interest_rate')} />
                        </div>
                    </div>

                    <RepaymentPreviewCard 
                        principal={Number(formik.values.principal_amount)} 
                        tenure={Number(formik.values.tenure_months)} 
                        rate={Number(formik.values.interest_rate)} 
                        interestType={formik.values.interest_type as InterestType} 
                    />

                    <div className="mt-4 text-end">
                        <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isApplying}>
                            {isApplying ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};