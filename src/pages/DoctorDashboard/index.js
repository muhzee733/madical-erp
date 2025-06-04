import React, { useEffect, useCallback } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorAuthWrapper from "../../Routes/DoctorAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getAppointments } from "../../slices/appointments/thunk";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  document.title = "Doctor Dashboard | Velzon - React Admin & Dashboard Template";

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
