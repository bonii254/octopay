import React, { useMemo, useState } from "react";
import { Container, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { toast } from "react-toastify";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useEmployeesBase, useEmployeeBaseMutation } from "../../Components/Hooks/employee/useEmployeebase";
import { EmployeeStatus } from "../../types/employee/employeebase";

import DeleteModal from "./DeleteModal";
import EmployeeStats from "./EmployeeStats";
import EmployeeFilter from "./EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import TablePagination from "./TablePagination"; 
import { getEmployeeColumns } from "./EmployeeColumns";

const EmployeeList = () => {
  const navigate = useNavigate();
  
  const { data: employees = [], isLoading } = useEmployeesBase();
  const { UpdateEmployeeBase } = useEmployeeBaseMutation();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const onClickDeactivate = (employee: any) => {
    setSelectedEmployee(employee);
    setDeleteModal(true);
  };

  const handleDeactivateConfirm = async () => {
    if (selectedEmployee) {
      try {
        await UpdateEmployeeBase({
          id: selectedEmployee.id,
          data: { status: EmployeeStatus.INACTIVE }
        });
        toast.success(`${selectedEmployee.first_name} has been deactivated.`);
        setDeleteModal(false);
      } catch (error) {
        toast.error("Failed to deactivate employee.");
      }
    }
  };

  const handleActivateEmployee = async (employee: any) => {
    try {
      await UpdateEmployeeBase({
        id: employee.id,
        data: { status: EmployeeStatus.ACTIVE }
      });
      toast.success(`${employee.first_name} is now ACTIVE`);
    } catch (error) {
      toast.error("Failed to reactivate employee");
    }
  };

  const columns = useMemo(() => 
    getEmployeeColumns(
        (path) => navigate(path),
        (emp) => onClickDeactivate(emp), 
        (emp) => handleActivateEmployee(emp)
    ), 
  [navigate, employees]);

  const table = useReactTable({
    data: employees,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const deptOptions = useMemo(() => {
    const uniqueDepts = Array.from(new Set(employees.map((e: any) => e.department_name))).filter(Boolean);
    return uniqueDepts.map((dept) => ({ value: dept, label: dept }));
  }, [employees]);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Employee Directory" pageTitle="HRM" />

        <EmployeeStats data={employees} />

        <Card>
          <CardBody>
            <EmployeeFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              deptOptions={deptOptions}
              onDeptChange={(opt) => table.getColumn("department_name")?.setFilterValue(opt?.value || "")}
              onTypeChange={(opt) => table.getColumn("employment_type")?.setFilterValue(opt?.value || "")}
              onReset={() => { setGlobalFilter(""); setColumnFilters([]); }}
            />

            <EmployeeTable table={table} isLoading={isLoading} />

            <TablePagination table={table} />
          </CardBody>
        </Card>

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeactivateConfirm}
          onCloseClick={() => setDeleteModal(false)}
          employeeName={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : ""}
        />
      </Container>
    </div>
  );
};

export default EmployeeList;   