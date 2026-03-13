import React, { useState, useEffect } from "react";
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
    InputGroupText,
    Alert,
    Spinner
} from "reactstrap";
import { useSalaryDetailMutation } from "../../Components/Hooks/employee/useSalaryDetailMutation";
import { usesalaryDetail } from "../../Components/Hooks/employee/useSalaryDetailMutation"; 
import { CreateSalaryDetailPayload } from "../../types/employee/salaryDetail";
import { toast } from "react-toastify";
import { handleBackendErrors } from "../../helpers/form_utils";

interface Step6Props {
  employeeId: number | null;
  onNext: (id?: number, name?: string, rawData?: any) => void;
  onBack: () => void;
  existingData?: any; 
}

const Step6Salary = ({ employeeId, onNext, onBack, existingData }: Step6Props) => {
  const { CreateSalaryDetail, UpdateSalaryDetail, isCreating, isUpdating } = useSalaryDetailMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { 
    data: dbSalary, 
    isLoading: isFetching, 
    error: fetchError 
  } = usesalaryDetail(employeeId as number, {
      retry: false,
  });

  const isNotFoundError = (fetchError as any)?.status === 404;
  const activeSalary = !isNotFoundError ? (dbSalary || existingData?.salary_details) : null;
  const hasSalaryDetails = !!activeSalary;

  useEffect(() => {
    if (fetchError && !isNotFoundError) {
      const msg = (fetchError as any).message || "Error loading payroll details.";
      setGlobalError(msg);
    }
  }, [fetchError, isNotFoundError]);

  const formik = useFormik<CreateSalaryDetailPayload>({
    enableReinitialize: true,
    initialValues: {
      employee_id: employeeId || 0,
      basic_salary: activeSalary?.basic_salary || 0,
      kra_pin: activeSalary?.kra_pin || "",
      nssf_number: activeSalary?.nssf_number || "",
      nhif_number: activeSalary?.nhif_number || "",
      is_tax_exempt: activeSalary?.is_tax_exempt || false,
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
        setGlobalError(null);
        let response;

        if (hasSalaryDetails) {
          response = await UpdateSalaryDetail({
            id: activeSalary.id,
            data: { ...values, employee_id: employeeId }
          });
          toast.info("Salary records updated successfully.");
        } else {
          response = await CreateSalaryDetail({
            ...values,
            employee_id: employeeId,
          });
          toast.success("Employee onboarding finalized!");
        }

        onNext(employeeId, undefined, response);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  if (isFetching && !activeSalary && !isNotFoundError) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Calculating payroll records...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      {globalError && (
        <Alert color="danger" className="mb-4 shadow-sm border-0 border-start border-4 border-danger">
          <div className="d-flex align-items-center">
            <i className="ri-error-warning-fill fs-24 me-2"></i>
            <div>
              <p className="mb-0 fw-bold">Payroll Sync Error</p>
              <p className="mb-0 fs-12">{globalError}</p>
            </div>
          </div>
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label text-primary fw-bold">Basic Monthly Salary</Label>
            <InputGroup>
              <InputGroupText className="bg-light">KES</InputGroupText>
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
              {...formik.getFieldProps("kra_pin")}
              onChange={(e) => formik.setFieldValue("kra_pin", e.target.value.toUpperCase())}
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
              invalid={formik.touched.nssf_number && !!formik.errors.nssf_number}
            />
            <FormFeedback>{formik.errors.nssf_number}</FormFeedback>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-4">
            <Label className="form-label">NHIF Number</Label>
            <Input
              type="text"
              placeholder="Enter NHIF No."
              {...formik.getFieldProps("nhif_number")}
              invalid={formik.touched.nhif_number && !!formik.errors.nhif_number}
            />
            <FormFeedback>{formik.errors.nhif_number}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <div className="p-3 border rounded bg-light-subtle mb-3 border-start border-4 border-info">
            <div className="form-check form-switch form-switch-md">
              <Input
                type="switch"
                className="form-check-input"
                id="is_tax_exempt"
                checked={formik.values.is_tax_exempt}
                onChange={(e) => formik.setFieldValue("is_tax_exempt", e.target.checked)}
              />
              <Label className="form-check-label fw-medium" htmlFor="is_tax_exempt">
                Employee is Tax Exempt
              </Label>
            </div>
            <div className="form-text text-muted mt-2">
                <i className="ri-information-line me-1"></i>
                Enable this only if the employee has a valid disability tax exemption certificate from KRA.
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
          color={hasSalaryDetails ? "info" : "success"}
          className="btn-label right shadow-sm"
          disabled={isCreating || isUpdating}
        >
          <i className={`${hasSalaryDetails ? 'ri-save-line' : 'ri-rocket-fill'} label-icon align-middle fs-16 ms-2`}></i>
          {isCreating || isUpdating ? (
            <><Spinner size="sm" className="me-2" /> Processing...</>
          ) : hasSalaryDetails ? "Update & Finish" : "Finish Onboarding"}
        </Button>
      </div>
    </Form>
  );
};

export default Step6Salary;