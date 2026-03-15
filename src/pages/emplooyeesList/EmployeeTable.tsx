import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Spinner } from "reactstrap";

interface TableProps {
  table: any;
  isLoading: boolean;
}

const EmployeeTable = ({ table, isLoading }: TableProps) => {
  const rowModel = table.getRowModel();

  return (
    <div className="table-responsive table-card mt-3">
      <table className="table align-middle table-nowrap mb-0">
        <thead className="table-light text-muted">
          {table.getHeaderGroups().map((hg: any) => (
            <tr key={hg.id}>
              {hg.headers.map((header: any) => (
                <th key={header.id} style={{ cursor: 'pointer' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center py-5">
                <Spinner size="sm" color="primary" className="me-2" /> 
                Loading Employee Records...
              </td>
            </tr>
          ) : rowModel.rows.length > 0 ? (
            rowModel.rows.map((row: any) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-5">
                <div className="avatar-md mb-4 mx-auto">
                   <div className="avatar-title bg-light text-primary rounded-circle fs-24">
                      <i className="ri-search-line"></i>
                   </div>
                </div>
                <h5 className="mt-2">Sorry! No Results Found</h5>
                <p className="text-muted mb-0">
                  We couldn't find any employees matching your current filters.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;