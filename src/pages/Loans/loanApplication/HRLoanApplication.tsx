import React, { useState, useMemo, useEffect } from 'react';
import { 
    Card, CardBody, Col, Row, Label, Input, Button, 
    Form, Alert, Spinner, CardHeader, Badge, ListGroup, ListGroupItem 
} from 'reactstrap';
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

import { useEmployeesBase } from '../../../Components/Hooks/employee/useEmployeebase';
import { useLoanTypes } from '../../../Components/Hooks/useLoanType';
import { useLoans, useLoanMutation } from '../../../Components/Hooks/useLoanApplication'; 
import { CreateLoanRequest, Loan } from '../../../types/loanApplication';
import { handleBackendErrors } from '../../../helpers/form_utils';


const HRLoanApplication = () => {
    const { data: employees } = useEmployeesBase();
    const { data: loanTypes } = useLoanTypes();
    const { applyForLoan, updateLoan, isApplying, isUpdating } = useLoanMutation();
    
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<CreateLoanRequest>({
        employee_id: 0,
        loan_type_id: 0,
        principal_amount: "", 
        tenure_months: 1,
        interest_type: 'FLAT',
    });

    const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const isEditMode = Boolean(location.state?.editLoan);

    // --- DATA FETCHING ---
    const { data: existingLoans } = useLoans(
        { employee_id: formData.employee_id || undefined },
        { enabled: !!formData.employee_id }
    );

    useEffect(() => {
        if (location.state?.editLoan) {
            const loan = location.state.editLoan;
            setFormData({
                id: loan.id,
                employee_id: loan.employee_id,
                loan_type_id: loan.loan_type_id,
                principal_amount: String(loan.principal_amount),
                tenure_months: loan.tenure_months,
                interest_type: loan.interest_type || 'FLAT',
            });
        }
    }, [location.state]);

    // 1. SEARCHABLE EMPLOYEE OPTIONS
    const employeeOptions = useMemo(() => {
        return employees?.map(e => ({
            value: e.id,
            label: `${e.first_name} ${e.last_name} — ${e.employee_code}`,
        })) || [];
    }, [employees]);

    const selectedLoanType = useMemo(() =>
        loanTypes?.find(l => l.id === formData.loan_type_id),
    [loanTypes, formData.loan_type_id]);

    const selectedEmployee = useMemo(() =>
        employees?.find(e => e.id === formData.employee_id),
    [employees, formData.employee_id]);

    const activeDuplicateLoan = useMemo(() => {
      if (!formData.employee_id || !formData.loan_type_id || !existingLoans) return null;

      return existingLoans
        .filter(loan => Number(loan.employee_id) === Number(formData.employee_id)) 
        .find((loan: Loan) => 
            Number(loan.loan_type_id) === Number(formData.loan_type_id) &&
            ['PENDING', 'APPROVED', 'DISBURSED'].includes(loan.status) &&
            loan.id !== formData.id
        );
    }, [formData.employee_id, formData.loan_type_id, existingLoans, formData.id]);

    const eligibility = useMemo(() => {
        const requested = Number(formData.principal_amount || 0);
        if (!selectedEmployee || !selectedLoanType || requested === 0) return null;

        const salary = Number(selectedEmployee.salary || 0);
        const percentage = Number(selectedLoanType.max_amount_percentage || 0);
        const maxEligible = (salary * percentage) / 100;
        const isEligible = requested <= maxEligible;

        return { salary, percentage, maxEligible, requested, isEligible };
    }, [selectedEmployee, selectedLoanType, formData.principal_amount]);

    const loanComputation = useMemo(() => {
        const principal = parseFloat(formData.principal_amount || "0");
        const tenure = formData.tenure_months;
        const rate = selectedLoanType?.interest_rate ?? 0;
        const type = formData.interest_type;

        if (!principal || !tenure || tenure <= 0) return null;

        const monthlyRate = rate / (12 * 100);
        let emi = 0, totalPayable = 0, totalInterest = 0;

        if (type === "FLAT") {
            totalInterest = (principal * rate * tenure) / (12 * 100);
            totalPayable = principal + totalInterest;
            emi = totalPayable / tenure;
        } else {
            emi = monthlyRate === 0 ? principal / tenure : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
            totalPayable = emi * tenure;
            totalInterest = totalPayable - principal;
        }

        return {
            emi: emi.toFixed(2),
            totalPayable: totalPayable.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
        };
    }, [formData, selectedLoanType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendErrors({});
        setGlobalError(null);

        if (activeDuplicateLoan) {
            toast.error("Employee already has an active loan of this type.");
            return;
        }

        if (eligibility && !eligibility.isEligible) {
            toast.error("Loan exceeds eligibility limit");
            return;
        }

        const payload = {
          ...formData,
          principal_amount: parseFloat(formData.principal_amount),
          tenure_months: Number(formData.tenure_months),
          employee_id: Number(formData.employee_id),
          loan_type_id: Number(formData.loan_type_id)
        };
        const mutationOptions = {
            onSuccess: () => {
                const message = isEditMode 
                    ? "Loan application updated successfully" 
                    : "Loan application submitted successfully";

                toast.success(message);

                setTimeout(() => {
                    navigate('/loan-list');
                }, 2000);
            },
            onError: (err: any) => {
                handleBackendErrors(err, setBackendErrors, setGlobalError);
            }
        };

        try {
            if (isEditMode && formData.id) {
                await updateLoan({ id: formData.id, data: formData });
                toast.success("Loan application updated successfully");
            } else {
                await applyForLoan(formData);
                toast.success("Loan application submitted successfully");
            }
            navigate('/loan-list'); 
        } catch (err: any) {
            handleBackendErrors(err, setBackendErrors, setGlobalError);
        }
    };

    const isSubmitting = isApplying || isUpdating;

    return (
        <div className="page-content">
            <Row>
                <Col lg={8}>
                    {activeDuplicateLoan && (
                        <Alert color="danger" className="border-0 shadow-sm mb-4 d-flex align-items-center">
                            <i className="ri-error-warning-line fs-24 me-3"></i>
                            <div>
                                <h6 className="alert-heading mb-1">Active Loan Detected</h6>
                                <p className="mb-0 small">
                                    {selectedEmployee?.first_name} already has an active <strong>{selectedLoanType?.name}</strong>. 
                                    Please process a <strong>Top-Up</strong> on existing loan (Dated: {activeDuplicateLoan.start_date}, Amount: Ksh {activeDuplicateLoan.principal_amount}).
                                </p>
                            </div>
                        </Alert>
                    )}

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="bg-white border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="card-title mb-1 text-primary">
                                        {isEditMode ? "Modify Loan Application" : "Loan Application Entry"}
                                    </h5>
                                    <p className="text-muted mb-0 small">Search employee by name or payroll number.</p>
                                </div>
                                <Badge color={isEditMode ? "soft-warning" : "soft-primary"} className="fs-12">
                                    {isEditMode ? "Editing Record" : "New Request"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardBody className="p-4">
                            {globalError && <Alert color="danger" className="border-0 shadow-sm mb-4">{globalError}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="gy-4">
                                    <Col md={6}>
                                        <Label className="form-label fw-bold small text-uppercase text-muted">Employee Selection</Label>
                                        <Select
                                            options={employeeOptions}
                                            placeholder="Search Name or Code..."
                                            classNamePrefix="react-select"
                                            isLoading={!employees}
                                            isDisabled={isEditMode}
                                            value={employeeOptions.find(opt => opt.value === formData.employee_id)}
                                            onChange={(selected) => setFormData({ ...formData, employee_id: selected ? selected.value : 0 })}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '38px',
                                                    borderColor: backendErrors.employee_id ? '#f06548' : '#ced4da',
                                                    boxShadow: 'none',
                                                    '&:hover': { borderColor: '#405189' }
                                                }),
                                                menuList: (base) => ({
                                                    ...base,
                                                    maxHeight: '250px', // Restricts to approx 8 items
                                                })
                                            }}
                                        />
                                        {backendErrors.employee_id && <div className="text-danger small mt-1">{backendErrors.employee_id}</div>}
                                    </Col>

                                    <Col md={6}>
                                        <Label className="form-label fw-bold small text-uppercase text-muted">Loan Category</Label>
                                        <select
                                            className={`form-select ${backendErrors.loan_type_id ? 'is-invalid' : ''}`}
                                            value={formData.loan_type_id}
                                            onChange={(e) => setFormData({ ...formData, loan_type_id: Number(e.target.value) })}
                                            required
                                        >
                                            <option value="">Select Category...</option>
                                            {loanTypes?.map(l => <option key={l.id} value={l.id}>{l.name} ({l.interest_rate}%)</option>)}
                                        </select>
                                    </Col>

                                    <Col md={4}>
                                        <Label className="form-label fw-bold small text-uppercase text-muted">Principal Amount (KES)</Label>
                                        <Input
                                            type="number"
                                            className={backendErrors.principal_amount ? 'is-invalid' : ''}
                                            value={formData.principal_amount}
                                            onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
                                            required
                                        />
                                    </Col>

                                    <Col md={4}>
                                        <Label className="form-label fw-bold small text-uppercase text-muted">Interest Method</Label>
                                        <select 
                                            className="form-select"
                                            value={formData.interest_type}
                                            onChange={(e) => setFormData({ ...formData, interest_type: e.target.value as any })}
                                        >
                                            <option value="FLAT">Flat Rate</option>
                                            <option value="REDUCING">Reducing Balance</option>
                                        </select>
                                    </Col>

                                    <Col md={4}>
                                        <Label className="form-label fw-bold small text-uppercase text-muted">Tenure (Months)</Label>
                                        <Input
                                            type="number"
                                            value={formData.tenure_months}
                                            onChange={(e) => setFormData({ ...formData, tenure_months: Number(e.target.value) })}
                                            required
                                        />
                                    </Col>

                                    <Col lg={12} className="text-end pt-3 border-top mt-4">
                                        <Button color="light" type="button" className="me-2" onClick={() => navigate(-1)}>Cancel</Button>
                                        <Button
                                            color="primary"
                                            disabled={isSubmitting || !!activeDuplicateLoan || (eligibility ? !eligibility.isEligible : false)}
                                        >
                                            {isSubmitting ? <Spinner size="sm" /> : (isEditMode ? "Update Application" : "Submit Application")}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm mb-4">
                        <CardHeader className="bg-soft-info border-0">
                            <h6 className="card-title mb-0 fs-14">Eligibility Check</h6>
                        </CardHeader>
                        <CardBody>
                            {!eligibility ? (
                                <div className="text-center py-3">
                                    <p className="text-muted small mb-0">Select criteria to see status.</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className={`avatar-md mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-soft-${eligibility.isEligible ? 'success' : 'danger'}`}>
                                        <i className={`ri-${eligibility.isEligible ? 'checkbox-circle-fill' : 'error-warning-fill'} fs-24 text-${eligibility.isEligible ? 'success' : 'danger'}`}></i>
                                    </div>
                                    <h5 className={`mb-1 text-${eligibility.isEligible ? 'success' : 'danger'}`}>
                                        {eligibility.isEligible ? "Qualified" : "Limit Exceeded"}
                                    </h5>
                                    <p className="text-muted small">Max: KES {eligibility.maxEligible.toLocaleString()}</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <CardHeader className="bg-transparent border-0">
                            <h6 className="card-title mb-0 text-white fs-14">Repayment Summary</h6>
                        </CardHeader>
                        <CardBody className="pt-0">
                            {loanComputation ? (
                                <>
                                    <div className="mb-4">
                                        <label className="text-white-50 small mb-1">Estimated Monthly EMI</label>
                                        <h2 className="text-white mb-0">KES {parseFloat(loanComputation.emi).toLocaleString()}</h2>
                                    </div>
                                    <ListGroup flush className="bg-transparent text-white">
                                        <ListGroupItem className="bg-transparent border-white-10 px-0 d-flex justify-content-between small text-white">
                                            <span>Total Interest</span>
                                            <span>KES {parseFloat(loanComputation.totalInterest).toLocaleString()}</span>
                                        </ListGroupItem>
                                        <ListGroupItem className="bg-transparent border-white-10 px-0 d-flex justify-content-between small text-white">
                                            <span>Total Repayment</span>
                                            <span>KES {parseFloat(loanComputation.totalPayable).toLocaleString()}</span>
                                        </ListGroupItem>
                                    </ListGroup>
                                </>
                            ) : (
                                <div className="text-center py-4 text-white-50 small">Enter loan details to calculate.</div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HRLoanApplication;