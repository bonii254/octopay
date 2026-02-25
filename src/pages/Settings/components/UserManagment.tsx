import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
  Badge,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

// Mock Data
const mockUsers = [
  { id: 1, username: "admin_jane", email: "jane@company.com", role: "ADMIN", status: true, last_login: "2 hrs ago" },
  { id: 2, username: "hr_mike", email: "mike@company.com", role: "HR_MANAGER", status: true, last_login: "1 day ago" },
  { id: 3, username: "emp_john", email: "john.d@company.com", role: "EMPLOYEE", status: false, last_login: "Never" },
];

const UserManagement = () => {
  const [modal, setModal] = useState(false);

  const validation = useFormik({
    initialValues: {
      username: "",
      email: "",
      role: "EMPLOYEE",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().min(6).required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Creating User:", values);
      setModal(false);
    },
  });

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="d-flex align-items-center border-0">
              <h5 className="card-title mb-0 flex-grow-1">System Users</h5>
              <div className="flex-shrink-0">
                <div className="d-flex gap-2">
                    <div className="search-box">
                        <Input type="text" className="form-control search" placeholder="Search users..." />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                    <Button color="primary" onClick={() => setModal(true)}>
                        <i className="ri-add-line align-bottom me-1"></i> Add User
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="table-responsive table-card">
                <Table className="align-middle table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: "50px" }}>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                      </th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <th scope="row">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                          </div>
                        </th>
                        <td>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                    <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            {user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="fs-14 m-0">{user.username}</h5>
                                    <p className="text-muted mb-0 fs-12">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                          {user.role === "ADMIN" && <Badge color="danger-subtle" className="text-danger">Admin</Badge>}
                          {user.role === "HR_MANAGER" && <Badge color="warning-subtle" className="text-warning">HR Manager</Badge>}
                          {user.role === "EMPLOYEE" && <Badge color="info-subtle" className="text-info">Employee</Badge>}
                        </td>
                        <td>
                            {user.status ? (
                                <Badge color="success-subtle" className="text-success">Active</Badge>
                            ) : (
                                <Badge color="light" className="text-muted">Inactive</Badge>
                            )}
                        </td>
                        <td className="text-muted">{user.last_login}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="button" className="btn btn-soft-secondary btn-sm dropdown" type="button">
                              <i className="ri-more-fill align-middle"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View</DropdownItem>
                              <DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem className="text-danger"><i className="ri-lock-unlock-line align-bottom me-2"></i> Reset Password</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              {/* Pagination (Static Example) */}
              <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                  <div className="flex-shrink-0">
                      <div className="text-muted">Showing <span className="fw-semibold">3</span> of <span className="fw-semibold">3</span> Results</div>
                  </div>
                  <ul className="pagination pagination-separated pagination-sm mb-0">
                      <li className="page-item disabled"><a href="#" className="page-link">←</a></li>
                      <li className="page-item active"><a href="#" className="page-link">1</a></li>
                      <li className="page-item"><a href="#" className="page-link">→</a></li>
                  </ul>
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ADD USER MODAL */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
        <ModalHeader toggle={() => setModal(!modal)}>Add System User</ModalHeader>
        <ModalBody>
            <form onSubmit={validation.handleSubmit}>
                <div className="mb-3">
                    <Label className="form-label">Username</Label>
                    <Input name="username" placeholder="Enter username" onChange={validation.handleChange} value={validation.values.username} />
                </div>
                <div className="mb-3">
                    <Label className="form-label">Email Address</Label>
                    <Input name="email" type="email" placeholder="Enter email" onChange={validation.handleChange} value={validation.values.email} />
                </div>
                <div className="mb-3">
                    <Label className="form-label">Role</Label>
                    <Input type="select" name="role" onChange={validation.handleChange} value={validation.values.role}>
                        <option value="EMPLOYEE">Employee (Self Service)</option>
                        <option value="HR_MANAGER">HR Manager</option>
                        <option value="ADMIN">System Administrator</option>
                    </Input>
                </div>
                <div className="mb-3">
                    <Label className="form-label">Temporary Password</Label>
                    <Input name="password" type="password" placeholder="Default password" onChange={validation.handleChange} value={validation.values.password} />
                </div>
                <div className="text-end">
                    <Button color="light" className="me-2" onClick={() => setModal(false)}>Close</Button>
                    <Button color="primary" type="submit">Create User</Button>
                </div>
            </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;