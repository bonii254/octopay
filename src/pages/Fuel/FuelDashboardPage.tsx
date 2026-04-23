import React, { useState, useEffect } from 'react';
import { useFuelAttendant } from '../../Components/Hooks/useFuelAttendant';
import { Card, CardBody, Col, Container, Row, Input, Label, Button, Alert, FormFeedback } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useUser } from '../../Components/Hooks/useAuth'; 

const FuelDashboard = () => {
    const { 
        log, isLoading, isUpdating, isInitializing, formErrors, globalError, 
        setGlobalError, startDay, saveProgress, rejectedLogs 
    } = useFuelAttendant();
    
    const { data: userData, isLoading: isUserLoading } = useUser();

    const [activeLog, setActiveLog] = useState<any>(null);
    
    const displayUsername = userData?.username || "Current Attendant"; 
    const displayCooler = userData?.active_cooler_name || "Assigned Cooler";
    const displayRoute = userData?.active_cooler_route || "Assigned Route";

    const [localOpeningHrs, setLocalOpeningHrs] = useState<string>("");
    const [localClosingHrs, setLocalClosingHrs] = useState<string>("");
    const [localClosingLiters, setLocalClosingLiters] = useState<string>("");
    const [localTopUp, setLocalTopUp] = useState<string>("");
    const [localOpeningLiters, setLocalOpeningLiters] = useState<string>("");

    const canEdit = activeLog?.is_editable || activeLog?.status === 'REJECTED' || activeLog?.status === 'DRAFT';

    useEffect(() => {
        if (log && !activeLog) {
            setActiveLog(log);
        }
    }, [log]);

    useEffect(() => {
        if (activeLog) {
            setLocalOpeningHrs(activeLog.opening_hours?.toString() || "");
            setLocalClosingHrs(activeLog.closing_hours?.toString() || "");
            setLocalClosingLiters(activeLog.closing_stock_liters?.toString() || "");
            setLocalTopUp(activeLog.receipt_top_up?.toString() || "0");
            setLocalOpeningLiters(activeLog.opening_stock_liters?.toString() || "0");
        }
    }, [activeLog?.id]);

    const handleAutoSave = async (fieldData: object) => {
        if (!activeLog?.id) return;
        
        try {
            const updatedData = await saveProgress({ 
                id: activeLog.id, 
                data: fieldData 
            });
            
            if (updatedData) {
                setActiveLog(updatedData);
            }
        } catch (err) {
            console.error("Auto-save failed", err);
        }
    };

    const handleSelectRejected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = e.target.value;
        if (selectedId === "today") {
            setActiveLog(log);
        } else {
            const found = rejectedLogs.find((r: any) => r.id.toString() === selectedId);
            if (found) setActiveLog(found);
        }
    };

    if (isLoading || isUserLoading) {
        return (
            <div className="p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Fuel Daily Log" pageTitle="Inventory" />

                {rejectedLogs.length > 0 && (
                    <Card className="border-start border-warning border-3 mb-4">
                        <CardBody>
                            <Row className="align-items-center">
                                <Col md={4}>
                                    <h6 className="text-warning mb-0">
                                        <i className="ri-error-warning-fill me-2"></i>
                                        Pending Corrections
                                    </h6>
                                </Col>
                                <Col md={8}>
                                    <Input type="select" onChange={handleSelectRejected} value={activeLog?.id || "today"}>
                                        <option value="today">--- Today's Active Log ---</option>
                                        {rejectedLogs.map((r: any) => (
                                            <option key={r.id} value={r.id}>
                                                Fix Log: {new Date(r.created_at).toLocaleDateString()} (Reason: {r.qae_remarks?.substring(0, 20)}...)
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                )}

                {globalError && (
                    <Alert color="danger" className="alert-dismissible fade show">
                        <i className="ri-error-warning-line me-2 align-middle"></i>
                        {globalError}
                        <button type="button" className="btn-close" onClick={() => setGlobalError(null)}></button>
                    </Alert>
                )}

                <DashboardHeader 
                    username={displayUsername} 
                    coolerName={displayCooler} 
                    routeName={displayRoute} 
                    status={activeLog?.status || log?.status} 
                />

                {!log ? (
                    <MorningInitCard 
                        onStart={startDay} 
                        errors={formErrors} 
                        isPending={isInitializing} 
                    />
                ) : (
                    <>
                        <Row className="mb-3">
                            <MetricWidget title="Opening (Ltrs)" value={activeLog?.opening_stock_liters || 0} icon="ri-drop-line" color="secondary" />
                            <MetricWidget title="Total Available" value={activeLog?.total_available || 0} icon="ri-safe-2-line" color="primary" />
                            <MetricWidget title="Fuel Used" value={activeLog?.fuel_used_liters || 0} icon="ri-gas-station-line" color="warning" />
                            <MetricWidget title="Stock %" value={`${activeLog?.closing_stock_pct || 0}%`} icon="ri-temp-hot-line" color="info" />
                        </Row>
                        
                        <Row className="mb-4">
                            <MetricWidget title="Run Time" value={`${activeLog?.running_time_minutes || 0} Hrs`} icon="ri-time-line" color="dark" />
                            <MetricWidget title="Actual Rate" value={`${activeLog?.actual_consumption_rate || 0} L/H`} icon="ri-speed-line" color="primary" />
                            <MetricWidget title="Efficiency" value={`${activeLog?.variance_percent || 0}%`} icon="ri-funds-line" color={Math.abs(activeLog?.variance_percent || 0) > 10 ? "danger" : "success"} />
                        </Row>

                        <Row>
                            <Col lg={8}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-4">Operational Records</h5>
                                        <Row className="gy-4">
                                            <Col md={4}>
                                                <Label>Opening Stock (Liters)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localOpeningLiters} 
                                                    invalid={!!formErrors.opening_stock_liters}
                                                    disabled={!canEdit}
                                                    onChange={(e) => setLocalOpeningLiters(e.target.value)}
                                                    onBlur={(e) => handleAutoSave({ opening_stock_liters: e.target.value })} 
                                                />
                                                <FormFeedback>{formErrors.opening_stock_liters}</FormFeedback>
                                            </Col>
                                            <Col md={4}>
                                                <Label>Opening Hours</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localOpeningHrs} 
                                                    invalid={!!formErrors.opening_hours}
                                                    disabled={!canEdit}
                                                    onChange={(e) => setLocalOpeningHrs(e.target.value)}
                                                    onBlur={(e) => handleAutoSave({ opening_hours: e.target.value })} 
                                                />
                                                <FormFeedback>{formErrors.opening_hours}</FormFeedback>
                                            </Col>

                                            <Col md={4}>
                                                <Label>Closing Hours</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localClosingHrs} 
                                                    invalid={!!formErrors.closing_hours}
                                                    disabled={!canEdit}
                                                    onChange={(e) => setLocalClosingHrs(e.target.value)}
                                                    onBlur={(e) => handleAutoSave({ closing_hours: e.target.value })} 
                                                />
                                                <FormFeedback>{formErrors.closing_hours}</FormFeedback>
                                            </Col>

                                            <Col md={4}>
                                                <Label>Receipt Top-up (Liters)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localTopUp}
                                                    invalid={!!formErrors.receipt_top_up}
                                                    disabled={!canEdit}
                                                    onChange={(e) => setLocalTopUp(e.target.value)}
                                                    onBlur={(e) => handleAutoSave({ receipt_top_up: e.target.value })} 
                                                />
                                            </Col>
                                            
                                            <Col md={8}>
                                                <Label>Receipt Serial / Voucher No.</Label>
                                                <Input 
                                                    type="text" 
                                                    defaultValue={activeLog?.receipt_serial || ""} 
                                                    disabled={!canEdit}
                                                    onBlur={(e) => handleAutoSave({ receipt_serial: e.target.value })} 
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg={4}>
                                <Card className="card-height-100 border-start border-primary border-3">
                                    <CardBody>
                                        <h5 className="card-title mb-4">Daily Closing Stock</h5>
                                        <div className="mb-3">
                                            <Label>Physical Closing Stock (Liters)</Label>
                                            <Input 
                                                type="number" 
                                                className="form-control-lg border-primary"
                                                value={localClosingLiters}
                                                invalid={!!formErrors.closing_stock_liters}
                                                disabled={!canEdit}
                                                onChange={(e) => setLocalClosingLiters(e.target.value)}
                                                onBlur={(e) => handleAutoSave({ closing_stock_liters: e.target.value })}
                                            />
                                        </div>
                                        
                                        <Button 
                                            color="primary" 
                                            className="w-100 py-2" 
                                            disabled={!canEdit || isUpdating || !localClosingLiters || !localClosingHrs}
                                            onClick={() => handleAutoSave({ 
                                                closing_stock_liters: localClosingLiters, 
                                                closing_hours: localClosingHrs,
                                                status: 'SUBMITTED' 
                                            })}
                                        >
                                            {isUpdating ? "Processing..." : (activeLog?.status === 'REJECTED' ? "Resubmit Correction" : "Submit to QAE")}
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
};


const DashboardHeader = ({ username, coolerName, routeName, status }: any) => (
    <Card className="bg-light-subtle shadow-none border mb-4">
        <CardBody className="py-3 px-4">
            <Row className="align-items-center">
                <Col sm={8}>
                    <div className="d-flex align-items-center">
                        <div className="avatar-sm flex-shrink-0 me-3">
                            <span className="avatar-title bg-info-subtle text-info rounded-circle fs-4">
                                <i className="ri-charging-pile-2-line"></i>
                            </span>
                        </div>
                        <div>
                            <h5 className="fs-14 mb-1">Attendant: <span className="text-primary">{username}</span></h5>
                            <p className="text-muted mb-0">{coolerName} | {routeName}</p>
                        </div>
                    </div>
                </Col>
                <Col sm={4} className="text-sm-end">
                    {status && (
                        <span className={`badge bg-${status === 'DRAFT' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'}-subtle text-${status === 'DRAFT' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'} fs-12 px-3 py-2`}>
                            {status}
                        </span>
                    )}
                </Col>
            </Row>
        </CardBody>
    </Card>
);

const MorningInitCard = ({ onStart, errors, isPending }: any) => {
    const [openingLtrs, setOpeningLtrs] = useState("");
    const [openingHrs, setOpeningHrs] = useState("");

    return (
        <Row className="justify-content-center mt-4">
            <Col xxl={5} lg={7}>
                <Card className="border-top border-info border-3 shadow-lg">
                    <CardBody className="p-4">
                        <div className="text-center mb-4">
                            <i className="ri-sun-fill display-4 text-info mb-2 d-block"></i>
                            <h5 className="text-primary">Morning Fuel Initialization</h5>
                        </div>
                        <div className="mb-3">
                            <Label>Physical Opening Stock (Liters)</Label>
                            <Input type="number" invalid={!!errors.opening_stock_liters} onChange={(e) => setOpeningLtrs(e.target.value)} />
                            <FormFeedback>{errors.opening_stock_liters}</FormFeedback>
                        </div>
                        <div className="mb-4">
                            <Label>Generator Opening Hours</Label>
                            <Input type="number" invalid={!!errors.opening_hours} onChange={(e) => setOpeningHrs(e.target.value)} />
                            <FormFeedback>{errors.opening_hours}</FormFeedback>
                        </div>
                        <Button color="info" size="lg" className="w-100" onClick={() => onStart({ opening_stock_liters: openingLtrs, opening_hours: openingHrs })} disabled={isPending}>
                            {isPending ? "Initialising..." : "Begin Daily Log"}
                        </Button>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

const MetricWidget = ({ title, value, icon, color }: any) => (
    <Col lg={3} md={6}>
        <Card className={`card-animate bg-${color}-subtle border-0 mb-3`}>
            <CardBody>
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <p className="text-uppercase fw-medium text-muted mb-0 fs-11">{title}</p>
                        <h4 className={`fs-18 fw-bold mb-0 mt-1 text-${color === 'dark' ? 'dark' : color}`}>
                            {typeof value === 'number' ? value.toLocaleString(undefined, {minimumFractionDigits: 2}) : value || '0.00'}
                        </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                        <span className={`avatar-title bg-${color} rounded fs-3`}>
                            <i className={icon}></i>
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    </Col>
);

export default FuelDashboard;