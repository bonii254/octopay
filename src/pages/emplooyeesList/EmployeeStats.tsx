import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { EmployeeBase, EmployeeStatus } from "../../types/employee/employeebase";

interface StatsProps {
  data: EmployeeBase[];
}

const EmployeeStats = ({ data }: StatsProps) => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const newHires = data.filter((emp) => {
    const createdDate = emp.created_at ? new Date(emp.created_at) : null;
    return createdDate && createdDate >= thirtyDaysAgo && createdDate <= now;
  }).length;

  const exited = data.filter((emp) => emp.status === EmployeeStatus.TERMINATED).length;

  const onLeave = 0;

  const stats = [
    {
      id: 1,
      label: "Total Headcount",
      counter: data.length,
      badge: "Total",
      icon: "ri-team-line",
      color: "primary",
    },
    {
      id: 2,
      label: "On Leave",
      counter: onLeave,
      badge: "Currently Out",
      icon: "ri-user-shared-2-line",
      color: "warning",
    },
    {
      id: 3,
      label: "New Hires",
      counter: newHires,
      badge: "Last 30 Days",
      icon: "ri-user-add-line",
      color: "info",
    },
    {
      id: 4,
      label: "Exited",
      counter: exited,
      badge: "Terminated",
      icon: "ri-user-unfollow-line",
      color: "danger",
    },
  ];

  return (
    <Row>
      {stats.map((item, key) => (
        <Col xl={3} md={6} key={key}>
          <Card className="card-animate border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">{item.counter}</h4>
                  <span className={`badge bg-${item.color}-subtle text-${item.color} px-2 py-1`}>
                    {item.badge}
                  </span>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className={`avatar-title bg-${item.color}-subtle rounded fs-3`}>
                    <i className={`${item.icon} text-${item.color}`}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EmployeeStats;