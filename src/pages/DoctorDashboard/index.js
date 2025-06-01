import React, { useEffect } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorAuthWrapper from "../../Routes/DoctorAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getAppointments } from "../../slices/appointments/thunk";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  document.title = "Doctor Dashboard | Velzon - React Admin & Dashboard Template";

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const {appointments, error, loading} = useSelector((state) => state.Appointment);

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
