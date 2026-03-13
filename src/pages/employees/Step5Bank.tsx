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
import { useBankDetailMutation } from "../../Components/Hooks/employee/useBankDetailMutation";
import { useBankDetail } from "../../Components/Hooks/employee/useBankDetailMutation"; 
import { CreateBankDetailPayload } from "../../types/employee/bankDetail";
import { toast } from "react-toastify";
import { handleBackendErrors } from "../../helpers/form_utils";

interface Step5Props {
  employeeId: number | null;
  onNext: (id?: number, name?: string, rawData?: any) => void;
  onBack: () => void;
  existingData?: any;
}

const Step5Bank = ({ employeeId, onNext, onBack, existingData }: Step5Props) => {
  const { CreateBankDetail, UpdateBankDetail, isCreating, isUpdating } = useBankDetailMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { 
    data: dbBank, 
    isLoading: isFetching, 
    error: fetchError 
  } = useBankDetail(employeeId as number, {
      retry: false, 
  });

  const isNotFoundError = (fetchError as any)?.status === 404;
  const activeBank = !isNotFoundError ? (dbBank || existingData?.bank_details) : null;
  const hasBankDetails = !!activeBank;

  useEffect(() => {
    if (fetchError && !isNotFoundError) {
      const msg = (fetchError as any).message || "Failed to load bank information.";
      setGlobalError(msg);
    }
  }, [fetchError, isNotFoundError]);

  const formik = useFormik<CreateBankDetailPayload>({
    enableReinitialize: true, 
    initialValues: {
      employee_id: employeeId || 0,
      bank_name: activeBank?.bank_name || "",
      bank_code: activeBank?.bank_code || "",
      branch_code: activeBank?.branch_code || "",
      swift_code: activeBank?.swift_code || "",
      account_number: activeBank?.account_number || "",
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
        setGlobalError(null);
        let response;

        if (hasBankDetails) {
          response = await UpdateBankDetail({
            id: activeBank.id,
            data: { ...values, employee_id: employeeId }
          });
          toast.info("Bank details updated successfully.");
        } else {
          response = await CreateBankDetail({
            ...values,
            employee_id: employeeId,
          });
          toast.success("Bank details saved successfully.");
        }

        onNext(employeeId, undefined, response);
      } catch (error: any) {
        handleBackendErrors(error, formik.setErrors, setGlobalError);
      }
    },
  });

  if (isFetching && !activeBank && !isNotFoundError) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Retrieving bank details...</p>
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
              <p className="mb-0 fw-bold">Server Connection Issue</p>
              <p className="mb-0 fs-12">{globalError}</p>
            </div>
          </div>
        </Alert>
      )}

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
          color={hasBankDetails ? "info" : "success"}
          className="btn-label right"
          disabled={isCreating || isUpdating}
        >
          <i className={`${hasBankDetails ? 'ri-save-line' : 'ri-check-double-line'} label-icon align-middle fs-16 ms-2`}></i>
          {isCreating || isUpdating ? (
            <><Spinner size="sm" className="me-2" /> Saving...</>
          ) : hasBankDetails ? "Update & Continue" : "Save & Continue"}
        </Button>
      </div>
    </Form>
  );
};

export default Step5Bank;