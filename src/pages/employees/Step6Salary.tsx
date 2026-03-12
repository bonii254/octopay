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
    Button,
    InputGroup,
    InputGroupText
} from "reactstrap";
import { useSalaryDetailMutation } from "../../Components/Hooks/employee/useSalaryDetailMutation";
import { CreateSalaryDetailPayload } from "../../types/employee/salaryDetail";
import { toast } from "react-toastify";

interface Step6Props {
  employeeId: number | null;
  onNext: () => void;
  onBack: () => void;
}

const Step6Salary = ({ employeeId, onNext, onBack }: Step6Props) => {
  const { CreateSalaryDetail, isCreating } = useSalaryDetailMutation();

  const formik = useFormik<CreateSalaryDetailPayload>({
    initialValues: {
      employee_id: employeeId || 0,
      basic_salary: 0,
      kra_pin: "",
      nssf_number: "",
      nhif_number: "",
      is_tax_exempt: false,
    },
    validationSchema: Yup.object({
      basic_salary: Yup.number()
        .positive("Salary must be greater than 0")
        .required("Basic salary is required"),
      kra_pin: Yup.string()
        .matches(/^[A-Z0-9]{11}$/, "Enter a valid 11-character KRA PIN")
        .nullable(),
      nssf_number: Yup.string().nullable(),
      nhif_number: Yup.string().nullable(),
      is_tax_exempt: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee context missing.");
        return;
      }

      try {
        await CreateSalaryDetail({
          ...values,
          employee_id: employeeId,
        });
        toast.success("Employee onboarding finalized!");
        onNext();
      } catch (error) {
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label">Basic Monthly Salary</Label>
            <InputGroup>
              <InputGroupText>KES</InputGroupText>
              <Input
                type="number"
                placeholder="0.00"
                {...formik.getFieldProps("basic_salary")}
                invalid={formik.touched.basic_salary && !!formik.errors.basic_salary}
              />
              <FormFeedback>{formik.errors.basic_salary}</FormFeedback>
            </InputGroup>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label">KRA PIN</Label>
            <Input
              type="text"
              placeholder="A012345678Z"
              style={{ textTransform: 'uppercase' }}
              {...formik.getFieldProps("kra_pin")}
              invalid={formik.touched.kra_pin && !!formik.errors.kra_pin}
            />
            <FormFeedback>{formik.errors.kra_pin}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label">NSSF Number</Label>
            <Input
              type="text"
              placeholder="Enter NSSF No."
              {...formik.getFieldProps("nssf_number")}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label">NHIF Number</Label>
            <Input
              type="text"
              placeholder="Enter NHIF No."
              {...formik.getFieldProps("nhif_number")}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <div className="form-check form-switch form-switch-md mb-3">
            <Input
              type="switch"
              className="form-check-input"
              id="is_tax_exempt"
              {...formik.getFieldProps("is_tax_exempt")}
              checked={formik.values.is_tax_exempt}
            />
            <Label className="form-check-label" htmlFor="is_tax_exempt">
              Employee is Tax Exempt
            </Label>
            <div className="form-text">
                Enable this only if the employee has a valid disability tax exemption certificate.
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
          color="success"
          className="btn-label right"
          disabled={isCreating}
        >
          <i className="ri-rocket-fill label-icon align-middle fs-16 ms-2"></i>
          {isCreating ? "Finalizing..." : "Finish Onboarding"}
        </Button>
      </div>
    </Form>
  );
};

export default Step6Salary;