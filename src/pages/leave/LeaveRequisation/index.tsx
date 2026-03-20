import React, { useState } from "react";
import { 
  Card, CardBody, Col, Container, Row, 
  Form, Label, Input, FormFeedback, Button, Spinner 
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLeaveActions } from "../../../Components/Hooks/useLeaveApplications";
import { useEmployeeLeaveBalances } from "../../../Components/Hooks/useLeaveBalance";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import FileUploadArea from "./FileUploadArea"; 
import LeaveBalanceSummary from "./LeaveBalanceSummary"; 

const LeaveRequisition = ({ employeeId }: { employeeId: number }) => {
  const { apply } = useLeaveActions();
  const { data: balances, isLoading: loadingBalances } = useEmployeeLeaveBalances(employeeId);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      leave_type_id: "",
      start_date: "",
      end_date: "",
      reason: "",
    },
    validationSchema: Yup.object({
      leave_type_id: Yup.number().required("Please select a leave type"),
      start_date: Yup.date().required("Start date is required"),
      end_date: Yup.date()
        .required("End date is required")
        .min(Yup.ref("start_date"), "End date cannot be before start date"),
      reason: Yup.string().max(250, "Reason must be under 250 characters"),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        employee_id: employeeId,
        leave_type_id: Number(values.leave_type_id),
        documents: selectedFiles,
      };
      apply.mutate(payload, {
        onSuccess: () => {
          formik.resetForm();
          setSelectedFiles([]);
        }
      });
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Leave Requisition" pageTitle="Leaves" />
        
        <Row>
          <Col lg={4}>
            <LeaveBalanceSummary balances={balances} loading={loadingBalances} />
          </Col>

          <Col lg={8}>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Label>Leave Type</Label>
                      <Input
                        type="select"
                        name="leave_type_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.leave_type_id}
                        invalid={!!(formik.touched.leave_type_id && formik.errors.leave_type_id)}
                      >
                        <option value="">Select Leave Type...</option>
                        {balances?.map((b) => (
                          <option key={b.id} value={b.leave_type_id}>
                            {b.leave_type_name} (Balance: {b.balance_days} days)
                          </option>
                        ))}
                      </Input>
                      <FormFeedback>{formik.errors.leave_type_id}</FormFeedback>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        name="start_date"
                        onChange={formik.handleChange}
                        value={formik.values.start_date}
                        invalid={!!(formik.touched.start_date && formik.errors.start_date)}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        name="end_date"
                        onChange={formik.handleChange}
                        value={formik.values.end_date}
                        invalid={!!(formik.touched.end_date && formik.errors.end_date)}
                      />
                    </Col>

                    <Col md={12} className="mb-3">
                      <Label>Reason / Remarks</Label>
                      <Input
                        type="textarea"
                        rows="3"
                        name="reason"
                        placeholder="Provide details about your leave request..."
                        onChange={formik.handleChange}
                        value={formik.values.reason}
                      />
                    </Col>

                    <Col md={12} className="mb-4">
                      <FileUploadArea 
                        files={selectedFiles} 
                        setFiles={setSelectedFiles} 
                      />
                    </Col>

                    <Col md={12}>
                      <Button 
                        color="primary" 
                        type="submit" 
                        className="w-100" 
                        disabled={apply.isPending}
                      >
                        {apply.isPending ? <Spinner size="sm" /> : "Submit Requisition"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeaveRequisition;