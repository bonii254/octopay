import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, Label, Input, FormFeedback, Alert } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PublicHoliday } from "../../../../types/leaveApplication";
import { usePublicHolidayActions } from "../../../../Components/Hooks/usePublicHolidays";
import { handleBackendErrors } from "../../../../helpers/form_utils"

interface Props {
  isOpen: boolean;
  toggle: () => void;
  holiday: PublicHoliday | null;
}

const PublicHolidayModal = ({ isOpen, toggle, holiday }: Props) => {
  const { create, update } = usePublicHolidayActions();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: holiday?.name || "",
      holiday_date: holiday?.holiday_date || "",
      is_recurring: holiday?.is_recurring || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Holiday name is required").max(100),
      holiday_date: Yup.date().required("Please select a date"),
    }),
    onSubmit: (values) => {
      const action = holiday ? update : create;
      const payload = holiday ? { id: holiday.id, data: values } : values;

      action.mutate(payload as any, {
        onSuccess: () => {
          setGlobalError(null);
          toggle();
        },
        onError: (error: any) => {
          handleBackendErrors(error, formik.setErrors, setGlobalError);
        }
      });
    },
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="border-0">
      <ModalHeader toggle={toggle} className="bg-light p-3">
        {holiday ? "Edit Public Holiday" : "Add Public Holiday"}
      </ModalHeader>
      <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
        <ModalBody>
          {globalError && <Alert color="danger">{globalError}</Alert>}
          
          <div className="mb-3">
            <Label htmlFor="name" className="form-label">Holiday Name</Label>
            <Input
              id="name"
              type="text"
              {...formik.getFieldProps("name")}
              invalid={formik.touched.name && !!formik.errors.name}
            />
            <FormFeedback>{formik.errors.name}</FormFeedback>
          </div>
          
          <div className="mb-3">
            <Label htmlFor="holiday_date" className="form-label">Date</Label>
            <Input
              id="holiday_date"
              type="date"
              {...formik.getFieldProps("holiday_date")}
              invalid={formik.touched.holiday_date && !!formik.errors.holiday_date}
            />
            <FormFeedback>{formik.errors.holiday_date}</FormFeedback>
          </div>

          <div className="form-check form-switch form-switch-md">
            <Input
              type="checkbox"
              className="form-check-input"
              id="is_recurring"
              checked={formik.values.is_recurring}
              onChange={(e) => formik.setFieldValue("is_recurring", e.target.checked)}
            />
            <Label className="form-check-label" htmlFor="is_recurring">Recurring Yearly</Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit" disabled={create.isPending || update.isPending}>
            {holiday ? "Update Holiday" : "Save Holiday"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PublicHolidayModal;