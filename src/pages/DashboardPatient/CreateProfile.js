import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Cookies from 'universal-cookie';

//redux
import { useSelector, useDispatch } from "react-redux";

// actions
import { createPatientProfile, createDoctorProfile } from "../../slices/thunks";

const CreateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userRole, setUserRole] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const userData = cookies.get("user");
    if (userData) {
      try {
        const parsed = typeof userData === "string" ? JSON.parse(userData) : userData;
        setUserRole(parsed.role);
      } catch {
        setUserRole("");
      }
    }
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      gender: '',
      date_of_birth: '',
      contact_address: '',
      medicare_number: '',
      medicare_expiry: '',
      ihi: '',
    },
    validationSchema: Yup.object({
      gender: Yup.string().required("Please select your gender"),
      date_of_birth: Yup.date().required("Please enter your date of birth"),
      contact_address: Yup.string().required("Please enter your contact address"),
      medicare_number: Yup.string().required("Please enter your medicare number"),
      medicare_expiry: Yup.date().required("Please enter medicare expiry date"),
      ihi: Yup.string().required("Please enter your IHI number"),
    }),
    onSubmit: async (values) => {
      try {
        setFieldErrors({}); // Clear any previous field errors
        let response;
        if (userRole === "doctor") {
          response = await dispatch(createDoctorProfile(values));
        } else {
          response = await dispatch(createPatientProfile(values));
        }
        if (response) {
          setSuccess("Profile created successfully!");
          setTimeout(() => {
            navigate("/user-profile");
          }, 2000);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          const errorData = err.response.data;
          setFieldErrors(errorData);
          setError("Please correct the errors below");
        } else {
          setError(err.message || "Failed to create profile");
        }
      }
    }
  });

  document.title = "Create Profile | ProMedicine";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}

              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Create {userRole === 'doctor' ? 'Doctor' : 'Patient'} Profile</h4>
                  <p className="text-muted mb-4">Please fill in your medical profile information below.</p>

                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md={6}>
                        <div className="form-group mb-3">
                          <Label className="form-label">Gender</Label>
                          <Input
                            name="gender"
                            type="select"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.gender || ""}
                            invalid={
                              validation.touched.gender && validation.errors.gender ? true : false
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Input>
                          {validation.touched.gender && validation.errors.gender ? (
                            <FormFeedback type="invalid">{validation.errors.gender}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group mb-3">
                          <Label className="form-label">Date of Birth</Label>
                          <Input
                            name="date_of_birth"
                            type="date"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.date_of_birth || ""}
                            invalid={
                              validation.touched.date_of_birth && validation.errors.date_of_birth ? true : false
                            }
                          />
                          {validation.touched.date_of_birth && validation.errors.date_of_birth ? (
                            <FormFeedback type="invalid">{validation.errors.date_of_birth}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <div className="form-group mb-3">
                          <Label className="form-label">Contact Address</Label>
                          <Input
                            name="contact_address"
                            type="text"
                            className="form-control"
                            placeholder="Enter Contact Address"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.contact_address || ""}
                            invalid={
                              validation.touched.contact_address && validation.errors.contact_address ? true : false
                            }
                          />
                          {validation.touched.contact_address && validation.errors.contact_address ? (
                            <FormFeedback type="invalid">{validation.errors.contact_address}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="form-group mb-3">
                          <Label className="form-label">Medicare Number</Label>
                          <Input
                            name="medicare_number"
                            type="text"
                            className="form-control"
                            placeholder="Enter Medicare Number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.medicare_number || ""}
                            invalid={
                              (validation.touched.medicare_number && validation.errors.medicare_number) || 
                              fieldErrors.medicare_number ? true : false
                            }
                          />
                          {validation.touched.medicare_number && validation.errors.medicare_number ? (
                            <FormFeedback type="invalid">{validation.errors.medicare_number}</FormFeedback>
                          ) : fieldErrors.medicare_number ? (
                            <FormFeedback type="invalid">{fieldErrors.medicare_number[0]}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group mb-3">
                          <Label className="form-label">Medicare Expiry Date</Label>
                          <Input
                            name="medicare_expiry"
                            type="date"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.medicare_expiry || ""}
                            invalid={
                              validation.touched.medicare_expiry && validation.errors.medicare_expiry ? true : false
                            }
                          />
                          {validation.touched.medicare_expiry && validation.errors.medicare_expiry ? (
                            <FormFeedback type="invalid">{validation.errors.medicare_expiry}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="form-group mb-3">
                          <Label className="form-label">IHI Number</Label>
                          <Input
                            name="ihi"
                            type="text"
                            className="form-control"
                            placeholder="Enter IHI Number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.ihi || ""}
                            invalid={
                              (validation.touched.ihi && validation.errors.ihi) || 
                              fieldErrors.ihi ? true : false
                            }
                          />
                          {validation.touched.ihi && validation.errors.ihi ? (
                            <FormFeedback type="invalid">{validation.errors.ihi}</FormFeedback>
                          ) : fieldErrors.ihi ? (
                            <FormFeedback type="invalid">{fieldErrors.ihi[0]}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button type="submit" color="primary">
                        Create Profile
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateProfile; 