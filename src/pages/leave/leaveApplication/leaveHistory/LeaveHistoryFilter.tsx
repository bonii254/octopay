import React from "react";
import { Row, Col, Input, Button, Label } from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

interface FilterProps {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onEmployeeChange: (value: any) => void;
    onLeaveTypeChange: (value: any) => void;
    onStatusChange: (value: any) => void;
    onDateRangeChange: (selectedDates: Date[]) => void; // Added for Date Range
    employeeOptions: any[];
    leaveTypeOptions: any[];
    onReset: () => void;
    dateValue: Date[];
}

const statusOptions = [
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

const LeaveHistoryFilter = ({
    globalFilter,
    setGlobalFilter,
    onEmployeeChange,
    onLeaveTypeChange,
    onStatusChange,
    onDateRangeChange,
    employeeOptions,
    leaveTypeOptions,
    onReset,
    dateValue
}: FilterProps) => {
    return (
        <Row className="g-3 mb-4 align-items-center">
            <Col xxl={3} lg={4}>
                <div className="search-box">
                    <Input
                        type="text"
                        placeholder="Search employee, payroll ID..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                </div>
            </Col>

            <Col xxl={3} lg={4}>
                <Flatpickr
                    className="form-control"
                    placeholder="Select Date Range" 
                    options={{
                        mode: "range",
                        dateFormat: "Y-m-d",
                    }}
                    value={dateValue}
                    onChange={onDateRangeChange}
                />
            </Col>

            <Col xxl={2} lg={4}>
                <Select
                    isClearable
                    placeholder="Employee"
                    options={employeeOptions}
                    onChange={onEmployeeChange}
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
                <Select
                    isClearable
                    placeholder="Status"
                    options={statusOptions}
                    onChange={onStatusChange}
                />
            </Col>

            <Col xxl={12} className="text-end">
                <Button color="soft-danger" size="sm" onClick={onReset}>
                    <i className="ri-refresh-line align-bottom me-1"></i> Reset All Filters
                </Button>
            </Col>
        </Row>
    );
};

export default LeaveHistoryFilter;