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
  Spinner,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      qualification: '',
      specialty: '',
      medical_registration_number: '',
      prescriber_number: '',
      provider_number: '',
      hpi_i: ''
    },
    validationSchema: Yup.object({
      gender: Yup.string().required("Please select your gender"),
      date_of_birth: Yup.date().required("Please enter your date of birth"),
      contact_address: Yup.string().required("Please enter your contact address"),
      medicare_number: Yup.string().required("Please enter your medicare number"),
      medicare_expiry: Yup.date().required("Please enter medicare expiry date"),
      ihi: Yup.string().required("Please enter your IHI number"),
      qualification: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your qualification")
      }),
      specialty: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your specialty")
      }),
      medical_registration_number: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your medical registration number")
      }),
      prescriber_number: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your prescriber number")
      }),
      provider_number: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your provider number")
      }),
      hpi_i: Yup.string().when('userRole', {
        is: 'doctor',
        then: Yup.string().required("Please enter your HPI-I number")
      })
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError("");
        setSuccess("");
        setFieldErrors({});

        let response;
        if (userRole === "doctor") {
          response = await dispatch(createDoctorProfile(values));
        } else {
          response = await dispatch(createPatientProfile(values));
        }

        if (response) {
          setSuccess("Profile created successfully! Redirecting...");
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
      } finally {
        setIsSubmitting(false);
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
              {error && (
                <Alert color="danger" className="mb-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-error-warning-line me-2 fs-4"></i>
                    <div>
                      <h5 className="mb-1">Error</h5>
                      <p className="mb-0">{error}</p>
                    </div>
                  </div>
                </Alert>
              )}
              {success && (
                <Alert color="success" className="mb-4">
                  <div className="d-flex align-items-center">
                    <i className="ri-checkbox-circle-line me-2 fs-4"></i>
                    <div>
                      <h5 className="mb-1">Success</h5>
                      <p className="mb-0">{success}</p>
                    </div>
                  </div>
                </Alert>
              )}

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
                            invalid={validation.touched.gender && validation.errors.gender ? true : false}
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
                            invalid={validation.touched.date_of_birth && validation.errors.date_of_birth ? true : false}
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

                    {userRole === 'doctor' && (
                      <>
                        <Row>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">Qualification</Label>
                              <Input
                                name="qualification"
                                type="text"
                                className="form-control"
                                placeholder="Enter your qualification (e.g., MBBS)"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.qualification || ""}
                                invalid={
                                  (validation.touched.qualification && validation.errors.qualification) || 
                                  fieldErrors.qualification ? true : false
                                }
                              />
                              {validation.touched.qualification && validation.errors.qualification ? (
                                <FormFeedback type="invalid">{validation.errors.qualification}</FormFeedback>
                              ) : fieldErrors.qualification ? (
                                <FormFeedback type="invalid">{fieldErrors.qualification[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">Specialty</Label>
                              <Input
                                name="specialty"
                                type="text"
                                className="form-control"
                                placeholder="Enter your specialty"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.specialty || ""}
                                invalid={
                                  (validation.touched.specialty && validation.errors.specialty) || 
                                  fieldErrors.specialty ? true : false
                                }
                              />
                              {validation.touched.specialty && validation.errors.specialty ? (
                                <FormFeedback type="invalid">{validation.errors.specialty}</FormFeedback>
                              ) : fieldErrors.specialty ? (
                                <FormFeedback type="invalid">{fieldErrors.specialty[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">Medical Registration Number</Label>
                              <Input
                                name="medical_registration_number"
                                type="text"
                                className="form-control"
                                placeholder="Enter your medical registration number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.medical_registration_number || ""}
                                invalid={
                                  (validation.touched.medical_registration_number && validation.errors.medical_registration_number) || 
                                  fieldErrors.medical_registration_number ? true : false
                                }
                              />
                              {validation.touched.medical_registration_number && validation.errors.medical_registration_number ? (
                                <FormFeedback type="invalid">{validation.errors.medical_registration_number}</FormFeedback>
                              ) : fieldErrors.medical_registration_number ? (
                                <FormFeedback type="invalid">{fieldErrors.medical_registration_number[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">Prescriber Number</Label>
                              <Input
                                name="prescriber_number"
                                type="text"
                                className="form-control"
                                placeholder="Enter your prescriber number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.prescriber_number || ""}
                                invalid={
                                  (validation.touched.prescriber_number && validation.errors.prescriber_number) || 
                                  fieldErrors.prescriber_number ? true : false
                                }
                              />
                              {validation.touched.prescriber_number && validation.errors.prescriber_number ? (
                                <FormFeedback type="invalid">{validation.errors.prescriber_number}</FormFeedback>
                              ) : fieldErrors.prescriber_number ? (
                                <FormFeedback type="invalid">{fieldErrors.prescriber_number[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">Provider Number</Label>
                              <Input
                                name="provider_number"
                                type="text"
                                className="form-control"
                                placeholder="Enter your provider number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.provider_number || ""}
                                invalid={
                                  (validation.touched.provider_number && validation.errors.provider_number) || 
                                  fieldErrors.provider_number ? true : false
                                }
                              />
                              {validation.touched.provider_number && validation.errors.provider_number ? (
                                <FormFeedback type="invalid">{validation.errors.provider_number}</FormFeedback>
                              ) : fieldErrors.provider_number ? (
                                <FormFeedback type="invalid">{fieldErrors.provider_number[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group mb-3">
                              <Label className="form-label">HPI-I Number</Label>
                              <Input
                                name="hpi_i"
                                type="text"
                                className="form-control"
                                placeholder="Enter your HPI-I number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.hpi_i || ""}
                                invalid={
                                  (validation.touched.hpi_i && validation.errors.hpi_i) || 
                                  fieldErrors.hpi_i ? true : false
                                }
                              />
                              {validation.touched.hpi_i && validation.errors.hpi_i ? (
                                <FormFeedback type="invalid">{validation.errors.hpi_i}</FormFeedback>
                              ) : fieldErrors.hpi_i ? (
                                <FormFeedback type="invalid">{fieldErrors.hpi_i[0]}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}

                    <div className="text-center mt-4">
                      <Button 
                        type="submit" 
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creating Profile...
                          </>
                        ) : (
                          "Create Profile"
                        )}
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