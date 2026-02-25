import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Redux & Hooks
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { editProfile, resetProfileFlag } from "../../slices/thunks";
import { useUser } from "../../Components/Hooks/useAuth"; // Import your modern hook

import avatar from "../../assets/images/users/avatar-1.jpg";

const UserProfile = () => {
  const dispatch: any = useDispatch();
  
  // 1. Get real-time user data from React Query
  const { data: userData } = useUser();

  // 2. Redux State for the "Edit" action status
  const profileSelector = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      success: profile.success,
      error: profile.error
    })
  );
  const { success, error } = useSelector(profileSelector);

  // 3. Formik Setup
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Use userData from React Query, fallback to "Admin"
      first_name: userData?.first_name || 'Admin',
      idx: userData?._id || userData?.id || '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });

  // 4. Handle success flag reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, success]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">Username Updated Successfully!</Alert>}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userData?.first_name || "Admin"}</h5>
                        <p className="mb-1">Email Id : {userData?.email || "N/A"}</p>
                        <p className="mb-0">Id No : #{userData?._id || userData?.id || "0"}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="first_name"
                    className="form-control"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name}
                    invalid={!!(validation.touched.first_name && validation.errors.first_name)}
                  />
                  {validation.touched.first_name && validation.errors.first_name && (
                    <FormFeedback type="invalid">{String(validation.errors.first_name)}</FormFeedback>
                  )}
                  {/* Hidden field for ID */}
                  <Input name="idx" value={validation.values.idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update User Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;