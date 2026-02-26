import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

import { useDepartments, useDepartmentMutation } from "../../../../Components/Hooks/useDepartment";
import { Department } from "../../../../types/department";

const DepartmentSettings = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepts, setSelectedDepts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [modalList, setModalList] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [department, setDepartment] = useState<Department | null>(null);

  const { data: departments, isLoading, isError } = useDepartments();
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDepartmentMutation();

  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    return departments.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDepts(currentItems.map((d) => d.id));
    } else {
      setSelectedDepts([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedDepts.includes(id)) {
      setSelectedDepts(selectedDepts.filter((item) => item !== id));
    } else {
      setSelectedDepts([...selectedDepts, id]);
    }
  };

  const toggleList = () => setModalList(!modalList);
  const toggleDelete = () => setModalDelete(!modalDelete);

  const handleAddClick = () => {
    setIsEdit(false);
    setDepartment(null);
    validation.resetForm();
    toggleList();
  };

  const handleEditClick = (dept: Department) => {
    setIsEdit(true);
    setDepartment(dept);
    validation.setValues({ name: dept.name });
    toggleList();
  };

  const handleDeleteClick = (dept: Department) => {
    setDepartment(dept);
    toggleDelete();
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDepts.length} departments?`)) {
      try {
        await Promise.all(selectedDepts.map((id) => deleteDepartment(id)));
        setSelectedDepts([]);
      } catch (error) {
        console.error("Bulk delete failed", error);
      }
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { name: (department && department.name) || "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter a department name"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit && department) {
          await updateDepartment({ id: department.id, data: values });
        } else {
          await createDepartment(values);
        }
        validation.resetForm();
        toggleList();
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  const executeDelete = async () => {
    if (department) {
      try {
        await deleteDepartment(department.id);
        toggleDelete();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card id="departmentList">
            <CardHeader className="border-0">
              <Row className="align-items-center gy-3">
                <Col sm={3}>
                  <h5 className="card-title mb-0">Departments</h5>
                </Col>
                <Col sm={"auto"} className="ms-auto">
                  <div className="d-flex gap-2 flex-wrap">
                    {selectedDepts.length > 0 && (
                      <Button color="soft-danger" onClick={handleBulkDelete}>
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}
                    <Button color="success" onClick={handleAddClick} id="create-btn">
                      <i className="ri-add-line align-bottom me-1"></i> Add Department
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>

            {/* GLOBAL SEARCH SECTION */}
            <CardBody className="border border-dashed border-end-0 border-start-0">
              <Row className="g-3">
                <Col xxl={5} sm={6}>
                  <div className="search-box">
                    <Input
                      type="text"
                      className="form-control search"
                      placeholder="Search for department name..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
              </Row>
            </CardBody>

            <CardBody className="pt-0">
              {isLoading ? (
                <div className="text-center py-4"><Spinner color="primary" /></div>
              ) : isError ? (
                <div className="text-danger text-center py-4">Error loading departments.</div>
              ) : (
                <>
                  <div className="table-responsive table-card mb-1">
                    <Table className="align-middle table-nowrap" id="departmentTable">
                      <thead className="table-light text-muted">
                        <tr>
                          <th style={{ width: "50px" }}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={currentItems.length > 0 && selectedDepts.length === currentItems.length}
                              />
                            </div>
                          </th>
                          <th>Department Name</th>
                          <th>Created At</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {currentItems.map((dept: Department) => (
                          <tr key={dept.id}>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedDepts.includes(dept.id)}
                                  onChange={() => handleSelectOne(dept.id)}
                                />
                              </div>
                            </td>
                            <td className="fw-medium">{dept.name}</td>
                            <td>{new Date(dept.created_at).toLocaleDateString()}</td>
                            <td className="text-end">
                              <ul className="list-inline hstack gap-2 justify-content-end mb-0">
                                <li className="list-inline-item">
                                  <button className="btn btn-sm btn-soft-info" onClick={() => handleEditClick(dept)}>
                                    <i className="ri-pencil-fill" />
                                  </button>
                                </li>
                                <li className="list-inline-item">
                                  <button className="btn btn-sm btn-soft-danger" onClick={() => handleDeleteClick(dept)}>
                                    <i className="ri-delete-bin-fill" />
                                  </button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {filteredDepartments.length === 0 && (
                      <div className="noresult text-center py-5">
                        <i className="ri-search-line display-5 text-light"></i>
                        <h5 className="mt-2">No Department Found</h5>
                      </div>
                    )}
                  </div>

                  {/* FOOTER: ENTRIES INFO & PAGINATION */}
                  {!isLoading && filteredDepartments.length > 0 && (
                    <Row className="align-items-center mt-3 g-3 text-center text-sm-start">
                      <Col sm>
                        <div className="text-muted">
                          Showing <span className="fw-semibold">{indexOfFirstItem + 1}</span> to{" "}
                          <span className="fw-semibold">
                            {Math.min(indexOfLastItem, filteredDepartments.length)}
                          </span>{" "}
                          of <span className="fw-semibold">{filteredDepartments.length}</span> entries
                        </div>
                      </Col>
                      <Col sm="auto">
                        <Pagination className="pagination-wrap hstack gap-2 justify-content-center">
                          <PaginationItem disabled={currentPage <= 1}>
                            <PaginationLink previous href="#" onClick={(e) => { e.preventDefault(); handlePageClick(currentPage - 1); }} />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem active={i + 1 === currentPage} key={i}>
                              <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(i + 1); }}>
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem disabled={currentPage >= totalPages}>
                            <PaginationLink next href="#" onClick={(e) => { e.preventDefault(); handlePageClick(currentPage + 1); }} />
                          </PaginationItem>
                        </Pagination>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ADD/EDIT MODAL */}
      <Modal isOpen={modalList} toggle={toggleList} centered>
        <ModalHeader className="bg-light p-3" toggle={toggleList}>
          {isEdit ? "Edit Department" : "Add Department"}
        </ModalHeader>
        <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }}>
          <ModalBody>
            <div className="mb-3">
              <Label htmlFor="name" className="form-label">Department Name</Label>
              <Input
                name="name"
                type="text"
                placeholder="Enter department name"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name}
                invalid={validation.touched.name && !!validation.errors.name}
              />
              <FormFeedback>{validation.errors.name}</FormFeedback>
            </div>
          </ModalBody>
          <div className="modal-footer">
            <Button color="light" onClick={toggleList}>Close</Button>
            <Button color="success" type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Spinner size="sm" className="me-2" />}
              {isEdit ? "Update Department" : "Add Department"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={modalDelete} toggle={toggleDelete} centered>
        <ModalBody className="p-5 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="mt-4">
            <h4 className="mb-3">Are you sure?</h4>
            <p className="text-muted mb-4">
              Delete <b>{department?.name}</b>? This action cannot be undone.
            </p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="light" onClick={toggleDelete}>Cancel</Button>
              <Button color="danger" onClick={executeDelete} disabled={isDeleting}>
                {isDeleting && <Spinner size="sm" className="me-2" />} Yes, Delete It!
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default DepartmentSettings;