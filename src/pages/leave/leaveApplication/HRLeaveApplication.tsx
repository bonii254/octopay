import React, { useState, useMemo, useEffect } from 'react';
import { 
    Card, CardBody, Col, Row, Label, Input, Button, 
    Form, Alert, Spinner, Badge, ListGroup, ListGroupItem, CardHeader 
} from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { useEmployeesBase } from '../../../Components/Hooks/employee/useEmployeebase';
import { useLeaveTypes } from '../../../Components/Hooks/useLeaveType';
import { useLeavePreview, useLeaveActions } from '../../../Components/Hooks/useLeaveApplications';
import { LeavePortion, ICreateLeavePayload } from '../../../types/leaveApplication';
import { toast } from 'react-toastify';
import { handleBackendErrors } from '../../../helpers/form_utils';
import { useLocation } from 'react-router-dom'

const HRLeaveApplication = () => {
    // 1. SERVICES & HOOKS
    const { data: employees } = useEmployeesBase();
    const { data: leaveTypes } = useLeaveTypes();
    const { create, update } = useLeaveActions();
    
    // 2. FORM & ERROR STATE
    const initialFormState: ICreateLeavePayload = {
        employee_id: 0,
        leave_type_id: 0,
        start_date: '',
        end_date: '',
        start_portion: 'FULL',
        end_portion: 'FULL',
        reason: '',
    };

    const [formData, setFormData] = useState<ICreateLeavePayload>(initialFormState);
    const [files, setFiles] = useState<File[]>([]);
    const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
  
    const location = useLocation();

    useEffect(() => {
        if (location.state?.editLeave) {
            handleEditInitiated(location.state.editLeave);
            
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEditInitiated = (leave: any) => {
        setIsEditMode(true);
        setEditId(leave.id);
        setFormData({
            employee_id: leave.employee_id,
            leave_type_id: leave.leave_type_id,
            start_date: leave.start_date,
            end_date: leave.end_date,
            start_portion: leave.start_portion,
            end_portion: leave.end_portion,
            reason: leave.reason || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const resetForm = () => {
        setFormData(initialFormState);
        setFiles([]);
        setBackendErrors({});
        setGlobalError(null);
        setIsEditMode(false);
        setEditId(null);
    };

    const previewPayload = useMemo(() => ({
        employee_id: formData.employee_id,
        leave_type_id: formData.leave_type_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_portion: formData.start_portion,
        end_portion: formData.end_portion,
    }), [formData.employee_id, formData.leave_type_id, formData.start_date, formData.end_date, formData.start_portion, formData.end_portion]);

    const canPreview = !!(previewPayload.employee_id && previewPayload.leave_type_id && previewPayload.start_date && previewPayload.end_date);
    const { data: preview, isLoading: isPreviewLoading } = useLeavePreview(previewPayload as any, canPreview);

    const selectedEmployee = useMemo(() => employees?.find(e => e.id === formData.employee_id), [employees, formData.employee_id]);
    const selectedLeaveType = useMemo(() => leaveTypes?.find(l => l.id === formData.leave_type_id), [leaveTypes, formData.leave_type_id]);

    const filteredLeaveTypes = useMemo(() => {
        if (!selectedEmployee) return leaveTypes;
        return leaveTypes?.filter(lt => 
            !lt.gender_restriction || lt.gender_restriction === "ALL" || lt.gender_restriction === selectedEmployee.gender
        )
    }, [leaveTypes, selectedEmployee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendErrors({});
        setGlobalError(null);

        const data = new FormData();
        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, String(value));
        });
        files.forEach(file => data.append('documents', file));
        
        try {
            if (isEditMode && editId) {
                await update.mutateAsync({ id: editId, data });
                toast.success("Leave application updated successfully");
            } else {
                await create.mutateAsync(data);
                // On Success
                toast.success("Leave application submitted successfully");
                resetForm();
            }
        } catch (error: any) {
            handleBackendErrors(error, setBackendErrors, setGlobalError);
            
            if (globalError) {
                toast.error(globalError);
            } else {
                toast.error("Please check the form for errors.");
            }
            setTimeout(() => {
                setBackendErrors({});
                setGlobalError(null);
            }, 5000);
        }
    };

    const isSubmitting = create.isPending || update.isPending;

    return (
        <div className="page-content">
            {globalError && (
                <Alert color="danger" className="mb-4 border-0 shadow-sm animate__animated animate__shakeX">
                    <i className="ri-error-warning-line me-2"></i> {globalError}
                </Alert>
            )}

            <Row>
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <CardHeader className="bg-primary-subtle border-0 py-3">
                            <h5 className={`card-title mb-0 ${isEditMode ? 'text-info' : 'text-primary'}`}>
                                {isEditMode ? `Editing Application #${editId}` : "New Leave Request"}
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <fieldset disabled={isSubmitting}>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Label className="fw-semibold small text-uppercase">Employee</Label>
                                        <select 
                                            className={`form-select ${backendErrors.employee_id ? 'is-invalid' : 'border-light-subtle'}`} 
                                            value={formData.employee_id}
                                            onChange={(e) => setFormData({...formData, employee_id: Number(e.target.value), leave_type_id: 0})} 
                                            required
                                        >
                                            <option value="">Select Employee...</option>
                                            {employees?.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_code})</option>
                                            ))}
                                        </select>
                                        {backendErrors.employee_id && <div className="invalid-feedback">{backendErrors.employee_id}</div>}
                                    </Col>

                                    <Col md={6}>
                                        <Label className="fw-semibold small text-uppercase">Leave Type</Label>
                                        <select 
                                            className={`form-select ${backendErrors.leave_type_id ? 'is-invalid' : 'border-light-subtle'}`}
                                            value={formData.leave_type_id}
                                            onChange={(e) => setFormData({...formData, leave_type_id: Number(e.target.value)})}
                                            required
                                            disabled={!formData.employee_id}
                                        >
                                            <option value="">Select Category...</option>
                                            {filteredLeaveTypes?.map(lt => <option key={lt.id} value={lt.id}>{lt.name}</option>)}
                                        </select>
                                        {backendErrors.leave_type_id && <div className="invalid-feedback">{backendErrors.leave_type_id}</div>}
                                    </Col>

                                    <Col md={12}>
                                        <Label className="fw-semibold small text-uppercase">Duration & Date Range</Label>
                                        <Row className="g-2">
                                            <Col md={6}>
                                                <Flatpickr
                                                    className={`form-control ${backendErrors.start_date || backendErrors.end_date ? 'is-invalid border-danger' : 'border-light-subtle'}`}
                                                    placeholder="Select dates..."
                                                    value={[formData.start_date, formData.end_date]}
                                                    options={{ mode: "range", dateFormat: "Y-m-d", minDate: "today", disableMobile: true }}
                                                    onChange={(dates: Date[]) => {
                                                        if (dates.length === 2) {
                                                            const [start, end] = dates;
                                                            setFormData(p => ({
                                                                ...p, 
                                                                start_date: start.toLocaleDateString('en-CA'), 
                                                                end_date: end.toLocaleDateString('en-CA')
                                                            }));
                                                        }
                                                    }}
                                                />
                                                {(backendErrors.start_date || backendErrors.end_date) && (
                                                    <small className="text-danger mt-1 d-block">{backendErrors.start_date || backendErrors.end_date}</small>
                                                )}
                                            </Col>
                                            <Col md={3}>
                                                <Input type="select" value={formData.start_portion} onChange={(e) => setFormData({...formData, start_portion: e.target.value as LeavePortion})}>
                                                    <option value="FULL">Start: Full Day</option>
                                                    <option value="AM">Start: AM</option>
                                                    <option value="PM">Start: PM</option>
                                                </Input>
                                            </Col>
                                            <Col md={3}>
                                                <Input type="select" value={formData.end_portion} onChange={(e) => setFormData({...formData, end_portion: e.target.value as LeavePortion})}>
                                                    <option value="FULL">End: Full Day</option>
                                                    <option value="AM">End: AM</option>
                                                    <option value="PM">End: PM</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={12}>
                                        <Label className="fw-semibold small text-uppercase">Reason for Leave</Label>
                                        <textarea 
                                            className={`form-control ${backendErrors.reason ? 'is-invalid' : 'border-light-subtle'}`} 
                                            rows={3} 
                                            placeholder="Provide details for this request..." 
                                            value={formData.reason ?? ''}
                                            onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                                        />
                                        {backendErrors.reason && <div className="invalid-feedback">{backendErrors.reason}</div>}
                                    </Col>

                                    {selectedLeaveType?.requires_documentation && (
                                        <Col lg={12} className="animate__animated animate__fadeIn">
                                            <Alert color="info" className="mb-2 py-2 small border-0">
                                                <i className="ri-information-line me-1"></i> This leave type requires supporting documentation.
                                            </Alert>
                                            <Label className="fw-semibold small text-uppercase">Supporting Documents</Label>
                                            <Input 
                                                type="file" 
                                                multiple 
                                                className={`bg-light ${backendErrors.documents ? 'is-invalid' : ''}`} 
                                                onChange={(e) => setFiles(Array.from(e.target.files || []))} 
                                                required 
                                            />
                                            {backendErrors.documents && <div className="invalid-feedback">{backendErrors.documents}</div>}
                                        </Col>
                                    )}

                                    <Col lg={12} className="text-end border-top pt-4">
                                        <Button 
                                                color={isEditMode ? "info" : "primary"} 
                                                type="submit" 
                                                disabled={isSubmitting || (preview?.effective_remaining_after ?? 0) < 0} 
                                                className="px-5 shadow-sm"
                                            >
                                                {isSubmitting ? <Spinner size="sm" /> : (isEditMode ? "Update Application" : "Submit Application")}
                                        </Button>
                                    </Col>
                                </Row>
                                </fieldset>
                                
                            </Form>

                        </CardBody>
                        {isEditMode && (
                            <Button 
                                color="soft-danger" 
                                size="sm" 
                                className="px-3 fw-medium" 
                                onClick={resetForm}
                            >
                                <i className="ri-close-line align-middle me-1"></i> Cancel Edit
                            </Button>
                        )}
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm overflow-hidden h-100">
                        <div className="bg-primary p-3">
                            <h6 className="text-white mb-0">Application Preview</h6>
                        </div>
                        <CardBody className="bg-white">
                            {isPreviewLoading ? (
                                <div className="text-center py-5"><Spinner color="primary" /></div>
                            ) : preview ? (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="text-center mb-4">
                                        <h1 className="display-6 fw-bold text-primary mb-0">{preview.total_days}</h1>
                                        <small className="text-muted text-uppercase fw-semibold">Net Working Days</small>
                                    </div>

                                    <div className="p-3 bg-light rounded-3 mb-3">
                                        <div className="d-flex justify-content-between mb-2 small text-muted">
                                            <span>Current Available</span>
                                            <span className="fw-bold text-dark">{preview.database_balance} Days</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-0 border-top pt-2">
                                            <span className="small text-muted">Balance After</span>
                                            <span className={`fw-bold ${preview.effective_remaining_after < 0 ? 'text-danger' : 'text-success'}`}>
                                                {preview.effective_remaining_after} Days
                                            </span>
                                        </div>
                                    </div>

                                    {preview.holidays_in_range.length > 0 && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2 small fw-semibold text-muted">
                                                <Badge color="info" pill className="me-2">{preview.holidays_in_range.length}</Badge> Public Holidays
                                            </div>
                                            <ListGroup flush className="border rounded small">
                                                {preview.holidays_in_range.map((h: any, i: number) => (
                                                    <ListGroupItem key={i} className="py-1 px-2 d-flex justify-content-between">
                                                        <span>{h.name}</span>
                                                        <span className="text-muted text-xs">{h.date}</span>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    )}

                                    {preview.conflicts.length > 0 && (
                                        <div className="mb-0">
                                            <div className="d-flex align-items-center text-warning mb-2 small fw-semibold">
                                                <i className="ri-error-warning-fill me-1"></i> Overlap Warning
                                            </div>
                                            <ListGroup flush className="border rounded small border-warning-subtle">
                                                {preview.conflicts.map((c: any, i: number) => (
                                                    <ListGroupItem key={i} className="py-2 px-2 bg-warning-subtle text-warning-emphasis border-warning-subtle">
                                                        <div className="fw-bold">{c.status} Request</div>
                                                        <div className="text-xs">{c.start} to {c.end}</div>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="ri-calendar-todo-line display-4 text-light"></i>
                                    <p className="text-muted mt-2">Enter application details to see the impact on leave balance.</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HRLeaveApplication;