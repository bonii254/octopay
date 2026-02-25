import React, { useMemo, useState } from "react";
import {
  Card, CardBody, Row, Col, Button, Spinner, Input, Modal,
  ModalHeader, ModalBody, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem, Badge
} from "reactstrap";
import {
  Plus, Trash2, Sliders, MoreVertical,
  Edit, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  useReactTable, getCoreRowModel,
  createColumnHelper, flexRender,
} from "@tanstack/react-table";

import {
  useDepartments,
  useDepartmentMutation
} from "../../../../Components/Hooks/useDepartment";

import {
  useEmployeeCountsByDepartment
} from "../../../../Components/Hooks/useEmployees";

import {
  useDesignationCountsByDepartment
} from "../../../../Components/Hooks/useDesignation";

import { Department } from "../../../../types/department";

const columnHelper = createColumnHelper<Department>();

const DepartmentTable = () => {

  /* ---------------- STATE ---------------- */

  const [pageIndex, setPageIndex] = useState(0);
  const [perPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [designationModal, setDesignationModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  /* ---------------- DATA ---------------- */

  const params = {
    page: pageIndex + 1,
    per_page: perPage,
    search: globalFilter,
  };

  const { data, isLoading } = useDepartments(params);
  const { deleteDepartment } = useDepartmentMutation();

  // Aggregated counts (Enterprise optimized - NO N+1 calls)
  const { data: employeeCounts } = useEmployeeCountsByDepartment();
  const { data: designationCounts } = useDesignationCountsByDepartment();

  const departments: Department[] = data ?? [];
  const total = departments.length ?? 0;
  const pageCount = Math.ceil(total / perPage);

  /* ---------------- SELECTION ---------------- */

  const toggleSelectRow = (id: number) =>
    setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));

  const isAllSelected =
    departments.length > 0 &&
    departments.every(d => selectedRows[d.id]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows({});
    } else {
      const updated: Record<number, boolean> = {};
      departments.forEach(d => (updated[d.id] = true));
      setSelectedRows(updated);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Object.keys(selectedRows)
      .filter(id => selectedRows[Number(id)])
      .map(Number);

    if (!ids.length || !window.confirm(`Delete ${ids.length} departments?`)) return;

    await Promise.all(ids.map(id => deleteDepartment(id)));
    setSelectedRows({});
  };

  /* ---------------- COLUMNS ---------------- */

  const columns = useMemo(() => [

    // Checkbox
    columnHelper.display({
      id: "select",
      header: () => (
        <Input
          type="checkbox"
          className="form-check-input"
          checked={isAllSelected}
          onChange={toggleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <Input
          type="checkbox"
          className="form-check-input"
          checked={!!selectedRows[row.original.id]}
          onChange={() => toggleSelectRow(row.original.id)}
        />
      ),
    }),

    // Department Name
    columnHelper.accessor("name", {
      header: "DEPARTMENT",
      cell: info => (
        <span className="fw-semibold text-dark">
          {info.getValue()}
        </span>
      )
    }),

    // Company Column (Single Company)
    columnHelper.display({
      id: "company",
      header: "COMPANY",
      cell: () => (
        <Badge color="soft-primary">
          Your Company
        </Badge>
      )
    }),

    // Employees Button
    columnHelper.display({
      id: "employees",
      header: "EMPLOYEES",
      cell: ({ row }) => {
        const count = employeeCounts?.[row.original.id] ?? 0;

        return (
          <Button
            size="sm"
            color="soft-info"
            onClick={() => {
              setSelectedDepartment(row.original);
            }}
          >
            {count} Employees
          </Button>
        );
      }
    }),

    columnHelper.display({
      id: "designations",
      header: "DESIGNATIONS",
      cell: ({ row }) => {
        const count = designationCounts?.[row.original.id] ?? 0;

        return (
          <Button
            size="sm"
            color="soft-secondary"
            onClick={() => {
              setSelectedDepartment(row.original);
              setDesignationModal(true);
            }}
          >
            {count} Designations
          </Button>
        );
      }
    }),

    columnHelper.display({
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="button"
            className="btn btn-soft-secondary btn-sm dropdown"
          >
            <MoreVertical size={14} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem
              onClick={() => {
                setSelectedDepartment(row.original);
                setDesignationModal(true);
              }}
            >
              <Edit size={14} className="me-2 text-muted" />
              Manage Designations
            </DropdownItem>

            <DropdownItem divider />

            <DropdownItem
              className="text-danger"
              onClick={() => deleteDepartment(row.original.id)}
            >
              <Trash2 size={14} className="me-2" />
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    })

  ], [selectedRows, isAllSelected, employeeCounts, designationCounts]);

  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Card>
      <CardBody>

        {/* HEADER */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h5 className="mb-0 fw-bold">Department Directory</h5>
          </Col>

          <Col className="text-end d-flex gap-2 justify-content-end">
            <Button color="primary">
              <Plus size={16} className="me-2" />
              Add Department
            </Button>

            {Object.keys(selectedRows).length > 0 && (
              <Button color="danger" onClick={handleBulkDelete}>
                <Trash2 size={14} className="me-1" />
                Bulk Delete
              </Button>
            )}
          </Col>
        </Row>

        {/* SEARCH */}
        <Row className="mb-3">
          <Col md="4">
            <Input
              placeholder="Search departments..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setPageIndex(0);
              }}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <div className="table-responsive">
          {isLoading ? (
            <div className="text-center p-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <table className="table align-middle">
              <thead className="table-light">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <Row className="align-items-center mt-4">
          <Col>
            <div className="text-muted">
              Showing {departments.length} of {total} Results
            </div>
          </Col>

          <Col className="col-auto">
            <Button
              color="link"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>

            <span className="mx-2">{pageIndex + 1}</span>

            <Button
              color="link"
              disabled={pageIndex + 1 >= pageCount}
              onClick={() => setPageIndex(p => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </Col>
        </Row>

        {/* DESIGNATION MODAL */}
        <Modal
          isOpen={designationModal}
          toggle={() => setDesignationModal(false)}
          size="lg"
          centered
        >
          <ModalHeader toggle={() => setDesignationModal(false)}>
            Designations - {selectedDepartment?.name}
          </ModalHeader>
          <ModalBody>
            {/* Replace with actual DesignationList component */}
            <div className="p-4 text-center">
              Loading designations for {selectedDepartment?.name}
            </div>
          </ModalBody>
        </Modal>

      </CardBody>
    </Card>
  );
};

export default DepartmentTable;
