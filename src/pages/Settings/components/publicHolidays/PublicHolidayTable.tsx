import React, { useMemo, useState } from "react";
import { Table, Badge, Button, UncontrolledTooltip } from "reactstrap";
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  flexRender, 
  ColumnDef 
} from "@tanstack/react-table";
import { PublicHoliday } from "../../../../types/leaveApplication";
import TablePagination from "../../../emplooyeesList/TablePagination";

interface Props {
  holidays: PublicHoliday[];
  onEdit: (holiday: PublicHoliday) => void;
  onDelete: (holiday: PublicHoliday) => void;
}

const PublicHolidayTable = ({ holidays, onEdit, onDelete }: Props) => {
  
  const columns = useMemo<ColumnDef<PublicHoliday>[]>(() => [
    {
      header: "Holiday Name",
      accessorKey: "name",
      cell: (info) => <span className="fw-medium">{info.getValue<string>()}</span>,
    },
    {
      header: "Date",
      accessorKey: "holiday_date",
      cell: (info) => new Date(info.getValue<string>()).toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      }),
    },
    {
      header: "Type",
      accessorKey: "is_recurring",
      cell: (info) => (
        info.getValue() ? (
          <Badge color="info-subtle" className="text-info text-uppercase">Recurring</Badge>
        ) : (
          <Badge color="warning-subtle" className="text-warning text-uppercase">One-off</Badge>
        )
      ),
    },
    {
      header: "Action",
      id: "actions",
      cell: (info) => (
        <ul className="list-inline hstack gap-2 justify-content-center mb-0">
          <li className="list-inline-item">
            <Button color="soft-primary" size="sm" onClick={() => onEdit(info.row.original)} id={`edit-${info.row.id}`}>
              <i className="ri-pencil-fill align-bottom"></i>
            </Button>
            <UncontrolledTooltip target={`edit-${info.row.id}`}>Edit</UncontrolledTooltip>
          </li>
          <li className="list-inline-item">
            <Button color="soft-danger" size="sm" onClick={() => onDelete(info.row.original)} id={`del-${info.row.id}`}>
              <i className="ri-delete-bin-fill align-bottom"></i>
            </Button>
            <UncontrolledTooltip target={`del-${info.row.id}`}>Delete</UncontrolledTooltip>
          </li>
        </ul>
      ),
    },
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: holidays,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 }
    }
  });

  return (
    <>
      <div className="table-responsive table-card mt-3">
        <Table className="align-middle table-nowrap mb-0">
          <thead className="table-light text-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={header.id === 'actions' ? 'text-center' : ''}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={cell.column.id === 'actions' ? 'text-center' : ''}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {holidays.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted">No public holidays found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      
      <TablePagination table={table} />
    </>
  );
};

export default PublicHolidayTable;