import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
  Button,
  Form,
  FormFeedback,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  useGetCompany,
  useSaveCompany,
  useDeleteCompany,
} from "../../../../Components/Hooks/useCompanyProfile";

const CompanyProfile: React.FC = () => {
  const { data: companyData, isLoading: isFetching } = useGetCompany();
  const isUpdateMode = !!companyData;

  const { mutate: saveCompany, isPending: isSaving } =
    useSaveCompany(isUpdateMode);
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (companyData?.logo) {
      setLogoPreview(companyData.logo);
    }
  }, [companyData]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: companyData?.name || "",
      prefix: companyData?.prefix || "",
      contact_email: companyData?.contact_email || "",
      contact_phone: companyData?.contact_phone || "",
      address: companyData?.address || "",
      fiscal_year_start: companyData?.fiscal_year_start || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2).max(255).required("Company name is required"),
      prefix: Yup.string().max(10).required("Prefix is required"),
      contact_email: Yup.string()
        .email("Invalid email")
        .required("Contact email is required"),
      contact_phone: Yup.string().required("Contact phone is required"),
      address: Yup.string()
        .min(5)
        .max(255)
        .required("Company address is required"),
      fiscal_year_start: Yup.date().required(
        "Fiscal year start date is required",
      ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      saveCompany(formData, {
        onSuccess: () => {
          toast.success("Company profile saved successfully");
        },
        onError: (err: any) => {
          const responseData = err?.response?.data;

          if (responseData?.errors) {
            const formattedErrors: Record<string, string> = {};

            Object.keys(responseData.errors).forEach((key) => {
              formattedErrors[key] = responseData.errors[key][0];
            });

            validation.setErrors(formattedErrors);
          } else {
            toast.error(
              responseData?.error || "Failed to save company profile",
            );
          }
        },
      });
    },
  });

  if (isFetching) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="position-relative mx-n4 mt-n4 px-4 pt-4">
      <div
        className="profile-foreground position-absolute top-0 start-0 end-0 bg-primary bg-gradient"
        style={{ height: "160px" }}
      ></div>

      <Row className="justify-content-center mt-5">
        <Col xxl={9}>
          <Card className="shadow-lg border-0 mb-4">
            <CardBody className="p-0">
              {/* Header + Logo */}
              <div className="p-4 pb-0">
                <Row className="align-items-end g-3">
                  <Col xs="auto">
                    <div className="position-relative d-inline-block mb-2">
                      <img
                        src={logoPreview || "https://placehold.co/200x200"}
                        className="rounded-circle avatar-xl img-thumbnail shadow object-fit-cover border-4 border-white"
                        style={{
                          width: "110px",
                          height: "110px",
                          marginTop: "-30px",
                        }}
                        alt="logo"
                      />

                      <Input
                        id="logo-input"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            const reader = new FileReader();
                            reader.onload = () =>
                              setLogoPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      <Label
                        htmlFor="logo-input"
                        className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow cursor-pointer"
                      >
                        ✏️
                      </Label>
                    </div>
                  </Col>

                  <Col className="pb-3">
                    <h3 className="text-white mb-1">
                      {validation.values.name || "Company Profile"}
                    </h3>
                  </Col>
                </Row>
              </div>

              {/* Form Section */}
              <div className="p-4 bg-light bg-opacity-50 mt-4">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                  }}
                >
                  <Row className="g-4">
                    <Col md={6}>
                      <Label>Company Name</Label>
                      <Input
                        {...validation.getFieldProps("name")}
                        invalid={
                          validation.touched.name && !!validation.errors.name
                        }
                      />

                      <FormFeedback>
                        {typeof validation.errors.name === "string"
                          ? validation.errors.name
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={6}>
                      <Label>Prefix</Label>
                      <Input
                        {...validation.getFieldProps("prefix")}
                        invalid={
                          validation.touched.prefix &&
                          !!validation.errors.prefix
                        }
                      />
                      <FormFeedback>
                        {typeof validation.errors.prefix === "string"
                          ? validation.errors.prefix
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={6}>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        {...validation.getFieldProps("contact_email")}
                        invalid={
                          validation.touched.contact_email &&
                          !!validation.errors.contact_email
                        }
                      />
                      <FormFeedback>
                        {typeof validation.errors.contact_email === "string"
                          ? validation.errors.contact_email
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={6}>
                      <Label>Contact Phone</Label>
                      <Input
                        {...validation.getFieldProps("contact_phone")}
                        invalid={
                          validation.touched.contact_phone &&
                          !!validation.errors.contact_phone
                        }
                      />
                      <FormFeedback>
                        {typeof validation.errors.contact_phone === "string"
                          ? validation.errors.contact_phone
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={6}>
                      <Label>Fiscal Year Start</Label>
                      <Input
                        type="date"
                        {...validation.getFieldProps("fiscal_year_start")}
                        invalid={
                          validation.touched.fiscal_year_start &&
                          !!validation.errors.fiscal_year_start
                        }
                      />
                      <FormFeedback>
                        {typeof validation.errors.fiscal_year_start === "string"
                          ? validation.errors.fiscal_year_start
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={12}>
                      <Label>Address</Label>
                      <Input
                        type="textarea"
                        rows={3}
                        {...validation.getFieldProps("address")}
                        invalid={
                          validation.touched.address &&
                          !!validation.errors.address
                        }
                      />
                      <FormFeedback>
                        {typeof validation.errors.address === "string"
                          ? validation.errors.address
                          : ""}
                      </FormFeedback>
                    </Col>

                    <Col md={12} className="text-end border-top pt-4">
                      <Button color="primary" type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <Spinner size="sm" />
                        ) : isUpdateMode ? (
                          "Update Profile"
                        ) : (
                          "Create Profile"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>

              {/* Delete Section */}
              {isUpdateMode && (
                <div className="p-4 border-top border-dashed">
                  <div className="d-flex justify-content-between align-items-center p-3 border border-danger rounded bg-danger bg-opacity-10">
                    <p className="fw-semibold mb-0 text-danger">
                      Delete Company
                    </p>

                    <Button
                      color="danger"
                      outline
                      onClick={() => setDeleteModal(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Delete Company
        </ModalHeader>
        <ModalBody>Are you sure? This action is permanent.</ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>

          <Button
            color="danger"
            disabled={isDeleting}
            onClick={() =>
              deleteCompany(undefined, {
                onSuccess: () => {
                  setDeleteModal(false);
                  validation.resetForm();
                  toast.success("Company deleted");
                },
              })
            }
          >
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CompanyProfile;
