import React from "react";
import { Row, Col, Input, Button, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

interface FilterProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDeptChange: (value: any) => void;
  onTypeChange: (value: any) => void;
  deptOptions: any[];
  onReset: () => void;
  showAll: boolean;
  onStatusToggle: (value: boolean) => void;
}

const EmployeeFilter = ({ 
  globalFilter, 
  setGlobalFilter, 
  onDeptChange, 
  onTypeChange, 
  deptOptions, 
  onReset,
  showAll,
  onStatusToggle 
}: FilterProps) => {
  const navigate = useNavigate();

  return (
    <Row className="g-3 mb-4 align-items-center">
      <Col xxl={3} lg={4}>
        <div className="search-box">
          <Input
            type="text"
            className="form-control"
            placeholder="Search name, payroll ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <i className="ri-search-line search-icon"></i>
        </div>
      </Col>

      <Col xxl={2} lg={4}>
        <Select
          isClearable
          placeholder="Department"
          options={deptOptions}
          onChange={onDeptChange}
        />
      </Col>

      <Col xxl={2} lg={4}>
        <Select
          isClearable
          placeholder="Job Type"
          options={[
            { value: "Full-time", label: "Full-time" },
            { value: "Contract", label: "Contract" },
            { value: "Intern", label: "Intern" },
          ]}
          onChange={onTypeChange}
        />
      </Col>

      <Col xxl={2} lg={4}>
        <div className="form-check form-switch form-switch-md shadow-sm border rounded p-2 ps-5 bg-white">
          <Input
            type="checkbox"
            className="form-check-input"
            id="statusToggle"
            checked={showAll}
            onChange={(e) => onStatusToggle(e.target.checked)}
          />
          <Label className="form-check-label mb-0 ms-2 fw-medium" htmlFor="statusToggle">
            {showAll ? "Showing All" : "Active Only"}
          </Label>
        </div>
      </Col>

      <Col xxl={3} lg={8} className="text-end">
        <Button color="soft-danger" className="me-2" onClick={onReset} title="Reset Filters">
          <i className="ri-refresh-line align-bottom"></i>
        </Button>
        <Button color="success" onClick={() => navigate("/employee")}>
          <i className="ri-add-line align-bottom me-1"></i> Add Employee
        </Button>
      </Col>
    </Row>
  );
};

export default EmployeeFilter;