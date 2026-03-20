import React from "react";
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Badge, Spinner } from "reactstrap";
import { LeaveBalance } from "../../../types/leaveBalance";

interface Props {
  balances: LeaveBalance[] | undefined;
  loading: boolean;
}

const LeaveBalanceSummary = ({ balances, loading }: Props) => {
  return (
    <Card className="card-height-100 border-start border-start-width-3 border-primary">
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">Your Leave Balances</h4>
        <div className="flex-shrink-0">
          <Badge color="soft-info" className="badge-soft-info">Current Period</Badge>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2 text-muted">Loading balances...</p>
          </div>
        ) : !balances || balances.length === 0 ? (
          <div className="text-center py-4">
            <i className="ri-error-warning-line display-5 text-warning"></i>
            <p className="text-muted mt-2">No active leave balances found.</p>
          </div>
        ) : (
          <ListGroup flush>
            {balances.map((item) => (
              <ListGroupItem 
                key={item.id} 
                className="px-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{item.leave_type_name}</h6>
                  <small className="text-muted">
                    Earned: {item.balance_days} | Used: {item.opening_balance}
                  </small>
                </div>
                <div className="text-end">
                  <h5 className={`mb-0 ${item.balance_days <= 2 ? 'text-danger' : 'text-success'}`}>
                    {item.opening_balance}
                  </h5>
                  <small className="text-uppercase font-size-10 fw-bold">Days Left</small>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
        
        <div className="mt-4 pt-2 border-top border-top-dashed">
          <p className="text-muted mb-0">
            <i className="ri-information-line align-middle me-1"></i>
            Balances are updated automatically once a manager approves your request.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default LeaveBalanceSummary;