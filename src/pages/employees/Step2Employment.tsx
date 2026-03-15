import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
    Row, 
    Col, 
    Label, 
    FormFeedback, 
    Form, 
    Button, 
    Spinner,
    Alert 
} from "reactstrap";
import { useEmployeeBaseMutation } from "../../Components/Hooks/employee/useEmployeebase";
import { useDepartments } from "../../Components/Hooks/useDepartment";
import { useDesignations } from "../../Components/Hooks/useDesignation";
import { UpdateEmployeePayload } from "../../types/employee/employeebase";
import { EmploymentType } from "../../types/employee/employeebase";
import { toast } from "react-toastify";
import { handleBackendErrors } from "../../helpers/form_utils";

interface Step2Props {
  employeeId: number | null;
  onNext: (id?: number, name?: string, rawData?: any) => void;
  onBack: () => void;
  existingData?: any;
}

const Step2Employment = ({ employeeId, onNext, onBack, existingData }: Step2Props) => {
  const { UpdateEmployeeBase, isUpdating } = useEmployeeBaseMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const { data: departments, isLoading: loadingDepts } = useDepartments();
  const { data: designations, isLoading: loadingDesigs } = useDesignations();

  const formik = useFormik<UpdateEmployeePayload>({
    enableReinitialize: true,
    initialValues: {
      department_id: existingData?.department_id || null,
      designation_id: existingData?.designation_id || null,
      shift_id: existingData?.shift_id || null,
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
        setGlobalError(null);
        const response = await UpdateEmployeeBase({ 
            id: employeeId, 
            data: values 
        });
        
        toast.success("Employment details updated.");
        onNext(response.id, response.full_name, response); 
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
        toast.error("Failed to update employment details.");
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
      {globalError && (
        <Alert color="danger" className="mb-4">
          <i className="ri-error-warning-fill me-2"></i> {globalError}
        </Alert>
      )}

      <Row className="justify-content-center">

        <Col md={8}>
          <div className="mb-3">
            <Label className="form-label">Employment Type</Label>
            <select
              className={`form-select ${
                formik.touched.employment_type && formik.errors.employment_type ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("employment_type")}
            >
              <option value="">-- Select Employment Type --</option>
              {Object.values(EmploymentType).map((type) => (
                <option key={type} value={type}>
                {type}
                </option>
              ))}
            </select>
            {formik.touched.employment_type && formik.errors.employment_type && (
              <FormFeedback type="invalid">{formik.errors.employment_type}</FormFeedback>
            )}
          </div>
          <div className="mb-4">
            <Label className="form-label">Department</Label>
            <select
              name="department_id"
              className={`form-select form-select-lg ${
                formik.touched.department_id && formik.errors.department_id ? "is-invalid" : ""
              }`}
              value={formik.values.department_id || ""}
              onChange={(e) => formik.setFieldValue("department_id", e.target.value ? Number(e.target.value) : null)}
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
              onChange={(e) => formik.setFieldValue("designation_id", e.target.value ? Number(e.target.value) : null)}
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

          <div className="mb-4 opacity-50 border p-3 rounded bg-light">
            <Label className="form-label text-muted">Work Shift (Optional)</Label>
            <select name="shift_id" className="form-select" disabled>
              <option value="">Standard Day Shift (Default)</option>
            </select>
            <div className="mt-2">
                <small className="text-info">
                    <i className="ri-information-line me-1"></i>
                    Shift management will be enabled in a future update.
                </small>
            </div>
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