import React, { useState, useEffect } from 'react';
import { useFuelAttendant } from '../../Components/Hooks/useFuelAttendant';
import { Card, CardBody, Col, Container, Row, Input, Label, Button, Alert, FormFeedback } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useUser } from '../../Components/Hooks/useAuth'; 

const FuelDashboard = () => {
    const { 
        log, isLoading, isUpdating, isInitializing, formErrors, globalError, 
        setGlobalError, startDay, saveProgress 
    } = useFuelAttendant();
    
    const { data: userData, isLoading: isUserLoading } = useUser();
    
    const displayUsername = userData?.username || "Current Attendant"; 
    const displayCooler = userData?.active_cooler_name || "Assigned Cooler";
    const displayRoute = userData?.active_cooler_route || "Assigned Route";

    const [localClosingHrs, setLocalClosingHrs] = useState<string>("");
    const [localClosingLiters, setLocalClosingLiters] = useState<string>("");
    const [localTopUp, setLocalTopUp] = useState<string>("");

    useEffect(() => {
        if (log) {
            setLocalClosingHrs(log.closing_hours?.toString() || "");
            setLocalClosingLiters(log.closing_stock_liters?.toString() || "");
            setLocalTopUp(log.receipt_top_up?.toString() || "0");
        }
    }, [log]);

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
                    status={log?.status} 
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
                            <MetricWidget title="Opening (Ltrs)" value={log.opening_stock_liters} icon="ri-drop-line" color="secondary" />
                            <MetricWidget title="Total Available" value={log.total_available} icon="ri-safe-2-line" color="primary" />
                            <MetricWidget title="Fuel Used" value={log.fuel_used_liters} icon="ri-gas-station-line" color="warning" />
                            <MetricWidget title="Stock %" value={`${log.closing_stock_pct || 0}%`} icon="ri-temp-hot-line" color="info" />
                        </Row>
                        
                        <Row className="mb-4">
                            <MetricWidget title="Run Time" value={`${log.running_time_minutes} Hrs`} icon="ri-time-line" color="dark" />
                            <MetricWidget title="Actual Rate" value={`${log.actual_consumption_rate} L/H`} icon="ri-speed-line" color="primary" />
                            <MetricWidget title="Expected Rate" value={`${log.expected_consumption_rate} L/H`} icon="ri-speed-mini-line" color="secondary" />
                            <MetricWidget title="Efficiency" value={`${log.variance_percent}%`} icon="ri-funds-line" color={Math.abs(log.variance_percent || 0) > 10 ? "danger" : "success"} />
                        </Row>

                        <Row>
                            <Col lg={8}>
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title mb-4">Operational Records</h5>
                                        <Row className="gy-4">
                                            <Col md={6}>
                                                <Label>Opening Hours (Meter Reading)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={log.opening_hours || ""} 
                                                    disabled 
                                                    readOnly
                                                    className="bg-light"
                                                />
                                            </Col>

                                            <Col md={6}>
                                                <Label>Closing Hours (Current Reading)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localClosingHrs} 
                                                    invalid={!!formErrors.closing_hours}
                                                    disabled={!log.is_editable}
                                                    onChange={(e) => setLocalClosingHrs(e.target.value)}
                                                    onBlur={(e) => saveProgress({ id: log.id, data: { closing_hours: e.target.value } })} 
                                                />
                                                <FormFeedback>{formErrors.closing_hours}</FormFeedback>
                                            </Col>

                                            <Col md={4}>
                                                <Label>Receipt Top-up (Liters)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={localTopUp}
                                                    invalid={!!formErrors.receipt_top_up}
                                                    disabled={!log.is_editable}
                                                    onChange={(e) => setLocalTopUp(e.target.value)}
                                                    onBlur={(e) => saveProgress({ id: log.id, data: { receipt_top_up: e.target.value } })} 
                                                />
                                                <FormFeedback>{formErrors.receipt_top_up}</FormFeedback>
                                            </Col>

                                            <Col md={8}>
                                                <Label>Receipt Serial / Voucher No.</Label>
                                                <Input 
                                                    type="text" 
                                                    defaultValue={log.receipt_serial || ""} 
                                                    invalid={!!formErrors.receipt_serial}
                                                    disabled={!log.is_editable}
                                                    placeholder="e.g. F-99201"
                                                    onBlur={(e) => saveProgress({ id: log.id, data: { receipt_serial: e.target.value } })} 
                                                />
                                                <FormFeedback>{formErrors.receipt_serial}</FormFeedback>
                                            </Col>

                                            <Col md={12}>
                                                <Label>General Remarks</Label>
                                                <Input 
                                                    type="textarea" 
                                                    defaultValue={log.remarks || ""} 
                                                    disabled={!log.is_editable}
                                                    placeholder="Note issues..."
                                                    onBlur={(e) => saveProgress({ id: log.id, data: { remarks: e.target.value } })} 
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
                                                disabled={!log.is_editable}
                                                onChange={(e) => setLocalClosingLiters(e.target.value)}
                                            />
                                            <FormFeedback>{formErrors.closing_stock_liters}</FormFeedback>
                                        </div>
                                        
                                        <Button 
                                            color="primary" 
                                            className="w-100 py-2" 
                                            disabled={!log.is_editable || isUpdating || !localClosingLiters || !localClosingHrs}
                                            onClick={() => saveProgress({ 
                                                id: log.id, 
                                                data: { 
                                                    closing_stock_liters: localClosingLiters, 
                                                    closing_hours: localClosingHrs,
                                                    status: 'APPROVED' 
                                                } 
                                            })}
                                        >
                                            {isUpdating ? "Processing..." : "Submit to QAE"}
                                        </Button>

                                        {log.qae_remarks && (
                                            <div className="mt-4 p-3 bg-light rounded border border-warning">
                                                <h6 className="text-warning small fw-bold">QAE Feedback:</h6>
                                                <p className="mb-0 small">{log.qae_remarks}</p>
                                            </div>
                                        )}
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

