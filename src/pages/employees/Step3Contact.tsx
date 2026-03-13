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
    Alert,
    Spinner
} from "reactstrap";
import { 
    useContactMutation, 
    useEmployeesContact 
} from "../../Components/Hooks/employee/useEmployeeContactMutation";
import { CreateEmployeeContactPayload } from "../../types/employee/employeeContact";
import { toast } from "react-toastify";
import { handleBackendErrors } from "../../helpers/form_utils";

interface Step3Props {
  employeeId: number | null;
  onNext: (id?: number, name?: string, rawData?: any) => void;
  onBack: () => void;
  existingData?: any;
}

const Step3Contact = ({ employeeId, onNext, onBack, existingData }: Step3Props) => {
  const { CreateEmployeeContact, UpdateEmployeeContact, isCreating, isUpdating } = useContactMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { 
    data: dbContact, 
    isLoading: isFetching, 
    error: fetchError 
  } = useEmployeesContact(employeeId as number, {
      retry: false, 
  });

  const isNotFoundError = (fetchError as any)?.status === 404;
  const activeContact = !isNotFoundError ? (dbContact || existingData?.contact) : null;
  const hasContactRecord = !!activeContact;

  useEffect(() => {
    if (fetchError && !isNotFoundError) {
      const msg = (fetchError as any).message || "Failed to load contact record.";
      setGlobalError(msg);
    }
  }, [fetchError, isNotFoundError]);

  const formik = useFormik<CreateEmployeeContactPayload>({
    enableReinitialize: true, 
    initialValues: {
      employee_id: employeeId || 0,
      phone: activeContact?.phone || "",
      email: activeContact?.email || "",
      address: activeContact?.address || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid format").required("Required"),
      phone: Yup.string().min(10, "Min 10 digits").required("Required"),
      address: Yup.string().min(5, "Too short").required("Required"),
    }),
    onSubmit: async (values) => {
      if (!employeeId) {
        toast.error("Employee context lost.");
        return;
      }

      try {
        setGlobalError(null);
        let response;

        if (hasContactRecord) {
          response = await UpdateEmployeeContact({ 
            id: activeContact.id, 
            data: { ...values, employee_id: employeeId } 
          });
          toast.info("Contact updated.");
        } else {
          response = await CreateEmployeeContact({ 
            ...values, 
            employee_id: employeeId 
          });
          toast.success("Contact created.");
        }
        
        onNext(employeeId, undefined, response);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  if (isFetching && !activeContact && !isNotFoundError) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Retrieving records...</p>
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
              <p className="mb-0 fw-bold">Server Error</p>
              <p className="mb-0 fs-12">{globalError}</p>
            </div>
          </div>
        </Alert>
      )}

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
                    placeholder="0712345678"
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
                <Label className="form-label">Physical Address</Label>
                <Input
                  type="textarea"
                  rows={3}
                  placeholder="Street, City, House No."
                  {...formik.getFieldProps("address")}
                  invalid={formik.touched.address && !!formik.errors.address}
                />
                <FormFeedback>{formik.errors.address}</FormFeedback>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-4 border-top pt-4">
        <Button type="button" color="light" className="btn-label" onClick={onBack}>
          <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
          Back
        </Button>

        <Button
          type="submit"
          color={hasContactRecord ? "info" : "primary"}
          className="btn-label right"
          disabled={isCreating || isUpdating}
        >
          <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
          {isCreating || isUpdating ? (
            <><Spinner size="sm" className="me-2" /> Saving...</>
          ) : hasContactRecord ? "Update & Continue" : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step3Contact;