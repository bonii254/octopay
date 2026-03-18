import React, { useMemo, useState } from "react";
import { Container, Card, CardBody } from "reactstrap";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { toast } from "react-toastify";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useLeaveBalances, useLeaveBalanceActions } from "../../../Components/Hooks/useLeaveBalance";
import { useEmployeesBase } from "../../../Components/Hooks/employee/useEmployeebase";
import { useLeaveTypes } from "../../../Components/Hooks/useLeaveType"; 
import { UpdateLeaveBalanceRequest } from "../../../types/leaveBalance";

import { getLeaveBalanceColumns } from "./leaveBalanceColumns";
import LeaveBalanceFilter from "./leaveBalanceFilter";
import LeaveBalanceTable from "./leaveBalanceTable";
import LeaveBalanceModal from "./LeaveBalanceModal";
import TablePagination from "./TablePagination";
import DeleteModal from "./DeleteModal";

const LeaveBalanceLedger = () => {
  const { data: balances = [], isLoading } = useLeaveBalances();
  const { data: employees = [] } = useEmployeesBase();
  const { data: leaveTypes = [] } = useLeaveTypes();
  const actions = useLeaveBalanceActions();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  
  const [selectedBalance, setSelectedBalance] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const finalTableData = useMemo(() => {
    if (showAll) return balances;
    return balances.filter((b: any) => !b.frozen);
  }, [balances, showAll]);

  const handleToggleFreeze = async (balance: any) => {
    try {
      if (balance.frozen) {
        await actions.unfreeze.mutateAsync(balance.id);
        toast.success("Record unfrozen successfully");
      } else {
        await actions.freeze.mutateAsync(balance.id);
        toast.success("Record frozen successfully");
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBalance?.id) {
      try {
        await actions.delete.mutateAsync(selectedBalance.id);
        toast.success("Balance record purged successfully");
        setDeleteModal(false);
        setSelectedBalance(null);
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  const handleModalSubmit = async (values: any) => {
    try {
      if (selectedBalance) {
        const updatePayload: UpdateLeaveBalanceRequest = {
          opening_balance: Number(values.opening_balance),
          carried_forward: Number(values.carried_forward),
          frozen: values.frozen
        };

        await actions.update.mutateAsync({ id: selectedBalance.id, data: updatePayload });
        toast.success("Balance updated");
      } else {
        await actions.create.mutateAsync(values);
        toast.success("Balance initialized");
      }
      setModalOpen(false);
      setSelectedBalance(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save balance");
    }
  };

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear; y++) {
      years.push({ value: y, label: `FY ${y}` });
    }
    return years;
  }, []);

  const employeeOptions = useMemo(() => 
    employees.map((e: any) => ({ 
      value: e.first_name + " " + e.last_name, 
      label: `${e.first_name} ${e.last_name}` 
    })), 
  [employees]);

  const leaveTypeOptions = useMemo(() => 
    leaveTypes.map((t: any) => ({ value: t.name, label: t.name })), 
  [leaveTypes]);

  const columns = useMemo(() => 
    getLeaveBalanceColumns(
        (row) => { setSelectedBalance(row); setModalOpen(true); }, 
        (row) => handleToggleFreeze(row),                         
        (row) => { setSelectedBalance(row); setDeleteModal(true); } 
    ), 
  [actions]);

  const table = useReactTable({
    data: finalTableData,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Leave Balance Ledger" pageTitle="HRM" />

        <Card>
          <CardBody>
            <LeaveBalanceFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              employeeOptions={employeeOptions}
              leaveTypeOptions={leaveTypeOptions}
              yearOptions={yearOptions}
              onEmployeeChange={(opt) => table.getColumn("employee_name")?.setFilterValue(opt?.value || "")}
              onLeaveTypeChange={(opt) => table.getColumn("leave_type_name")?.setFilterValue(opt?.value || "")}
              onYearChange={(opt) => {
                const val = opt ? opt.value : undefined;
                table.getColumn("fiscal_year")?.setFilterValue(val);
            }}
              onReset={() => { 
                setGlobalFilter(""); 
                setColumnFilters([]); 
                setShowAll(false);
              }}
              showAll={showAll}
              onStatusToggle={setShowAll}
              onInitialize={() => { setSelectedBalance(null); setModalOpen(true); }}
            />

            <LeaveBalanceTable table={table} isLoading={isLoading} />

            <TablePagination table={table} />
          </CardBody>
        </Card>

        <LeaveBalanceModal 
          isOpen={modalOpen} 
          toggle={() => { setModalOpen(false); setSelectedBalance(null); }}
          onSubmit={handleModalSubmit}
          initialData={selectedBalance}
          employees={employees}
          leaveTypes={leaveTypes}
          isEdit={!!selectedBalance}
        />

        <DeleteModal 
          show={deleteModal}
          onCloseClick={() => { setDeleteModal(false); setSelectedBalance(null); }}
          onDeleteClick={handleConfirmDelete}
          recordName={`${selectedBalance?.employee_name} - ${selectedBalance?.leave_type_name}`}
        />
      </Container>
    </div>
  );
};

export default LeaveBalanceLedger;