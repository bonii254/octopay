import React from "react";
import { Link } from "react-router-dom";
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ColumnDef } from "@tanstack/react-table";
import { LeaveBalance } from "../../../types/leaveBalance";

export const getLeaveBalanceColumns = (
  onEdit: (leaveBalance: LeaveBalance) => void,
  onToggleFreeze: (leaveBalance: LeaveBalance) => void,
  onDelete: (id: number) => void
): ColumnDef<LeaveBalance>[] => [
  {
    header: "Employee",
    accessorKey: "employee_name",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="avatar-xs">
              <div className="avatar-title rounded-circle bg-info-subtle text-info fw-bold text-uppercase">
                {row.employee_name?.charAt(0) || "E"}
              </div>
            </div>
          </div>
          <div className="ms-2">
            <h5 className="fs-13 mb-0">
              <span className="text-body fw-bold">
                {row.employee_name || "Unknown Employee"}
              </span>
            </h5>
            <p className="text-muted mb-0 fs-11">ID: {row.employee_payroll}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Leave Type",
    accessorKey: "leave_type_name",
    cell: (info) => (
      <Badge color="light" className="text-body fw-medium border">
        {String(info.getValue())}
      </Badge>
    ),
  },
  {
    header: "Opening",
    accessorKey: "opening_balance",
    cell: (info) => <span className="text-muted">{Number(info.getValue()).toFixed(1)}</span>,
  },
  {
    header: "Carried Over",
    accessorKey: "carried_forward",
    cell: (info) => (
      <span className="text-info fw-medium">
        +{Number(info.getValue()).toFixed(1)}
      </span>
    ),
  },
  {
    header: "Total Balance",
    accessorKey: "balance_days",
    cell: (info) => (
      <Badge color="soft-success" className="text-success fs-12">
        {Number(info.getValue()).toFixed(1)} Days
      </Badge>
    ),
  },
  {
    header: "Fiscal Year",
    accessorKey: "fiscal_year",
    enableColumnFilter: true,
    cell: (info) => info.getValue(),
  },
  {
    header: "Status",
    accessorKey: "frozen",
    cell: (info) => {
      const isFrozen = info.getValue() as boolean;
      return (
        <Badge
          color={isFrozen ? "danger" : "success"}
          className={`badge-soft-${isFrozen ? "danger" : "success"} text-uppercase px-2 py-1`}
        >
          {isFrozen ? "Frozen" : "Active"}
        </Badge>
      );
    },
  },
  {
    header: "Action",
    cell: (info) => {
      const row = info.row.original;
      const isFrozen = row.frozen;

      return (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="button"
            className="btn btn-soft-secondary btn-sm dropdown"
          >
            <i className="ri-more-fill align-middle"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem 
              onClick={() => onEdit(row)} 
              disabled={isFrozen}
              className={isFrozen ? "text-muted" : ""}
            >
              <i className="ri-pencil-fill me-2 align-bottom text-muted"></i> 
              Edit Balance
            </DropdownItem>

            <DropdownItem onClick={() => onToggleFreeze(row)}>
              <i className={`${isFrozen ? 'ri-lock-unlock-line' : 'ri-lock-line'} me-2 align-bottom text-muted`}></i>
              {isFrozen ? "Unfreeze Record" : "Freeze Record"}
            </DropdownItem>

            <DropdownItem divider />

            <DropdownItem
              className="text-danger"
              onClick={() => onDelete(row.id)}
            >
              <i className="ri-delete-bin-fill me-2 align-bottom text-danger"></i>{" "}
              Delete Record
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    },
  },
];