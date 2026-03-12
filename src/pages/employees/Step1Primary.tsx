import React, { useEffect } from "react";
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
    Spinner,
    Alert 
} from "reactstrap";
import { useEmployeeBaseMutation } from "../../Components/Hooks/employee/useEmployeebase";
import { useGetCompany } from "../../Components/Hooks/useCompanyProfile";
import { EmployeeStatus, CreateEmployeePayload } from "../../types/employee/employeebase";
import { toast } from "react-toastify";

interface Step1Props {
  onNext: (id: number, name: string) => void;
}

const Step1Primary = ({ onNext }: Step1Props) => {
  const { CreateEmployeeBase, isCreating } = useEmployeeBaseMutation();
  const { data: company, isLoading: isLoadingCompany, isError } = useGetCompany();

  const formik = useFormik<CreateEmployeePayload>({
    initialValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      national_id: "",
      gender: "MALE",
      marital_status: "SINGLE",
      date_of_birth: "",
      hire_date: new Date().toISOString().split("T")[0],
      status: EmployeeStatus.ACTIVE,
      disability_status: false,
      user_id: null,
      department_id: null,
      designation_id: null,
      shift_id: null,
      termination_date: null,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      middle_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      national_id: Yup.string().required("National ID/Passport is required"),
      date_of_birth: Yup.date()
        .required("Date of birth is required")
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "Employee must be at least 18 years old"),
      hire_date: Yup.date().required("Hire date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await CreateEmployeeBase(values);
        toast.success(`Success! ${response.employee_code} registered.`);
        onNext(response.id, response.full_name || `${values.first_name} ${values.last_name}`);
      } catch (error) {
      }
    },
  });

  useEffect(() => {
    if (company?.id) {
      formik.setFieldValue("company_id", company.id);
    }
  }, [company]);

  if (isLoadingCompany) {
    return (
      <div className="text-center p-5">
        <Spinner size="lg" color="primary" />
        <p className="mt-3 text-muted">Synchronizing with Organization...</p>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <Alert color="danger" className="m-3">
        <i className="ri-error-warning-line me-2"></i>
        Critical Error: No active Company record found. Please set up your Company Profile before onboarding employees.
      </Alert>
    );
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className="mb-4 d-flex align-items-center justify-content-between p-3 bg-light-subtle rounded border border-dashed">
        <div>
            <h6 className="mb-1 text-primary">Onboarding for: {company.name}</h6>
            <p className="text-muted mb-0 fs-12">Organization ID: {company.id} | Default Prefix active</p>
        </div>
        <span className="badge bg-success-subtle text-success border border-success-subtle">
            <i className="ri-check-double-line me-1"></i> System Ready
        </span>
      </div>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">First Name</Label>
            <Input
              type="text"
              className="form-control-lg"
              placeholder="Enter first name"
              {...formik.getFieldProps("first_name")}
              invalid={formik.touched.first_name && !!formik.errors.first_name}
            />
            <FormFeedback>{formik.errors.first_name}</FormFeedback>
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Middle Name</Label>
            <Input
              type="text"
              className="form-control-lg"
              placeholder="Enter first name"
              {...formik.getFieldProps("middle_name")}
              invalid={formik.touched.middle_name && !!formik.errors.middle_name}
            />
            <FormFeedback>{formik.errors.middle_name}</FormFeedback>
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Last Name</Label>
            <Input
              type="text"
              className="form-control-lg"
              placeholder="Enter last name"
              {...formik.getFieldProps("last_name")}
              invalid={formik.touched.last_name && !!formik.errors.last_name}
            />
            <FormFeedback>{formik.errors.last_name}</FormFeedback>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">National ID / Passport</Label>
            <Input
              type="text"
              placeholder="ID Number"
              {...formik.getFieldProps("national_id")}
              invalid={formik.touched.national_id && !!formik.errors.national_id}
            />
            <FormFeedback>{formik.errors.national_id}</FormFeedback>
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Gender</Label>
            <select
              className="form-select"
              {...formik.getFieldProps("gender")}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Marital Status</Label>
            <select
              className="form-select"
              {...formik.getFieldProps("marital_status")}
            >
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Date of Birth</Label>
            <Input
              type="date"
              {...formik.getFieldProps("date_of_birth")}
              invalid={formik.touched.date_of_birth && !!formik.errors.date_of_birth}
            />
            <FormFeedback>{formik.errors.date_of_birth}</FormFeedback>
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label">Hire Date</Label>
            <Input
              type="date"
              {...formik.getFieldProps("hire_date")}
            />
          </div>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <div className="form-check form-switch form-switch-lg mt-3">
            <Input
              type="switch"
              className="form-check-input"
              id="disability_status"
              name="disability_status"
              checked={formik.values.disability_status}
              onChange={formik.handleChange}
            />
            <Label className="form-check-label" htmlFor="disability_status">
              Disability Status
            </Label>
          </div>
        </Col>
      </Row>

      <div className="d-flex align-items-start gap-3 mt-4">
        <Button
          type="submit"
          color="success"
          className="btn-label right ms-auto"
          disabled={isCreating || !company?.id}
        >
          <i className="ri-user-add-line label-icon align-middle fs-16 ms-2"></i>
          {isCreating ? "Processing..." : "Create Employee Record"}
        </Button>
      </div>
    </Form>
  );
};

export default Step1Primary;