/* --- Sub-Components --- */

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
                        <span className={`badge bg-${status === 'SUBMITTED' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'}-subtle text-${status === 'SUBMITTED' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'} fs-12 px-3 py-2`}>
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

    const handleStart = () => {
        onStart({ 
            opening_stock_liters: openingLtrs, 
            opening_hours: openingHrs 
        });
    };

    return (
        <Row className="justify-content-center mt-4">
            <Col xxl={5} lg={7}>
                <Card className="border-top border-info border-3 shadow-lg">
                    <CardBody className="p-4">
                        <div className="text-center mb-4">
                            <i className="ri-sun-fill display-4 text-info mb-2 d-block"></i>
                            <h5 className="text-primary">Morning Fuel Initialization</h5>
                            <p className="text-muted small">Verify readings before starting the log.</p>
                        </div>
                        
                        <div className="mb-3">
                            <Label>Physical Opening Stock (Liters) <span className="text-danger">*</span></Label>
                            <Input 
                                type="number" 
                                placeholder="0.00"
                                className="form-control-lg"
                                invalid={!!errors.opening_stock_liters}
                                onChange={(e) => setOpeningLtrs(e.target.value)} 
                            />
                            <FormFeedback>{errors.opening_stock_liters}</FormFeedback>
                        </div>

                        <div className="mb-4">
                            <Label>Generator Opening Hours <span className="text-danger">*</span></Label>
                            <Input 
                                type="number" 
                                placeholder="Current meter reading..."
                                className="form-control-lg"
                                invalid={!!errors.opening_hours}
                                onChange={(e) => setOpeningHrs(e.target.value)} 
                            />
                            <FormFeedback>{errors.opening_hours}</FormFeedback>
                        </div>

                        <Button 
                            color="info" 
                            size="lg" 
                            className="w-100" 
                            onClick={handleStart}
                            disabled={!openingLtrs || !openingHrs || isPending}
                        >
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