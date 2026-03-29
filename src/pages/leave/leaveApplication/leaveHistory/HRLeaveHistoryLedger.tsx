import React, { useMemo, useState } from "react";
import { Card, CardBody, Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import LeaveHistoryFilter from "./LeaveHistoryFilter";
import LeaveHistoryTable from "./LeaveHistoryTable";
import TablePagination from "../../leavebalances/TablePagination";
import { useLeaveApplications, useLeaveActions } from "../../../../Components/Hooks/useLeaveApplications";
import { getLeaveHistoryColumns } from "./leaveHistoryColumns"; 
import DeleteModal from "./DeleteModal";

const HRLeaveHistoryLedger = () => {
  const navigate = useNavigate();
  const { data: allLeaves = [], isLoading } = useLeaveApplications();
  const { delete: deleteAction } = useLeaveActions();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const handleEdit = (leave: any) => {
    navigate('/leave-requisition', { state: { editLeave: leave } });
  };
  const handlePrint = (id: number) => console.log("Print", id);
  const handleDeleteTrigger = (leave: any) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLeave?.id) return;
    try {
      await deleteAction.mutateAsync(selectedLeave.id);
      toast.success("Leave application deleted");
      setShowDeleteModal(false);
    } catch (e) {
      toast.error("Failed to delete application");
    }
  };
  const columns = useMemo(() => 
    getLeaveHistoryColumns(handleEdit, handleDeleteTrigger, handlePrint), 
  []);
  const filteredData = useMemo(() => {
    if (dateRange.length < 2) return allLeaves;
    const [start, end] = dateRange;

    return allLeaves.filter((leave: any) => {
      const leaveDate = new Date(leave.start_date);
      return leaveDate >= start && leaveDate <= end;
    });
  }, [allLeaves, dateRange]);

  const employeeOptions = useMemo(() => 
    Array.from(new Set(allLeaves.map((l: any) => l.employee_name)))
      .map(name => ({ value: name, label: name })), [allLeaves]);

  const leaveTypeOptions = useMemo(() => 
    Array.from(new Set(allLeaves.map((l: any) => l.leave_type_name)))
      .map(name => ({ value: name, label: name })), [allLeaves]);

  // 3. Table Instance
  const table = useReactTable({
    data: filteredData,
    columns: columns, 
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleReset = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setDateRange([]);
    table.resetColumnFilters();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Leave History Ledger" pageTitle="HR Management" />
          <Card>
            <CardBody>
              <LeaveHistoryFilter
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                dateValue={dateRange}
                onDateRangeChange={(dates) => setDateRange(dates)}
                employeeOptions={employeeOptions}
                leaveTypeOptions={leaveTypeOptions}
                onEmployeeChange={(opt) => table.getColumn("employee_name")?.setFilterValue(opt?.value || "")}
                onLeaveTypeChange={(opt) => table.getColumn("leave_type_name")?.setFilterValue(opt?.value || "")}
                onStatusChange={(opt) => table.getColumn("status")?.setFilterValue(opt?.value || "")}
                onReset={handleReset}
              />

              <LeaveHistoryTable table={table} isLoading={isLoading} />
              
              <div className="mt-3">
                <TablePagination table={table} />
              </div>
            </CardBody>
          </Card>
          <DeleteModal 
            show={showDeleteModal}
            recordName={selectedLeave?.employee_name || ""}
            onCloseClick={() => setShowDeleteModal(false)}
            onDeleteClick={() => {
                console.log("Deleting ID:", selectedLeave?.id);
                setShowDeleteModal(false);
            }}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HRLeaveHistoryLedger;