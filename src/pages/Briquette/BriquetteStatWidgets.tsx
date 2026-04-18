import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { BriquetteLog } from '../../types/briquette';

interface Props {
  log: BriquetteLog | null;
}

const BriquetteStatWidgets = ({ log }: Props) => {
  const stats = [
    { label: "Opening Stock", value: log?.opening_stock || 0, suffix: " kg", color: "primary" },
    { label: "Total Available", value: log?.total_available || 0, suffix: " kg", color: "info" },
    { label: "Expected Closing", value: log?.expected_closing_stock || 0, suffix: " kg", color: "warning" },
    { 
        label: "Current Variance", 
        value: log?.variance || 0, 
        suffix: " kg", 
        color: (log?.variance || 0) < 0 ? "danger" : "success" 
    },
  ];

  return (
    <Row>
      {stats.map((stat, key) => (
        <Col md={3} key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{stat.label}</p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className={`fs-22 fw-semibold ff-secondary mb-4 text-${stat.color}`}>
                    {stat.value}{stat.suffix}
                  </h4>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BriquetteStatWidgets;