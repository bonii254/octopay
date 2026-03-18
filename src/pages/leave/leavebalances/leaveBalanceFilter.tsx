import React from "react";
import { Row, Col, Input, Button, Label } from "reactstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

interface FilterProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onEmployeeChange: (value: any) => void;
  onLeaveTypeChange: (value: any) => void;
  onYearChange: (value: any) => void;
  employeeOptions: any[];
  leaveTypeOptions: any[]; 
  yearOptions: any[];
  onReset: () => void;
  showAll: boolean;
  onStatusToggle: (value: boolean) => void;
  onInitialize: () => void;
}

const LeaveBalanceFilter = ({ 
  globalFilter, 
  setGlobalFilter, 
  onEmployeeChange, 
  onLeaveTypeChange, 
  onYearChange,
  employeeOptions, 
  leaveTypeOptions,
  yearOptions,
  onReset,
  showAll,
  onStatusToggle,
  onInitialize
}: FilterProps) => {
  return (
    <Row className="g-3 mb-4 align-items-center">
      <Col xxl={3} lg={4}>
        <div className="search-box">
          <Input
            type="text"
            className="form-control"
            placeholder="Search records..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <i className="ri-search-line search-icon"></i>
        </div>
      </Col>

      <Col xxl={2} lg={4}>
        <Select
          isClearable
          placeholder="Select Employee"
          options={employeeOptions}
          onChange={onEmployeeChange}
          maxMenuHeight={200}
          styles={{
            menuList: (base) => ({
              ...base,
              maxHeight: "200px",
            })
          }}
        />
      </Col>

      <Col xxl={2} lg={4}>
        <Select
          isClearable
          placeholder="Leave Type"
          options={leaveTypeOptions}
          onChange={onLeaveTypeChange}
        />
      </Col>
      <Col xxl={2} lg={4}>
        
      </Col>

      <Col xxl={3} lg={8} className="text-end">
        <div className="d-flex justify-content-end align-items-center gap-2">
            <div className="form-check form-switch form-switch-md shadow-sm border rounded p-2 ps-5 bg-white mb-0 text-start" style={{ minWidth: "140px" }}>
                <Input
                    type="checkbox"
                    className="form-check-input"
                    id="statusToggle"
                    checked={showAll}
                    onChange={(e) => onStatusToggle(e.target.checked)}
                />
                <Label className="form-check-label mb-0 ms-2 fw-medium" htmlFor="statusToggle">
                    {showAll ? "All Records" : "Active Only"}
                </Label>
            </div>
            
            <Button color="soft-danger" onClick={onReset} title="Reset Filters">
                <i className="ri-refresh-line align-bottom"></i>
            </Button>
            
            <Button color="success" onClick={onInitialize}>
                <i className="ri-add-line align-bottom me-1"></i> Initialize
            </Button>
        </div>
      </Col>
    </Row>
  );
};

export default LeaveBalanceFilter;