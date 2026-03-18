import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Input, Form } from "reactstrap";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (values: any) => void;
  initialData?: any; 
  employees: any[];
  leaveTypes: any[];
  isEdit?: boolean;
}

const LeaveBalanceModal = ({ 
  isOpen, 
  toggle, 
  onSubmit, 
  initialData, 
  employees, 
  leaveTypes, 
  isEdit 
}: Props) => {

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employee_id: initialData?.employee_id || "",
      leave_type_id: initialData?.leave_type_id || "",
      opening_balance: initialData?.opening_balance || 0,
      carried_forward: initialData?.carried_forward || 0,
      fiscal_year: initialData?.fiscal_year || new Date().getFullYear(),
    },
    validationSchema: Yup.object({
      employee_id: Yup.string().required("Please select an employee"),
      leave_type_id: Yup.string().required("Please select a leave type"),
      opening_balance: Yup.number().min(0, "Must be 0 or more").required("Required"),
      carried_forward: Yup.number().min(0, "Must be 0 or more"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const employeeOptions = employees.map(e => ({ 
    value: e.id, 
    label: `${e.first_name} ${e.last_name} (${e.employee_code})` 
  }));

  const leaveTypeOptions = leaveTypes.map(t => ({ 
    value: t.id, 
    label: t.name 
  }));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle} className="bg-light p-3">
        {isEdit ? "Update Leave Balance" : "Initialize Leave Balance"}
      </ModalHeader>
      
      <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
        <ModalBody>
          <Row className="g-3">
            {!isEdit ? (
              <>
                <Col lg={12}>
                  <Label htmlFor="employee_id" className="form-label">Employee</Label>
                  <Select
                    id="employee_id"
                    options={employeeOptions}
                    placeholder="Search Employee..."
                    onChange={(opt: any) => formik.setFieldValue("employee_id", opt ? opt.value : "")}
                    classNamePrefix="react-select"
                  />
                  {formik.errors.employee_id && formik.touched.employee_id && (
                    <div className="text-danger mt-1 fs-12">
                        {String(formik.errors.employee_id)}
                        </div>
                    )}
                </Col>

                <Col lg={6}>
                  <Label htmlFor="leave_type_id" className="form-label">Leave Type</Label>
                  <Select
                    id="leave_type_id"
                    options={leaveTypeOptions}
                    placeholder="Select Type..."
                    onChange={(opt: any) => formik.setFieldValue("leave_type_id", opt ? opt.value : "")}
                    classNamePrefix="react-select"
                  />
                  {formik.errors.leave_type_id && formik.touched.leave_type_id && (
                    <div className="text-danger mt-1 fs-12">{String(formik.errors.leave_type_id)}</div>
                  )}
                </Col>

                <Col lg={6}>
                  <Label htmlFor="fiscal_year" className="form-label">Fiscal Year</Label>
                  <Input
                    id="fiscal_year"
                    type="number"
                    {...formik.getFieldProps("fiscal_year")}
                  />
                </Col>
              </>
            ) : (
              <Col lg={12}>
                <div className="p-2 border rounded bg-light-subtle mb-2">
                  <p className="mb-0 fw-bold">Editing Balance for:</p>
                  <span className="text-primary">{initialData?.employee_name}</span> | <span>{initialData?.leave_type_name}</span>
                </div>
              </Col>
            )}

            <Col lg={6}>
              <Label htmlFor="opening_balance" className="form-label">Opening Balance (Days)</Label>
              <Input
                id="opening_balance"
                type="number"
                step="0.5"
                placeholder="0.0"
                {...formik.getFieldProps("opening_balance")}
              />
            </Col>

            <Col lg={6}>
              <Label htmlFor="carried_forward" className="form-label">Carried Forward (Days)</Label>
              <Input
                id="carried_forward"
                type="number"
                step="0.5"
                placeholder="0.0"
                {...formik.getFieldProps("carried_forward")}
              />
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button color="light" onClick={toggle}>Close</Button>
            <Button color="success" type="submit" id="add-btn">
              {isEdit ? "Update Record" : "Initialize Balance"}
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default LeaveBalanceModal;