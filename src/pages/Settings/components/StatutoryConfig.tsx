// src/pages/Settings/components/StatutoryConfig.tsx
import React from "react";
import { Card, CardHeader, CardBody, Row, Col, Label, Input, Button, InputGroup, InputGroupText } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useStatutoryQuery, useUpdateStatutoryMutation } from "../hooks/usePayrollConfig";

const StatutoryConfig = () => {
  // Mock Data - In real app, use the hook above
  const initialValues = {
    effective_date: "2024-01-01",
    nssf_tier_1_limit: 7000,
    nssf_tier_2_limit: 36000,
    nssf_rate: 6, // Display as 6, save as 0.06
    housing_levy_rate: 1.5,
    shif_rate: 2.75,
    personal_relief: 2400,
    nita_levy: 50,
  };

  const validation = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      nssf_tier_1_limit: Yup.number().required(),
      housing_levy_rate: Yup.number().required(),
    }),
    onSubmit: (values) => {
      // Convert percentages back to decimals for backend
      const payload = {
        ...values,
        nssf_rate: values.nssf_rate / 100,
        housing_levy_rate: values.housing_levy_rate / 100,
        shif_rate: values.shif_rate / 100,
      };
      console.log("Submitting to Backend:", payload);
    },
  });

  return (
    <Card>
      <CardHeader className="d-flex align-items-center">
        <h5 className="card-title mb-0 flex-grow-1">Statutory Configuration (Kenya)</h5>
        <Button color="primary" onClick={() => validation.handleSubmit()}>Save Changes</Button>
      </CardHeader>
      <CardBody>
        <h6 className="text-muted text-uppercase fw-semibold mb-3">NSSF & SHIF Rates</h6>
        <Row className="gy-4">
          <Col md={6}>
            <Label>NSSF Tier 1 Limit</Label>
            <InputGroup>
              <InputGroupText>KES</InputGroupText>
              <Input name="nssf_tier_1_limit" type="number" onChange={validation.handleChange} value={validation.values.nssf_tier_1_limit} />
            </InputGroup>
          </Col>
          <Col md={6}>
            <Label>NSSF Tier 2 Limit</Label>
            <InputGroup>
              <InputGroupText>KES</InputGroupText>
              <Input name="nssf_tier_2_limit" type="number" onChange={validation.handleChange} value={validation.values.nssf_tier_2_limit} />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Label>NSSF Employee Rate</Label>
            <InputGroup>
              <Input name="nssf_rate" type="number" onChange={validation.handleChange} value={validation.values.nssf_rate} />
              <InputGroupText>%</InputGroupText>
            </InputGroup>
          </Col>
          <Col md={4}>
            <Label>Housing Levy</Label>
            <InputGroup>
              <Input name="housing_levy_rate" type="number" onChange={validation.handleChange} value={validation.values.housing_levy_rate} />
              <InputGroupText>%</InputGroupText>
            </InputGroup>
          </Col>
           <Col md={4}>
            <Label>SHIF Rate</Label>
            <InputGroup>
              <Input name="shif_rate" type="number" onChange={validation.handleChange} value={validation.values.shif_rate} />
              <InputGroupText>%</InputGroupText>
            </InputGroup>
          </Col>
        </Row>

        <h6 className="text-muted text-uppercase fw-semibold mb-3 mt-4">Tax Reliefs & Levies</h6>
        <Row className="gy-4">
          <Col md={6}>
            <Label>Personal Relief (Monthly)</Label>
            <InputGroup>
              <InputGroupText>KES</InputGroupText>
              <Input name="personal_relief" type="number" onChange={validation.handleChange} value={validation.values.personal_relief} />
            </InputGroup>
          </Col>
          <Col md={6}>
            <Label>NITA Levy</Label>
            <InputGroup>
              <InputGroupText>KES</InputGroupText>
              <Input name="nita_levy" type="number" onChange={validation.handleChange} value={validation.values.nita_levy} />
            </InputGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default StatutoryConfig;