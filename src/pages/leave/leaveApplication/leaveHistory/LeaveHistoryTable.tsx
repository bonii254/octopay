import React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { Spinner } from "reactstrap";
import { ILeaveApplication } from "../../../../types/leaveApplication"; 

interface TableProps {
  table: Table<ILeaveApplication>;
  isLoading: boolean;
}

const LeaveHistoryTable = ({ table, isLoading }: TableProps) => {
  const rowModel = table.getRowModel();
  const headerGroups = table.getHeaderGroups();

  return (
    <div className="table-responsive table-card mt-3">
      <table className="table align-middle table-nowrap mb-0">
        <thead className="table-light text-muted">
          {headerGroups.map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th 
                  key={header.id} 
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <i className="ri-arrow-up-s-line align-middle ms-1"></i>,
                    desc: <i className="ri-arrow-down-s-line align-middle ms-1"></i>,
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={table.getAllColumns().length} className="text-center py-5">
                <Spinner size="sm" color="primary" className="me-2" /> 
                Loading Leave History Records...
              </td>
            </tr>
          ) : rowModel.rows.length > 0 ? (
            rowModel.rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllColumns().length} className="text-center py-5">
                <div className="avatar-md mb-4 mx-auto">
                  <div className="avatar-title bg-light text-primary rounded-circle fs-24">
                    <i className="ri-search-line"></i>
                  </div>
                </div>
                <h5 className="mt-2">No Leave History Found</h5>
                <p className="text-muted mb-0">
                  We couldn't find any leave applications matching your current filters or date range.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistoryTable;