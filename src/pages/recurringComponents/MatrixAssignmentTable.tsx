import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table";
import { useSalaryComponents } from "../../Components/Hooks/useSalaryComponent";
import { useEmployeeRecurringComponentsPivot } from "../../Components/Hooks/useRecurringComponents";
import TablePagination from "../leave/leavebalances/TablePagination"; 
import * as XLSX from 'xlsx';

interface MatrixRow extends Record<string, any> {
  employee_id: number;
  employee_code: string;
  employee_name: string;
}

const fuzzyFilter: FilterFn<MatrixRow> = (row, columnId, value) => {
  if (!value) return true;
  const searchStr = String(value).toLowerCase();
  const name = String(row.original.employee_name).toLowerCase();
  const code = String(row.original.employee_code).toLowerCase();
  
  return name.includes(searchStr) || code.includes(searchStr);
};

export const MatrixAssignmentTable: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: allComponents } = useSalaryComponents();
  const { data: matrixData, isLoading, isError } = useEmployeeRecurringComponentsPivot();

  const columns = useMemo<ColumnDef<MatrixRow>[]>(() => {
    const baseCols: ColumnDef<MatrixRow>[] = [
      {
        accessorKey: "employee_name",
        header: "Employee Identity",
        cell: (info) => {
          const name = info.getValue<string>();
          const initials = name
            ? name.split(" ").filter(Boolean).map((n) => n).join("").toUpperCase().substring(0, 2)
            : "??";
          return (
            <div className="d-flex align-items-center">
              <div className="avatar-xs flex-shrink-0 me-3">
                <div className="avatar-title rounded-circle bg-info text-white fs-12 uppercase shadow-sm">
                  {initials}
                </div>
              </div>
              <div>
                <h6 className="fs-14 mb-0 fw-medium">{name}</h6>
                <span className="text-muted fs-11">ID: {info.row.original.employee_code}</span>
              </div>
            </div>
          );
        },
      }
    ];

    if (allComponents) {
      allComponents.filter(c => c.is_recurring === true).forEach((comp) => {
        baseCols.push({
          accessorKey: comp.code,
          header: comp.name,
          cell: (info) => {
            const amount = info.getValue<number | null>();
            return amount !== null && amount !== undefined ? (
              <span className="fw-medium text-dark">
                {amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="text-muted fs-12">-</span>
            );
          },
        });
      });
    }

    return baseCols;
  }, [allComponents]);

  const table = useReactTable({
    data: matrixData || [],
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const exportToExcel = () => {
    if (!matrixData || !allComponents) return;
    const recurring = allComponents.filter(c => c.is_recurring);
    const headers = ["Code", "Employee Name", ...(recurring.map(c => c.name))];
    const data = matrixData.map(row => [
      row.employee_code,
      row.employee_name,
      ...(recurring.map(c => row[c.code] || 0))
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assignments");
    XLSX.writeFile(wb, `Payroll_Matrix_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (isLoading) return <div className="p-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  if (isError) return <div className="p-5 alert alert-danger">Failed to fetch matrix data.</div>;

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="card shadow-sm">
            <div className="card-header border-0 align-items-center d-flex gap-3">
              <h4 className="card-title mb-0 flex-grow-1"> Component list </h4>
              
              <div className="search-box">
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Search name, payroll ID..."
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
              
              <button className="btn btn-soft-secondary d-flex align-items-center gap-1" onClick={exportToExcel}>
                <i className="ri-file-excel-line"></i> Export
              </button>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-bordered table-striped align-middle mb-0">
                  <thead className="table-light text-muted text-uppercase">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id} style={{ minWidth: "150px" }} className="fs-12">
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
                          <td key={cell.id} className="py-2 fs-13">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer border-0">
               <TablePagination table={table} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MatrixAssignmentTable;