import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
    Row, 
    Col, 
    Label, 
    FormFeedback, 
    Form, 
    Button, 
    Spinner 
} from "reactstrap";
import { useEmployeeBaseMutation } from "../../Components/Hooks/employee/useEmployeebase";
import { useDepartments } from "../../Components/Hooks/useDepartment";
import { useDesignations } from "../../Components/Hooks/useDesignation";
import { UpdateEmployeePayload } from "../../types/employee/employeebase";
import { toast } from "react-toastify";

interface Step2Props {
  employeeId: number | null;
  onNext: () => void;
  onBack: () => void;
}

const Step2Employment = ({ employeeId, onNext, onBack }: Step2Props) => {
  const { UpdateEmployeeBase, isUpdating } = useEmployeeBaseMutation();
  
  const { data: departments, isLoading: loadingDepts } = useDepartments();
  const { data: designations, isLoading: loadingDesigs } = useDesignations();

  const formik = useFormik<UpdateEmployeePayload>({
    initialValues: {
      department_id: null,
      designation_id: null,
      shift_id: null,
    },
    validationSchema: Yup.object({
      department_id: Yup.number().nullable().required("Please select a department"),
      designation_id: Yup.number().nullable().required("Please select a designation"),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee session lost. Please go back to Step 1.");
        return;
      }

      try {
        await UpdateEmployeeBase({ id: employeeId, data: values });
        toast.success("Employment details updated.");
        onNext();
      } catch (error) {
      }
    },
  });

  const isLoading = loadingDepts || loadingDesigs;

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Loading organization structures...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="mb-4">
            <Label className="form-label">Department</Label>
            <select
              name="department_id"
              className={`form-select form-select-lg ${
                formik.touched.department_id && formik.errors.department_id ? "is-invalid" : ""
              }`}
              value={formik.values.department_id || ""}
              onChange={(e) => formik.setFieldValue("department_id", Number(e.target.value))}
            >
              <option value="">Select Department</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <FormFeedback>{formik.errors.department_id}</FormFeedback>
          </div>

          <div className="mb-4">
            <Label className="form-label">Designation / Role</Label>
            <select
              name="designation_id"
              className={`form-select form-select-lg ${
                formik.touched.designation_id && formik.errors.designation_id ? "is-invalid" : ""
              }`}
              value={formik.values.designation_id || ""}
              onChange={(e) => formik.setFieldValue("designation_id", Number(e.target.value))}
            >
              <option value="">Select Designation</option>
              {designations?.map((desig) => (
                <option key={desig.id} value={desig.id}>
                  {desig.title}
                </option>
              ))}
            </select>
            <FormFeedback>{formik.errors.designation_id}</FormFeedback>
          </div>

          <div className="mb-4 opacity-50">
            <Label className="form-label text-muted">Work Shift (Optional)</Label>
            <select name="shift_id" className="form-select" disabled>
              <option value="">Standard Day Shift (Default)</option>
            </select>
            <small className="text-info">Shift management will be enabled in a future update.</small>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-4 border-top pt-4">
        <Button
          type="button"
          color="light"
          className="btn-label"
          onClick={onBack}
        >
          <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
          Back
        </Button>

        <Button
          type="submit"
          color="primary"
          className="btn-label right"
          disabled={isUpdating}
        >
          <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
          {isUpdating ? "Updating..." : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step2Employment;