import React from "react";
import { Link } from "react-router-dom";
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ColumnDef } from "@tanstack/react-table";

export const getLeaveHistoryColumns = (
  onEdit: (leave: any) => void,
  onDelete: (leave: any) => void,
  onPrint: (id: number) => void
): ColumnDef<any>[] => [
  {
    header: "Employee Identity",
    accessorKey: "employee_name",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="avatar-xs">
              <div className="avatar-title rounded-circle bg-primary-subtle text-primary fw-bold">
                {row.employee_name?.charAt(0) || "E"}
              </div>
            </div>
          </div>
          <div className="ms-2">
            <h5 className="fs-13 mb-0">
              <Link to={`/employees/view/${row.employee_id}`} className="text-body fw-bold">
                {row.employee_name}
              </Link>
            </h5>
            <p className="text-muted mb-0 fs-11">ID: {row.employee_payroll || 'N/A'}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Leave Type",
    accessorKey: "leave_type_name",
    cell: (info) => <span className="fw-medium">{String(info.getValue())}</span>,
  },
  {
    header: "Duration",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="text-muted">
          <div className="fs-12 text-dark fw-medium">{row.start_date} to {row.end_date}</div>
          <div className="fs-11">{row.total_days} {row.total_days === 1 ? 'Day' : 'Days'}</div>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = String(info.getValue()).toLowerCase();
      const colors: any = { approved: "success", pending: "warning", rejected: "danger" };
      return (
        <Badge color={colors[status] || "secondary"} className="text-uppercase px-2 py-1">
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Action",
    cell: (info) => {
      const row = info.row.original;
      return (
        <UncontrolledDropdown>
          <DropdownToggle tag="button" className="btn btn-soft-secondary btn-sm">
            <i className="ri-more-fill align-middle"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            {row.status === 'pending' && (
              <>
                <DropdownItem onClick={() => onEdit(row)}>
                  <i className="ri-pencil-fill me-2 align-bottom text-muted"></i> Edit Request
                </DropdownItem>
                <DropdownItem className="text-danger" onClick={() => onDelete(row)}>
                  <i className="ri-delete-bin-fill me-2 align-bottom text-danger"></i> Delete
                </DropdownItem>
              </>
            )}
            {row.status === 'approved' && (
              <DropdownItem onClick={() => onPrint(row.id)}>
                <i className="ri-printer-fill me-2 align-bottom text-muted"></i> Print PDF
              </DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    },
  },
];