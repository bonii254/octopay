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
// Using your provided hook
import { 
    useEmergencyContactMutation, 
    useEmployeesEmergencyContact 
} from "../../Components/Hooks/employee/useEmergencyContactMutation";
import { CreateEmergencyContactPayload } from "../../types/employee/emergencyContact";
import { toast } from "react-toastify";
import { handleBackendErrors } from "../../helpers/form_utils";

interface Step4Props {
  employeeId: number | null;
  onNext: (id?: number, name?: string, rawData?: any) => void;
  onBack: () => void;
  existingData?: any; 
}

const Step4Emergency = ({ employeeId, onNext, onBack, existingData }: Step4Props) => {
  const { CreateEmergencyContact, UpdateEmergencyContact, isCreating, isUpdating } = useEmergencyContactMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { 
    data: dbEmergency, 
    isLoading: isFetching, 
    error: fetchError 
  } = useEmployeesEmergencyContact(employeeId as number, {
      retry: false, 
  });

  const isNotFoundError = (fetchError as any)?.status === 404;
  const activeContact = !isNotFoundError ? (dbEmergency || existingData?.emergency_contact) : null;
  const hasEmergencyContact = !!activeContact;

  useEffect(() => {
    if (fetchError && !isNotFoundError) {
      const msg = (fetchError as any).message || "Error loading emergency contact.";
      setGlobalError(msg);
    }
  }, [fetchError, isNotFoundError]);

  const formik = useFormik<CreateEmergencyContactPayload>({
    enableReinitialize: true, 
    initialValues: {
      employee_id: employeeId || 0,
      name: activeContact?.name || "",
      relationship: activeContact?.relationship || "",
      phone: activeContact?.phone || "",
      alternate_phone: activeContact?.alternate_phone || "",
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
        setGlobalError(null);
        let response;

        if (hasEmergencyContact) {
          response = await UpdateEmergencyContact({
            id: activeContact.id,
            data: { ...values, employee_id: employeeId }
          });
          toast.info("Emergency contact updated.");
        } else {
          response = await CreateEmergencyContact({
            ...values,
            employee_id: employeeId,
          });
          toast.success("Emergency contact saved.");
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
        <p className="mt-2 text-muted">Retrieving emergency contact...</p>
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
              <p className="mb-0 fw-bold">Fetch Error</p>
              <p className="mb-0 fs-12">{globalError}</p>
            </div>
          </div>
        </Alert>
      )}

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
              invalid={formik.touched.alternate_phone && !!formik.errors.alternate_phone}
            />
            <FormFeedback>{formik.errors.alternate_phone}</FormFeedback>
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
          color={hasEmergencyContact ? "info" : "primary"}
          className="btn-label right"
          disabled={isCreating || isUpdating}
        >
          <i className={`${hasEmergencyContact ? 'ri-save-line' : 'ri-save-3-line'} label-icon align-middle fs-16 ms-2`}></i>
          {isCreating || isUpdating ? (
            <><Spinner size="sm" className="me-2" /> Saving...</>
          ) : hasEmergencyContact ? "Update & Continue" : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step4Emergency;