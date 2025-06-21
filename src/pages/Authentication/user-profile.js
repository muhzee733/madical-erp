// UserProfile.jsx
import React, { useEffect } from "react";
import { isEmpty } from "lodash";
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
import * as Yup from "yup";
import { useFormik } from "formik";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";

import {
  getPatientProfile,
  getDoctorProfile,
  editProfile,
  resetProfileFlag,
} from "../../slices/thunks";
import { createSelector } from "reselect";

const UserProfile = () => {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  // Redux selector
  const selectProfile = (state) => state.Profile;
  const {
    user,
    success: reduxSuccess,
    error: reduxError,
    loading: reduxLoading,
  } = useSelector(
    createSelector(selectProfile, (p) => ({
      user: p.user,
      success: p.success,
      error: p.error,
      loading: p.loading,
    }))
  );

  // Get userRole from cookies (not local state)
  const userRole = cookies.get("user")?.role || null;

  // Fetch profile on mount based on role
  useEffect(() => {
    if (userRole) {
      if (userRole === "patient") {
        dispatch(getPatientProfile());
      } else if (userRole === "doctor") {
        dispatch(getDoctorProfile());
      }
    }
    // eslint-disable-next-line
  }, [dispatch, userRole]);

  // Auto-clear alerts
  useEffect(() => {
    if (reduxSuccess || reduxError) {
      const t = setTimeout(() => dispatch(resetProfileFlag()), 3000);
      return () => clearTimeout(t);
    }
  }, [reduxSuccess, reduxError, dispatch]);

  // Formik setup
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user?.id || "",
      user: user?.user || "",
      gender: user?.gender || "",
      date_of_birth: user?.date_of_birth || "",
      contact_address: user?.contact_address || "",
      medicare_number: user?.medicare_number || "",
      medicare_expiry: user?.medicare_expiry || "",
      ihi: user?.ihi || "",
      // Doctor specific fields
      qualification: user?.qualification || "",
      specialty: user?.specialty || "",
      medical_registration_number: user?.medical_registration_number || "",
      registration_expiry: user?.registration_expiry || "",
      prescriber_number: user?.prescriber_number || "",
      provider_number: user?.provider_number || "",
      hpi_i: user?.hpi_i || "",
      digital_signature: user?.digital_signature || null,
      created_by: user?.created_by || "",
      updated_by: user?.updated_by || "",
    },
    validationSchema: Yup.object({
      gender: Yup.string().required("Gender is required"),
      date_of_birth: Yup.string().required("Date of Birth is required"),
      contact_address: Yup.string().required("Contact Address is required"),
      medicare_number: Yup.string().when("userRole", {
        is: "patient",
        then: Yup.string().required("Medicare Number is required"),
      }),
      medicare_expiry: Yup.string().when("userRole", {
        is: "patient",
        then: Yup.string().required("Medicare Expiry is required"),
      }),
      ihi: Yup.string().when("userRole", {
        is: "patient",
        then: Yup.string().required("IHI Number is required"),
      }),
      // Doctor specific validations
      qualification: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Qualification is required"),
      }),
      specialty: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Specialty is required"),
      }),
      medical_registration_number: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Medical Registration Number is required"),
      }),
      registration_expiry: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Registration Expiry is required"),
      }),
      prescriber_number: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Prescriber Number is required"),
      }),
      provider_number: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("Provider Number is required"),
      }),
      hpi_i: Yup.string().when("userRole", {
        is: "doctor",
        then: Yup.string().required("HPI-I Number is required"),
      }),
    }),
    onSubmit: async (values) => {
      // Only include fields relevant to the user's role
      const updateData = {
        id: values.id,
        user: values.user,
        gender: values.gender,
        date_of_birth: values.date_of_birth,
        contact_address: values.contact_address,
      };
      if (userRole === "patient") {
        Object.assign(updateData, {
          medicare_number: values.medicare_number,
          medicare_expiry: values.medicare_expiry,
          ihi: values.ihi,
        });
      } else if (userRole === "doctor") {
        Object.assign(updateData, {
          qualification: values.qualification,
          specialty: values.specialty,
          medical_registration_number: values.medical_registration_number,
          registration_expiry: values.registration_expiry,
          prescriber_number: values.prescriber_number,
          provider_number: values.provider_number,
          hpi_i: values.hpi_i,
        });
      }
      dispatch(editProfile(updateData)).then(() => {
        if (userRole === "patient") {
          dispatch(getPatientProfile());
        } else {
          dispatch(getDoctorProfile());
        }
      });
    },
  });

  document.title = "Profile | ProMedicine";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {reduxLoading && (
            <Row>
              <Col lg="12">
                <div className="text-center my-4">
                  <Spinner color="primary" />
                  <span className="ms-2">Loading profile information...</span>
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Col lg="12">
              {reduxError && (
                <Alert color="danger">
                  <div className="text-center">
                    <h5 className="mb-3">{reduxError}</h5>
                    <Button
                      color="primary"
                      onClick={() =>
                        (window.location.href = "/dashboard/create-profile")
                      }
                    >
                      Create Profile
                    </Button>
                  </div>
                </Alert>
              )}
              {reduxSuccess && (
                <Alert color="success">{reduxSuccess}</Alert>
              )}
            </Col>
          </Row>

          <h4 className="card-title mb-4">
            {userRole === "doctor" ? "Doctor" : "Patient"} Profile Information
          </h4>

          <Card>
            <CardBody>
              <>
                <Row>
                  <Col md={6}>
                    <h5 className="font-size-14 mb-3">Personal Information</h5>
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Gender :</th>
                          <td>{user?.gender || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Date of Birth :</th>
                          <td>
                            {user?.date_of_birth
                              ? new Date(user.date_of_birth).toLocaleDateString()
                              : "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <th>Contact Address :</th>
                          <td>
                            {user?.contact_address || "Not specified"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  {userRole === "patient" ? (
                    <Col md={6}>
                      <h5 className="font-size-14 mb-3">Medical Information</h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Medicare Number :</th>
                            <td>
                              {user?.medicare_number || "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Medicare Expiry :</th>
                            <td>
                              {user?.medicare_expiry
                                ? new Date(user.medicare_expiry).toLocaleDateString()
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>IHI Number :</th>
                            <td>{user?.ihi || "Not specified"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  ) : (
                    <Col md={6}>
                      <h5 className="font-size-14 mb-3">Doctor Information</h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Qualification :</th>
                            <td>
                              {user?.qualification || "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Specialty :</th>
                            <td>{user?.specialty || "Not specified"}</td>
                          </tr>
                          <tr>
                            <th>Medical Registration Number :</th>
                            <td>
                              {user?.medical_registration_number ||
                                "Not specified"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  )}
                </Row>

                {userRole === "doctor" && (
                  <Row className="mt-4">
                    <Col md={12}>
                      <h5 className="font-size-14 mb-3">
                        Additional Doctor Information
                      </h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Registration Expiry :</th>
                            <td>
                              {user?.registration_expiry
                                ? new Date(user.registration_expiry).toLocaleDateString()
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Prescriber Number :</th>
                            <td>
                              {user?.prescriber_number || "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Provider Number :</th>
                            <td>
                              {user?.provider_number || "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>HPI-I Number :</th>
                            <td>{user?.hpi_i || "Not specified"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                )}

                <h5 className="font-size-14 mb-3 mt-4">
                  Update Profile Information
                </h5>
                <Form onSubmit={validation.handleSubmit}>
                  {/* Personal Information */}
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label>Gender</Label>
                        <Input
                          name="gender"
                          type="select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.gender}
                          invalid={
                            validation.touched.gender &&
                            !!validation.errors.gender
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Input>
                        {validation.touched.gender &&
                          validation.errors.gender && (
                            <FormFeedback>
                              {validation.errors.gender}
                            </FormFeedback>
                          )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label>Date of Birth</Label>
                        <Input
                          name="date_of_birth"
                          type="date"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.date_of_birth}
                          invalid={
                            validation.touched.date_of_birth &&
                            !!validation.errors.date_of_birth
                          }
                        />
                        {validation.touched.date_of_birth &&
                          validation.errors.date_of_birth && (
                            <FormFeedback>
                              {validation.errors.date_of_birth}
                            </FormFeedback>
                          )}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <div className="mb-3">
                        <Label>Contact Address</Label>
                        <Input
                          name="contact_address"
                          type="text"
                          placeholder="Enter Contact Address"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.contact_address}
                          invalid={
                            validation.touched.contact_address &&
                            !!validation.errors.contact_address
                          }
                        />
                        {validation.touched.contact_address &&
                          validation.errors.contact_address && (
                            <FormFeedback>
                              {validation.errors.contact_address}
                            </FormFeedback>
                          )}
                      </div>
                    </Col>
                  </Row>

                  {/* Medical Information for Patients */}
                  {userRole === "patient" && (
                    <>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Medicare Number</Label>
                            <Input
                              name="medicare_number"
                              type="text"
                              placeholder="Enter Medicare Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.medicare_number}
                              invalid={
                                validation.touched.medicare_number &&
                                !!validation.errors.medicare_number
                              }
                            />
                            {validation.touched.medicare_number &&
                              validation.errors.medicare_number && (
                                <FormFeedback>
                                  {validation.errors.medicare_number}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Medicare Expiry</Label>
                            <Input
                              name="medicare_expiry"
                              type="date"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.medicare_expiry}
                              invalid={
                                validation.touched.medicare_expiry &&
                                !!validation.errors.medicare_expiry
                              }
                            />
                            {validation.touched.medicare_expiry &&
                              validation.errors.medicare_expiry && (
                                <FormFeedback>
                                  {validation.errors.medicare_expiry}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>IHI Number</Label>
                            <Input
                              name="ihi"
                              type="text"
                              placeholder="Enter IHI Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.ihi}
                              invalid={
                                validation.touched.ihi &&
                                !!validation.errors.ihi
                              }
                            />
                            {validation.touched.ihi &&
                              validation.errors.ihi && (
                                <FormFeedback>
                                  {validation.errors.ihi}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Doctor Specific Fields */}
                  {userRole === "doctor" && (
                    <>
                      <h5 className="font-size-14 mb-3 mt-4">
                        Update Doctor Information
                      </h5>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Qualification</Label>
                            <Input
                              name="qualification"
                              type="text"
                              placeholder="Enter Qualification"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.qualification}
                              invalid={
                                validation.touched.qualification &&
                                !!validation.errors.qualification
                              }
                            />
                            {validation.touched.qualification &&
                              validation.errors.qualification && (
                                <FormFeedback>
                                  {validation.errors.qualification}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Specialty</Label>
                            <Input
                              name="specialty"
                              type="text"
                              placeholder="Enter Specialty"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.specialty}
                              invalid={
                                validation.touched.specialty &&
                                !!validation.errors.specialty
                              }
                            />
                            {validation.touched.specialty &&
                              validation.errors.specialty && (
                                <FormFeedback>
                                  {validation.errors.specialty}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Medical Registration Number</Label>
                            <Input
                              name="medical_registration_number"
                              type="text"
                              placeholder="Enter Medical Registration Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.medical_registration_number}
                              invalid={
                                validation.touched
                                  .medical_registration_number &&
                                !!validation.errors.medical_registration_number
                              }
                            />
                            {validation.touched.medical_registration_number &&
                              validation.errors.medical_registration_number && (
                                <FormFeedback>
                                  {
                                    validation.errors
                                      .medical_registration_number
                                  }
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Registration Expiry</Label>
                            <Input
                              name="registration_expiry"
                              type="date"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.registration_expiry}
                              invalid={
                                validation.touched.registration_expiry &&
                                !!validation.errors.registration_expiry
                              }
                            />
                            {validation.touched.registration_expiry &&
                              validation.errors.registration_expiry && (
                                <FormFeedback>
                                  {validation.errors.registration_expiry}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Prescriber Number</Label>
                            <Input
                              name="prescriber_number"
                              type="text"
                              placeholder="Enter Prescriber Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.prescriber_number}
                              invalid={
                                validation.touched.prescriber_number &&
                                !!validation.errors.prescriber_number
                              }
                            />
                            {validation.touched.prescriber_number &&
                              validation.errors.prescriber_number && (
                                <FormFeedback>
                                  {validation.errors.prescriber_number}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Provider Number</Label>
                            <Input
                              name="provider_number"
                              type="text"
                              placeholder="Enter Provider Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.provider_number}
                              invalid={
                                validation.touched.provider_number &&
                                !!validation.errors.provider_number
                              }
                            />
                            {validation.touched.provider_number &&
                              validation.errors.provider_number && (
                                <FormFeedback>
                                  {validation.errors.provider_number}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>HPI-I Number</Label>
                            <Input
                              name="hpi_i"
                              type="text"
                              placeholder="Enter HPI-I Number"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.hpi_i}
                              invalid={
                                validation.touched.hpi_i &&
                                !!validation.errors.hpi_i
                              }
                            />
                            {validation.touched.hpi_i &&
                              validation.errors.hpi_i && (
                                <FormFeedback>
                                  {validation.errors.hpi_i}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Hidden fields */}
                  {["id", "user", "created_by", "updated_by"].map((f) => (
                    <Input
                      key={f}
                      type="hidden"
                      name={f}
                      value={validation.values[f] || ""}
                    />
                  ))}

                  <div className="text-center mt-4">
                    <Button type="submit" color="danger" disabled={reduxLoading}>
                      {reduxLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </div>
                </Form>
              </>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
