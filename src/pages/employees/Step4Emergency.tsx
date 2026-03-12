import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
    Row, 
    Col, 
    Label, 
    Input, 
    FormFeedback, 
    Form, 
    Button 
} from "reactstrap";
import { useEmergencyContactMutation } from "../../Components/Hooks/employee/useEmergencyContactMutation";
import { CreateEmergencyContactPayload } from "../../types/employee/emergencyContact";
import { toast } from "react-toastify";

interface Step4Props {
  employeeId: number | null;
  onNext: () => void;
  onBack: () => void;
}

const Step4Emergency = ({ employeeId, onNext, onBack }: Step4Props) => {
  const { CreateEmergencyContact, isCreating } = useEmergencyContactMutation();

  const formik = useFormik<CreateEmergencyContactPayload>({
    initialValues: {
      employee_id: employeeId || 0,
      name: "",
      relationship: "",
      phone: "",
      alternate_phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      relationship: Yup.string().required("Relationship type is required"),
      phone: Yup.string().required("Primary phone is required"),
      alternate_phone: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee context missing.");
        return;
      }

      try {
        await CreateEmergencyContact({
          ...values,
          employee_id: employeeId,
        });
        toast.success("Emergency contact saved.");
        onNext();
      } catch (error) {
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Contact Full Name</Label>
            <Input
              type="text"
              placeholder="Enter full name"
              {...formik.getFieldProps("name")}
              invalid={formik.touched.name && !!formik.errors.name}
            />
            <FormFeedback>{formik.errors.name}</FormFeedback>
          </div>
        </Col>

        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Relationship</Label>
            <select
              className={`form-select ${
                formik.touched.relationship && formik.errors.relationship ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("relationship")}
            >
              <option value="">Select Relationship</option>
              <option value="SPOUSE">Spouse</option>
              <option value="PARENT">Parent</option>
              <option value="SIBLING">Sibling</option>
              <option value="CHILD">Child</option>
              <option value="FRIEND">Friend</option>
              <option value="OTHER">Other</option>
            </select>
            <FormFeedback>{formik.errors.relationship}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Primary Phone</Label>
            <Input
              type="text"
              placeholder="e.g. 07XXXXXXXX"
              {...formik.getFieldProps("phone")}
              invalid={formik.touched.phone && !!formik.errors.phone}
            />
            <FormFeedback>{formik.errors.phone}</FormFeedback>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Alternate Phone (Optional)</Label>
            <Input
              type="text"
              placeholder="Second number"
              {...formik.getFieldProps("alternate_phone")}
            />
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-4 border-top pt-4">
        <Button type="button" color="light" className="btn-label" onClick={onBack}>
          <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
          Back
        </Button>

        <Button
          type="submit"
          color="primary"
          className="btn-label right"
          disabled={isCreating}
        >
          <i className="ri-save-3-line label-icon align-middle fs-16 ms-2"></i>
          {isCreating ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step4Emergency;