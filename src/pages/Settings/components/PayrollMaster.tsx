import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";

// Mock Data (Replace with useQuery hooks)
const mockComponents = [
  { id: 1, name: "Basic Salary", code: "BASIC", type: "EARNING", is_taxable: true, is_statutory: true },
  { id: 2, name: "House Allowance", code: "HRA", type: "EARNING", is_taxable: true, is_statutory: false },
  { id: 3, name: "NSSF Deduction", code: "NSSF", type: "DEDUCTION", is_taxable: false, is_statutory: true },
];

const mockTaxBands = [
  { id: 1, lower: 0, upper: 24000, rate: 10 },
  { id: 2, lower: 24001, upper: 32333, rate: 25 },
  { id: 3, lower: 32334, upper: null, rate: 30 }, // Null upper means "And Above"
];

const PayrollMaster = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Formik for Salary Components
  const validation = useFormik({
    initialValues: {
      name: "",
      code: "",
      type: "EARNING",
      is_taxable: true,
      is_statutory: false,
      affects_nssf: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      code: Yup.string().required("Code is required").uppercase(),
    }),
    onSubmit: (values) => {
      console.log("Submitting Component:", values);
      setModal(false);
    },
  });

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="d-flex align-items-center border-0">
          <h5 className="card-title mb-0 flex-grow-1">Payroll Configuration</h5>
        </CardHeader>
        <CardBody className="pt-0">
          <Nav tabs className="nav-tabs-custom nav-success mb-3">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => toggleTab("1")}>
                <i className="ri-wallet-3-line me-2 align-bottom"></i> Salary Components
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => toggleTab("2")}>
                <i className="ri-percent-line me-2 align-bottom"></i> Tax Bands (PAYE)
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            {/* TAB 1: SALARY COMPONENTS */}
            <TabPane tabId="1">
              <div className="d-flex justify-content-end mb-3">
                <Button color="success" size="sm" onClick={() => { setIsEdit(false); setModal(true); }}>
                  <i className="ri-add-line align-middle me-1"></i> Add Component
                </Button>
              </div>
              <div className="table-responsive table-card">
                <Table className="table-nowrap table-hover align-middle mb-0">
                  <thead className="table-light text-muted">
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th className="text-center">Taxable</th>
                      <th className="text-center">Statutory</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockComponents.map((comp) => (
                      <tr key={comp.id}>
                        <td className="fw-medium"><span className="badge bg-light text-body font-monospace">{comp.code}</span></td>
                        <td>{comp.name}</td>
                        <td>
                          <Badge color={comp.type === "EARNING" ? "success-subtle" : "danger-subtle"} className={comp.type === "EARNING" ? "text-success" : "text-danger"}>
                            {comp.type}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {comp.is_taxable ? <i className="ri-checkbox-circle-fill text-success fs-16"></i> : <i className="ri-close-circle-fill text-muted fs-16"></i>}
                        </td>
                        <td className="text-center">
                          {comp.is_statutory ? <i className="ri-shield-check-fill text-info fs-16"></i> : "-"}
                        </td>
                        <td>
                          <div className="hstack gap-2">
                            <button className="btn btn-sm btn-soft-primary"><i className="ri-pencil-fill"></i></button>
                            <button className="btn btn-sm btn-soft-danger"><i className="ri-delete-bin-5-fill"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </TabPane>

            {/* TAB 2: TAX BANDS */}
            <TabPane tabId="2">
              <div className="alert alert-info border-0 shadow-sm" role="alert">
                <strong>Configuring Progressive Tax:</strong> Define the bands sequentially. The Upper Bound of one band connects to the Lower Bound of the next.
              </div>
              <div className="table-responsive table-card">
                <Table className="table-striped align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Band #</th>
                      <th>Lower Limit (KES)</th>
                      <th>Upper Limit (KES)</th>
                      <th>Tax Rate (%)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTaxBands.map((band, index) => (
                      <tr key={band.id}>
                        <td>Band {index + 1}</td>
                        <td>{band.lower.toLocaleString()}</td>
                        <td>{band.upper ? band.upper.toLocaleString() : <span className="text-muted fst-italic">Infinity</span>}</td>
                        <td><span className="fw-bold">{band.rate}%</span></td>
                        <td><Badge color="success-subtle" className="text-success">Active</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="mt-3 text-end">
                 <Button color="light">Update Tax Bands</Button>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* COMPONENT MODAL */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
        <ModalHeader toggle={() => setModal(!modal)}>{isEdit ? "Edit Component" : "New Salary Component"}</ModalHeader>
        <ModalBody>
          <form onSubmit={validation.handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Label>Component Name</Label>
                <Input name="name" placeholder="e.g. Hardship Allowance" onChange={validation.handleChange} value={validation.values.name} />
                <FormFeedback>{validation.errors.name}</FormFeedback>
              </Col>
              <Col md={6}>
                <Label>System Code</Label>
                <Input name="code" placeholder="e.g. HARDSHIP" onChange={validation.handleChange} value={validation.values.code} />
              </Col>
              <Col md={6}>
                 <Label>Type</Label>
                 <select name="type" className="form-select" onChange={validation.handleChange} value={validation.values.type}>
                     <option value="EARNING">Earning (Allowance)</option>
                     <option value="DEDUCTION">Deduction</option>
                 </select>
              </Col>
              <Col md={12}>
                  <div className="border rounded p-3 mt-2 bg-light-subtle">
                      <div className="form-check form-switch mb-2">
                          <Input type="checkbox" role="switch" id="taxSwitch" name="is_taxable" checked={validation.values.is_taxable} onChange={validation.handleChange} />
                          <Label className="form-check-label" htmlFor="taxSwitch">Is Taxable? (Subject to PAYE)</Label>
                      </div>
                      <div className="form-check form-switch">
                          <Input type="checkbox" role="switch" id="nssfSwitch" name="affects_nssf" checked={validation.values.affects_nssf} onChange={validation.handleChange} />
                          <Label className="form-check-label" htmlFor="nssfSwitch">Affects NSSF/Pension?</Label>
                      </div>
                  </div>
              </Col>
              <Col md={12} className="text-end mt-3">
                <Button color="light" className="me-2" onClick={() => setModal(false)}>Cancel</Button>
                <Button color="success" type="submit">Save Component</Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default PayrollMaster;