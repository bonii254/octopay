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
import { useDepartments } from "../../../../Components/Hooks/useDepartment";
import { useDesignationMutation, useDesignations } from "../../../../Components/Hooks/useDesignation";
import { Designation, DesignationPayload } from "../../../../types/designation";

interface FormValues {
    title: string;
    department_id: string;
}

const DesignationSettings = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiError, setApiError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const [modalList, setModalList] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [designation, setDesignation] = useState<Designation | null>(null);

  const { data: designations, isLoading, isError } = useDesignations();
  const { data: departments } = useDepartments();
  const {
    createDesignation,
    updateDesignation,
    deleteDesignation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDesignationMutation();

  const filteredDesignations = useMemo(() => {
    if (!designations) return [];
    return designations.filter((d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [designations, searchTerm]);
  const totalPages = Math.ceil(filteredDesignations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDesignations.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDesigns(currentItems.map((d) => d.id));
    } else {
      setSelectedDesigns([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedDesigns.includes(id)) {
      setSelectedDesigns(selectedDesigns.filter((item) => item !== id));
    } else {
      setSelectedDesigns([...selectedDesigns, id]);
    }
  };

  const toggleList = () => setModalList(!modalList);
  const toggleDelete = () => setModalDelete(!modalDelete);

  const handleAddClick = () => {
    setIsEdit(false);
    setDesignation(null);
    validation.resetForm();
    toggleList();
  };

  const handleEditClick = (desig: Designation) => {
    setIsEdit(true);
    setDesignation(desig);
    toggleList();
  };

  const handleDeleteClick = (desig: Designation) => {
    setDesignation(desig);
    toggleDelete();
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDesigns.length} designations?`)) {
      try {
        await Promise.all(selectedDesigns.map((id) => deleteDesignation(id)));
        setSelectedDesigns([]);
      } catch (error) {
        console.error("Bulk delete failed", error);
      }
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { 
        title: designation?.title || "",
        department_id: designation?.department_id || ""},
    validationSchema: Yup.object({
      title: Yup.string().required("Please enter a designation title"),
      department_id: Yup.number()
        .required("Please select a department")
        .typeError("Please select a valid department"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit && designation) {
            const updatedData: Partial<DesignationPayload> = {};

            if (values.title !== validation.initialValues.title) {
                updatedData.title = values.title;
            }
            if (
                Number(values.department_id) !== 
                Number(validation.initialValues.department_id)
            ) {
                updatedData.department_id = Number(values.department_id)

            }
            if (Object.keys(updatedData).length === 0) {
                toggleList();
                return;
            }

            await updateDesignation({ 
                id: designation.id, 
                data: updatedData,
            });
        } else {
            const payload: DesignationPayload = {
                title: values.title,
                department_id: Number(values.department_id),
            };
            await createDesignation(payload);
        }

        validation.resetForm();
        toggleList();
      } catch (error: any) {
        if (typeof error === "object") {
            validation.setErrors(error);
            return;
        }
      }
    },
  });

  const executeDelete = async () => {
    if (designation) {
      try {
        await deleteDesignation(designation.id);
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
                  <h5 className="card-title mb-0">Designations</h5>
                </Col>
                <Col sm={"auto"} className="ms-auto">
                  <div className="d-flex gap-2 flex-wrap">
                    {selectedDesigns.length > 0 && (
                      <Button color="soft-danger" onClick={handleBulkDelete}>
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}
                    <Button color="success" onClick={handleAddClick} id="create-btn">
                      <i className="ri-add-line align-bottom me-1"></i> Add Designation
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
                        setCurrentPage(1);
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
                                checked={currentItems.length > 0 && selectedDesigns.length === currentItems.length}
                              />
                            </div>
                          </th>
                          <th>Title</th>
                          <th>Department</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {currentItems.map((desig: Designation) => (
                          <tr key={desig.id}>
                            <td>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedDesigns.includes(desig.id)}
                                  onChange={() => handleSelectOne(desig.id)}
                                />
                              </div>
                            </td>
                            <td className="fw-medium">{desig.title}</td>
                            <td>{desig.department_name || "-"} </td>
                            <td className="text-end">
                              <ul className="list-inline hstack gap-2 justify-content-end mb-0">
                                <li className="list-inline-item">
                                  <button className="btn btn-sm btn-soft-info" onClick={() => handleEditClick(desig)}>
                                    <i className="ri-pencil-fill" />
                                  </button>
                                </li>
                                <li className="list-inline-item">
                                  <button className="btn btn-sm btn-soft-danger" onClick={() => handleDeleteClick(desig)}>
                                    <i className="ri-delete-bin-fill" />
                                  </button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {filteredDesignations.length === 0 && (
                      <div className="noresult text-center py-5">
                        <i className="ri-search-line display-5 text-light"></i>
                        <h5 className="mt-2">No Designation Found</h5>
                      </div>
                    )}
                  </div>

                  {/* FOOTER: ENTRIES INFO & PAGINATION */}
                  {!isLoading && filteredDesignations.length > 0 && (
                    <Row className="align-items-center mt-3 g-3 text-center text-sm-start">
                      <Col sm>
                        <div className="text-muted">
                          Showing <span className="fw-semibold">{indexOfFirstItem + 1}</span> to{" "}
                          <span className="fw-semibold">
                            {Math.min(indexOfLastItem, filteredDesignations.length)}
                          </span>{" "}
                          of <span className="fw-semibold">{filteredDesignations.length}</span> entries
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
              <Label htmlFor="title" className="form-label">Designation Title</Label>
              <Input
                name="title"
                type="text"
                placeholder="Enter designation title"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.title}
                invalid={validation.touched.title && !!validation.errors.title}
              />
              <FormFeedback>{validation.errors.title}</FormFeedback>
            </div>
            <div>
                <Label htmlFor="department_id" className="form-label">Department</Label>
                <Input
                    type="select"
                    name="department_id"
                    value={validation.values.department_id}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.department_id && !!validation.errors.department_id}
                >
                    <option value="">Select Department</option>
                    {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </Input>
                <FormFeedback>{validation.errors.department_id}</FormFeedback>
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
              Delete <b>{designation?.title}</b>? This action cannot be undone.
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

export default DesignationSettings;