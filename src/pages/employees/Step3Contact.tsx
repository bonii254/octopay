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
import { useContactMutation } from "../../Components/Hooks/employee/useEmployeeContactMutation";
import { CreateEmployeeContactPayload } from "../../types/employee/employeeContact";
import { toast } from "react-toastify";

interface Step3Props {
  employeeId: number | null;
  onNext: () => void;
  onBack: () => void;
}

const Step3Contact = ({ employeeId, onNext, onBack }: Step3Props) => {
  const { CreateEmployeeContact, isCreating } = useContactMutation();

  const formik = useFormik<CreateEmployeeContactPayload>({
    initialValues: {
      employee_id: employeeId || 0,
      phone: "",
      email: "",
      address: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Contact email is required"),
      phone: Yup.string()
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      address: Yup.string()
        .min(5, "Please provide a more detailed address")
        .required("Physical address is required"),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee context lost. Please return to Step 1.");
        return;
      }

      try {
        await CreateEmployeeContact({ 
            ...values, 
            employee_id: employeeId 
        });
        
        toast.success("Contact information saved successfully");
        onNext();
      } catch (error) {
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="justify-content-center">
        <Col md={10}>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label">Email Address</Label>
                <div className="form-icon">
                  <Input
                    type="email"
                    className="form-control-icon"
                    placeholder="example@domain.com"
                    {...formik.getFieldProps("email")}
                    invalid={formik.touched.email && !!formik.errors.email}
                  />
                  <i className="ri-mail-send-line"></i>
                  <FormFeedback>{formik.errors.email}</FormFeedback>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label">Phone Number</Label>
                <div className="form-icon">
                  <Input
                    type="text"
                    className="form-control-icon"
                    placeholder="e.g., 0712345678"
                    {...formik.getFieldProps("phone")}
                    invalid={formik.touched.phone && !!formik.errors.phone}
                  />
                  <i className="ri-phone-line"></i>
                  <FormFeedback>{formik.errors.phone}</FormFeedback>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <div className="mb-4">
                <Label className="form-label">Physical Residential Address</Label>
                <Input
                  type="textarea"
                  rows={3}
                  placeholder="Enter house number, street, city and any other relevant details"
                  {...formik.getFieldProps("address")}
                  invalid={formik.touched.address && !!formik.errors.address}
                />
                <FormFeedback>{formik.errors.address}</FormFeedback>
                <div className="form-text mt-2 text-muted small">
                   <i className="ri-information-line me-1"></i>
                   Ensure this address matches the employee's official residential records.
                </div>
              </div>
            </Col>
          </Row>
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
          disabled={isCreating}
        >
          <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
          {isCreating ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step3Contact;