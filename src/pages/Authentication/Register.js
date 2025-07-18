import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Spinner,
  Button,
} from "reactstrap";
import CryptoJS from "crypto-js";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { registerUser, apiError, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images
import logoLight from "../../assets/images/pro-logo-2.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const Register = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  // Registration type toggle
  const [registerType, setRegisterType] = useState("patient");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      fname: "",
      lname: "",
      password: "",
      phone: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      fname: Yup.string().required("Please Enter Your First Name"),
      lname: Yup.string().required("Please Enter Your Last Name"),
      phone: Yup.string()
        .matches(/^(?:\+?61|0)4\d{8}$/, "Enter valid Australian phone number")
        .required("Please Enter Your Phone Number"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(6, "Password must be at least 6 characters long"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Confirm Password doesn't match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      const payload = {
        role: registerType,
        phone_number: values.phone,
        email: values.email,
        first_name: values.fname,
        last_name: values.lname,
        password: values.password,
      };
      dispatch(registerUser(payload, navigator));
    },
  });

  const selectLayoutState = (state) => state.Account;
  const registerData = createSelector(selectLayoutState, (accountState) => ({
    registrationError: accountState.registrationError,
    success: accountState.success,
    error: accountState.error,
    loading: accountState.loading,
  }));

  // Inside your component
  const { registrationError, success, error, loading } =
    useSelector(registerData);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigator("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, navigator]);

  document.title = "Register | ProMedicine";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="30" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">
                        {registerType === "doctor" ? "Doctor Registration" : "Patient Registration"}
                      </h5>
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-3 mb-4">
                      <Button
                        color={registerType === "patient" ? "primary" : "secondary"}
                        onClick={() => setRegisterType("patient")}
                        outline={registerType !== "patient"}
                      >
                        Patient Register
                      </Button>
                      <Button
                        color={registerType === "doctor" ? "primary" : "secondary"}
                        onClick={() => setRegisterType("doctor")}
                        outline={registerType !== "doctor"}
                      >
                        Doctor Register
                      </Button>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: "bg-success text-white",
                              progress: undefined,
                              toastId: "",
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Register User Successfully and Your Redirect To
                              Login Page...
                            </Alert>
                          </>
                        ) : null}

                        {registrationError ? (
                          <Alert color="danger">
                            <div>{registrationError}</div>
                          </Alert>
                        ) : null}

                        <div className="mb-3">
                          <Label htmlFor="fname" className="form-label">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="fname"
                            name="fname"
                            className="form-control"
                            placeholder="Enter your first name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.fname || ""}
                            invalid={
                              validation.touched.fname &&
                              validation.errors.fname
                                ? true
                                : false
                            }
                          />
                          {validation.touched.fname &&
                            validation.errors.fname && (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.fname}</div>
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="lname" className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="lname"
                            name="lname"
                            className="form-control"
                            placeholder="Enter your last name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lname || ""}
                            invalid={
                              validation.touched.lname &&
                              validation.errors.lname
                                ? true
                                : false
                            }
                          />
                          {validation.touched.lname &&
                            validation.errors.lname && (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.lname}</div>
                              </FormFeedback>
                            )}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email address"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="phone" className="form-label">
                            Phone Number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="e.g. 0412345678 or +61412345678"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={
                              validation.touched.phone &&
                              validation.errors.phone
                                ? true
                                : false
                            }
                          />
                          {validation.touched.phone &&
                          validation.errors.phone ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.phone}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.confirm_password &&
                          validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.confirm_password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Signing Up...
                              </>
                            ) : (
                              "Sign Up"
                            )}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{" "}
                    <Link
                      to="/login"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Signin{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
