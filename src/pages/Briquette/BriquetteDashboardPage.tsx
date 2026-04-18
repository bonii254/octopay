import React, { useState, useEffect } from 'react';
import { useBriquetteAttendant } from '../../Components/Hooks/useBriquette';
import { Card, CardBody, Col, Container, Row, Input, Label, Button, Alert, FormFeedback } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useUser } from '../../Components/Hooks/useAuth'; 


const BriquetteDashboard = () => {
  const { 
    log, isLoading, isUpdating, formErrors, globalError, 
    setGlobalError, startDay, saveProgress 
  } = useBriquetteAttendant();
  
  const { data, isLoading: isUserLoading } = useUser();
  const displayUsername = data?.username || "Current Attendant"; 
  const displayCooler = data?.active_cooler_name || "Assigned Cooler";
  const displayRoute = data?.active_cooler_route || "Assigned Route";

  const [localClosing, setLocalClosing] = useState<string>("");
  const [localReceipts, setLocalReceipts] = useState<string>("");

  useEffect(() => {
    setLocalClosing(log?.closing_stock_actual?.toString() || "");
    setLocalReceipts(log?.receipts?.toString() || "");
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
        <BreadCrumb title="Briquette Daily Log" pageTitle="Inventory" />

        {globalError && (
          <Alert color="danger" className="alert-dismissible fade show">
            <i className="ri-error-warning-line me-2 align-middle"></i>
            {globalError}
            <Button type="button" className="btn-close" onClick={() => setGlobalError(null)}></Button>
          </Alert>
        )}

        {/* Global Context Header */}
        <DashboardHeader username={displayUsername} coolerName={displayCooler} routeName={displayRoute} status={log?.status} />

        {!log ? (
          <MorningInitCard onStart={startDay} errors={formErrors} />
        ) : (
          <>
            {/* Expanded Metrics Grid */}
            <Row className="mb-3">
              <MetricWidget title="Opening Stock" value={log.opening_stock} icon="ri-archive-line" color="secondary" />
              <MetricWidget title="Total Available" value={log.total_available} icon="ri-database-2-line" color="primary" />
              <MetricWidget title="Total Consumed" value={log.total_consumption} icon="ri-fire-line" color="warning" />
              <MetricWidget title="Total Utilised" value={log.total_utilisation} icon="ri-tools-line" color="danger" />
            </Row>
            
            <Row className="mb-4">
              <MetricWidget title="Expected Closing" value={log.expected_closing_stock} icon="ri-calculator-line" color="info" />
              <MetricWidget title="Actual Closing" value={log.closing_stock_actual || "Pending"} icon="ri-checkbox-circle-line" color={log.closing_stock_actual ? "success" : "light"} />
              <MetricWidget title="Variance (Kg)" value={log.variance} icon="ri-scales-3-line" color={log.variance !== 0 ? "warning" : "success"} />
              <MetricWidget title="Variance %" value={`${log.variance_percent}%`} icon="ri-pulse-line" color={Math.abs(log.variance_percent) > 5 ? "danger" : "success"} />
            </Row>

            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center mb-4">
                      <h5 className="card-title flex-grow-1 mb-0">Daily Operations (Kg)</h5>
                    </div>

                    <Row className="gy-4">
                      <Col md={6}>
                        <Label>AM Consumption</Label>
                        <Input 
                          type="number" 
                          defaultValue={log.am_consumption} 
                          invalid={!!formErrors.am_consumption}
                          disabled={!log.is_editable}
                          onBlur={(e) => saveProgress({ id: log.id, data: { am_consumption: e.target.value } })} 
                        />
                        <FormFeedback>{formErrors.am_consumption}</FormFeedback>
                      </Col>

                      <Col md={6}>
                        <Label>PM Consumption</Label>
                        <Input 
                          type="number" 
                          defaultValue={log.pm_consumption} 
                          invalid={!!formErrors.pm_consumption}
                          disabled={!log.is_editable}
                          onBlur={(e) => saveProgress({ id: log.id, data: { pm_consumption: e.target.value } })} 
                        />
                        <FormFeedback>{formErrors.pm_consumption}</FormFeedback>
                      </Col>

                      <Col md={parseFloat(localReceipts) > 0 ? 4 : 6}>
                        <Label>Transfers Out</Label>
                        <Input 
                          type="number" 
                          defaultValue={log.transfers} 
                          invalid={!!formErrors.transfers}
                          disabled={!log.is_editable}
                          onBlur={(e) => saveProgress({ id: log.id, data: { transfers: e.target.value } })} 
                        />
                        <FormFeedback>{formErrors.transfers}</FormFeedback>
                      </Col>

                      <Col md={parseFloat(localReceipts) > 0 ? 4 : 6}>
                        <Label>Receipts (New Stock)</Label>
                        <Input 
                          type="number" 
                          value={localReceipts}
                          invalid={!!formErrors.receipts}
                          disabled={!log.is_editable}
                          onChange={(e) => setLocalReceipts(e.target.value)}
                          onBlur={(e) => saveProgress({ id: log.id, data: { receipts: e.target.value } })} 
                        />
                        <FormFeedback>{formErrors.receipts}</FormFeedback>
                      </Col>

                      {parseFloat(localReceipts) > 0 && (
                        <Col md={4} className="animate__animated animate__fadeIn">
                          <Label>Receipt Serial <span className="text-danger">*</span></Label>
                          <Input 
                            type="text" 
                            defaultValue={log.receipt_serial || ""} 
                            invalid={!!formErrors.receipt_serial}
                            disabled={!log.is_editable}
                            placeholder="e.g. REC-10293"
                            onBlur={(e) => saveProgress({ id: log.id, data: { receipt_serial: e.target.value } })} 
                          />
                          <FormFeedback>{formErrors.receipt_serial}</FormFeedback>
                        </Col>
                      )}
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="card-height-100 border-start border-primary border-3">
                  <CardBody>
                    <h5 className="card-title mb-4">Evening Submission</h5>
                    <div className="mb-3">
                      <Label>Actual Closing Stock (Kg)</Label>
                      <Input 
                        type="number" 
                        className="form-control-lg"
                        value={localClosing}
                        invalid={!!formErrors.closing_stock_actual}
                        disabled={!log.is_editable}
                        onChange={(e) => setLocalClosing(e.target.value)}
                      />
                      <FormFeedback>{formErrors.closing_stock_actual}</FormFeedback>
                    </div>
                    
                    <Button 
                      color="primary" 
                      className="w-100" 
                      disabled={!log.is_editable || isUpdating}
                      onClick={() => saveProgress({ 
                        id: log.id, 
                        data: { closing_stock_actual: localClosing, status: 'SUBMITTED' } 
                      })}
                    >
                      {isUpdating ? "Submitting..." : "Submit for QAE Approval"}
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
  <Card className="bg-light-subtle shadow-none border">
    <CardBody className="py-3 px-4">
      <Row className="align-items-center">
        <Col sm={8}>
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="avatar-sm">
                <span className="avatar-title bg-primary-subtle text-primary rounded-circle fs-4">
                  <i className="ri-user-3-line"></i>
                </span>
              </div>
            </div>
            <div className="flex-grow-1">
              <h5 className="fs-15 mb-1">Attendant: <span className="fw-semibold text-primary">{username}</span></h5>
              <p className="fs-15 mb-1">Cooler Station: <span className="fw-semibold text-primary">{coolerName} {routeName}</span></p>
            </div>
          </div>
        </Col>
        <Col sm={4} className="text-sm-end mt-3 mt-sm-0">
          {status && (
            <span className={`badge bg-${status === 'APPROVED' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'}-subtle text-${status === 'APPROVED' ? 'success' : status === 'SUBMITTED' ? 'info' : 'warning'} fs-13 px-3 py-2`}>
              Status: {status}
            </span>
          )}
        </Col>
      </Row>
    </CardBody>
  </Card>
);

const MorningInitCard = ({ onStart, errors }: any) => {
  const [opening, setOpening] = useState("");
  const [vReason, setVReason] = useState("");

  return (
    <Row className="justify-content-center">
      <Col xxl={5} lg={7}>
        <Card className="mt-4 border-top border-warning border-3">
          <CardBody className="p-4 text-center">
            <i className="ri-sun-cloudy-line display-4 text-warning mb-3 d-block"></i>
            <h5 className="text-primary mb-2">Morning Stock Initialization</h5>
            <p className="text-muted mb-4">Please verify and input the physical opening stock before beginning daily operations.</p>
            
            <div className="text-start">
              <Label>Actual Opening Stock (Kg) <span className="text-danger">*</span></Label>
              <Input 
                type="number" 
                className="form-control-lg"
                invalid={!!errors.opening_stock}
                onChange={(e) => setOpening(e.target.value)} 
              />
              <FormFeedback>{errors.opening_stock}</FormFeedback>

              <Label className="mt-3 text-muted">Variance Reason (Required if mismatch from yesterday)</Label>
              <Input 
                type="textarea" 
                rows={3}
                invalid={!!errors.opening_variance_reason}
                onChange={(e) => setVReason(e.target.value)} 
              />
              <FormFeedback>{errors.opening_variance_reason}</FormFeedback>

              <Button 
                color="success" 
                size="lg" 
                className="w-100 mt-4" 
                onClick={() => onStart({ opening_stock: opening, opening_variance_reason: vReason })}
                disabled={!opening}
              >
                Initialize Daily Log
              </Button>
            </div>
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
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-uppercase fw-medium text-muted text-truncate mb-0 fs-12">{title}</p>
            <h4 className={`fs-20 fw-semibold mb-0 mt-2 text-${color}`}>{value}</h4>
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

export default BriquetteDashboard;