// UserProfile.jsx
import React, { useState, useEffect } from "react";
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

  // local UI state
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // redux selector
  const selectProfile = (state) => state.Profile;
  const { user, success, error } = useSelector(
    createSelector(selectProfile, (p) => ({
      user: p.user,
      success: p.success,
      error: p.error,
    }))
  );

  // Get user role from cookies
  useEffect(() => {
    const userData = cookies.get('user');
    if (userData) {
      setUserRole(userData.role);
    }
  }, [cookies]);

  // Fetch profile on mount based on role
  useEffect(() => {
    if (userRole) {
      setLoading(true);
      if (userRole === 'patient') {
        dispatch(getPatientProfile())
          .finally(() => setLoading(false));
      } else if (userRole === 'doctor') {
        dispatch(getDoctorProfile())
          .finally(() => setLoading(false));
      }
    }
  }, [dispatch, userRole]);

  // Sync local state when redux profile arrives
  useEffect(() => {
    if (!isEmpty(user)) {
      setProfileData(user);
    }
  }, [user]);

  // Auto-clear alerts
  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(resetProfileFlag()), 3000);
      return () => clearTimeout(t);
    }
  }, [success, error, dispatch]);

  // Formik setup
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: profileData?.id || "",
      user: profileData?.user || "",
      gender: profileData?.gender || "",
      date_of_birth: profileData?.date_of_birth || "",
      contact_address: profileData?.contact_address || "",
      medicare_number: profileData?.medicare_number || "",
      medicare_expiry: profileData?.medicare_expiry || "",
      ihi: profileData?.ihi || "",
      created_by: profileData?.created_by || "",
      updated_by: profileData?.updated_by || "",
    },
    validationSchema: Yup.object({
      gender: Yup.string().required("Gender is required"),
      date_of_birth: Yup.string().required("Date of Birth is required"),
      contact_address: Yup.string().required("Contact Address is required"),
      medicare_number: Yup.string().required("Medicare Number is required"),
      medicare_expiry: Yup.string().required("Medicare Expiry is required"),
      ihi: Yup.string().required("IHI Number is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      dispatch(editProfile(values)).finally(() => setLoading(false));
    },
  });

  document.title = "Profile | ProMedicine";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">Profile Updated Successfully</Alert>}
            </Col>
          </Row>

          <h4 className="card-title mb-4">
            {userRole === 'doctor' ? 'Doctor' : 'Patient'} Profile Information
          </h4>

          <Card>
            <CardBody>
              {!profileData || loading ? (
                <div className="text-center">
                  <Spinner color="primary" />
                  <span className="ms-2">Loading profile information...</span>
                </div>
              ) : (
                <>
                  <Row>
                    <Col md={6}>
                      <h5 className="font-size-14 mb-3">Personal Information</h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Gender :</th>
                            <td>{profileData.gender || "Not specified"}</td>
                          </tr>
                          <tr>
                            <th>Date of Birth :</th>
                            <td>
                              {profileData.date_of_birth
                                ? new Date(profileData.date_of_birth).toLocaleDateString()
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Contact Address :</th>
                            <td>{profileData.contact_address || "Not specified"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col md={6}>
                      <h5 className="font-size-14 mb-3">Medical Information</h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Medicare Number :</th>
                            <td>{profileData.medicare_number || "Not specified"}</td>
                          </tr>
                          <tr>
                            <th>Medicare Expiry :</th>
                            <td>
                              {profileData.medicare_expiry
                                ? new Date(profileData.medicare_expiry).toLocaleDateString()
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>IHI Number :</th>
                            <td>{profileData.ihi || "Not specified"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>

                  <h5 className="font-size-14 mb-3 mt-4">Update Profile Information</h5>
                  <Form onSubmit={validation.handleSubmit}>
                    {/* Gender / DOB */}
                    <Row>
                      <Col md={6}>
                        <Label>Gender</Label>
                        <Input
                          name="gender"
                          type="select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.gender}
                          invalid={validation.touched.gender && !!validation.errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Input>
                        {validation.touched.gender && validation.errors.gender && (
                          <FormFeedback>{validation.errors.gender}</FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label>Date of Birth</Label>
                        <Input
                          name="date_of_birth"
                          type="date"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.date_of_birth}
                          invalid={validation.touched.date_of_birth && !!validation.errors.date_of_birth}
                        />
                        {validation.touched.date_of_birth && validation.errors.date_of_birth && (
                          <FormFeedback>{validation.errors.date_of_birth}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {/* Contact Address */}
                    <Row className="mt-3">
                      <Col md={12}>
                        <Label>Contact Address</Label>
                        <Input
                          name="contact_address"
                          type="text"
                          placeholder="Enter Contact Address"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.contact_address}
                          invalid={validation.touched.contact_address && !!validation.errors.contact_address}
                        />
                        {validation.touched.contact_address && validation.errors.contact_address && (
                          <FormFeedback>{validation.errors.contact_address}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {/* Medicare / IHI */}
                    <Row className="mt-3">
                      <Col md={6}>
                        <Label>Medicare Number</Label>
                        <Input
                          name="medicare_number"
                          type="text"
                          placeholder="Enter Medicare Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.medicare_number}
                          invalid={validation.touched.medicare_number && !!validation.errors.medicare_number}
                        />
                        {validation.touched.medicare_number && validation.errors.medicare_number && (
                          <FormFeedback>{validation.errors.medicare_number}</FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label>Medicare Expiry Date</Label>
                        <Input
                          name="medicare_expiry"
                          type="date"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.medicare_expiry}
                          invalid={validation.touched.medicare_expiry && !!validation.errors.medicare_expiry}
                        />
                        {validation.touched.medicare_expiry && validation.errors.medicare_expiry && (
                          <FormFeedback>{validation.errors.medicare_expiry}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <Label>IHI Number</Label>
                        <Input
                          name="ihi"
                          type="text"
                          placeholder="Enter IHI Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.ihi}
                          invalid={validation.touched.ihi && !!validation.errors.ihi}
                        />
                        {validation.touched.ihi && validation.errors.ihi && (
                          <FormFeedback>{validation.errors.ihi}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {/* Hidden fields */}
                    {["id", "user", "created_by", "updated_by"].map((f) => (
                      <Input key={f} type="hidden" name={f} value={validation.values[f] || ""} />
                    ))}

                    <div className="text-center mt-4">
                      <Button type="submit" color="danger" disabled={loading}>
                        {loading ? (
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
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
