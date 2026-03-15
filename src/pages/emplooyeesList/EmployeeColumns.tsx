import React from "react";
import { Link } from "react-router-dom";
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeStatus, EmployeeBase } from "../../types/employee/employeebase";

export const getEmployeeColumns = (
  navigate: (path: string) => void,
  onDeactivate: (employee: EmployeeBase) => void,
  onActivate: (employee: EmployeeBase) => void
): ColumnDef<EmployeeBase>[] => [
  {
    header: "Employee Identity",
    accessorKey: "first_name",
    cell: (info) => {
      const row = info.row.original as any;
      return (
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="avatar-xs">
              <div className="avatar-title rounded-circle bg-primary-subtle text-primary fw-bold text-uppercase">
                {row.first_name?.charAt(0)}
                {row.last_name?.charAt(0)}
              </div>
            </div>
          </div>
          <div className="ms-2">
            <h5 className="fs-14 mb-0">
              <Link to={`/employees/view/${row.id}`} className="text-body fw-bold">
                {row.first_name} {row.last_name}
              </Link>
            </h5>
            <p className="text-muted mb-0 fs-11 text-uppercase">ID: {row.employee_code}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Department",
    accessorKey: "department_name",
    cell: (info) => info.getValue() || <span className="text-muted italic">N/A</span>,
  },
  {
    header: "Designation",
    accessorKey: "designation_title",
    cell: (info) => (
      <span className="text-muted fw-medium">
        {(info.getValue() as string) || "Not Assigned"}
      </span>
    ),
  },
  {
    header: "Employment Type",
    accessorKey: "employment_type",
    cell: (info) => {
      const type = info.getValue() as string;
      return (
        <Badge color="light" className="text-body fw-medium border shadow-sm">
          {type || "Standard"}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue() as EmployeeStatus;
      const statusMap: Record<string, string> = {
        [EmployeeStatus.ACTIVE]: "success",
        [EmployeeStatus.INACTIVE]: "secondary",
        [EmployeeStatus.SUSPENDED]: "warning",
        [EmployeeStatus.TERMINATED]: "danger",
      };
      const color = statusMap[status] || "info";
      return (
        <Badge
          color={color}
          className={`badge-soft-${color} text-uppercase px-2 py-1`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Action",
    cell: (info) => {
      const row = info.row.original;
      const isActive = row.status === EmployeeStatus.ACTIVE;

      return (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="button"
            className="btn btn-soft-secondary btn-sm dropdown"
          >
            <i className="ri-more-fill align-middle"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={() => navigate("/employee")}>
              <i className="ri-eye-fill me-2 align-bottom text-muted"></i> View
              Profile
            </DropdownItem>

            <DropdownItem
              onClick={() => navigate(`/employee/${row.id}`)}
            >
              <i className="ri-pencil-fill me-2 align-bottom text-muted"></i>{" "}
              Edit Record
            </DropdownItem>

            <DropdownItem divider />

            {isActive ? (
              <DropdownItem
                className="text-danger"
                onClick={() => onDeactivate(row)}
              >
                <i className="ri-user-unfollow-line me-2 align-bottom text-danger"></i>{" "}
                Deactivate
              </DropdownItem>
            ) : (
              <DropdownItem
                className="text-success"
                onClick={() => onActivate(row)}
              >
                <i className="ri-user-follow-line me-2 align-bottom text-success"></i>{" "}
                Activate Employee
              </DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    },
  },
];