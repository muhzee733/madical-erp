import React, { useEffect, useCallback } from "react";
import { Col, Container, Row, Card, CardBody, Spinner } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorAuthWrapper from "../../Routes/DoctorAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getAppointments } from "../../slices/appointments/thunk";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  document.title = "Doctor Dashboard | ProMedicine";

  const { appointments, error, loading, lastUpdated } = useSelector((state) => state.Appointment);

  const fetchAppointments = useCallback(() => {
    // Only fetch if data is older than 5 minutes or doesn't exist
    const shouldFetch = !lastUpdated || (Date.now() - lastUpdated > 5 * 60 * 1000);
    if (shouldFetch) {
      dispatch(getAppointments());
    }
  }, [dispatch, lastUpdated]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="text-center">
              <Spinner color="primary" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
              <h4>Loading Dashboard...</h4>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <DoctorAuthWrapper>
          <Container fluid>
            <BreadCrumb title="Doctor Dashboard" pageTitle="Dashboard" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Appointments</h4>
                    <AppointmentTable 
                      appointments={appointments} 
                      loading={loading} 
                      error={error}
                      onRefresh={fetchAppointments}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </DoctorAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default DoctorDashboard;
