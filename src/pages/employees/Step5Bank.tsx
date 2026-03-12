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
import { useBankDetailMutation } from "../../Components/Hooks/employee/useBankDetailMutation";
import { CreateBankDetailPayload } from "../../types/employee/bankDetail";
import { toast } from "react-toastify";

interface Step5Props {
  employeeId: number | null;
  onNext: () => void;
  onBack: () => void;
}

const Step5Bank = ({ employeeId, onNext, onBack }: Step5Props) => {
  const { CreateBankDetail, isCreating } = useBankDetailMutation();

  const formik = useFormik<CreateBankDetailPayload>({
    initialValues: {
      employee_id: employeeId || 0,
      bank_name: "",
      bank_code: "",
      branch_code: "",
      swift_code: "",
      account_number: "",
    },
    validationSchema: Yup.object({
      bank_name: Yup.string().required("Bank name is required"),
      bank_code: Yup.string().required("Bank code is required"),
      branch_code: Yup.string().required("Branch code is required"),
      account_number: Yup.string().required("Account number is required"),
      swift_code: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee context missing.");
        return;
      }

      try {
        await CreateBankDetail({
          ...values,
          employee_id: employeeId,
        });
        toast.success("Onboarding process completed successfully!");
        onNext();
      } catch (error) {
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label">Bank Name</Label>
            <Input
              type="text"
              placeholder="e.g. Kenya Commercial Bank"
              {...formik.getFieldProps("bank_name")}
              invalid={formik.touched.bank_name && !!formik.errors.bank_name}
            />
            <FormFeedback>{formik.errors.bank_name}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Bank Code</Label>
            <Input
              type="text"
              placeholder="Bank Code"
              {...formik.getFieldProps("bank_code")}
              invalid={formik.touched.bank_code && !!formik.errors.bank_code}
            />
            <FormFeedback>{formik.errors.bank_code}</FormFeedback>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Branch Code</Label>
            <Input
              type="text"
              placeholder="Branch Code"
              {...formik.getFieldProps("branch_code")}
              invalid={formik.touched.branch_code && !!formik.errors.branch_code}
            />
            <FormFeedback>{formik.errors.branch_code}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">Account Number</Label>
            <Input
              type="text"
              placeholder="Enter account number"
              {...formik.getFieldProps("account_number")}
              invalid={formik.touched.account_number && !!formik.errors.account_number}
            />
            <FormFeedback>{formik.errors.account_number}</FormFeedback>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label">SWIFT / BIC (Optional)</Label>
            <Input
              type="text"
              placeholder="International Routing Code"
              {...formik.getFieldProps("swift_code")}
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
          color="success"
          className="btn-label right"
          disabled={isCreating}
        >
          <i className="ri-check-double-line label-icon align-middle fs-16 ms-2"></i>
          {isCreating ? "Finalizing..." : "Complete Onboarding"}
        </Button>
      </div>
    </Form>
  );
};

export default Step5Bank;