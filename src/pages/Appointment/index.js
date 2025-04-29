import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorScheduleTime from "./DoctorScheduleTime";
import DoctorAuthWrapper from '../../Routes/DoctorAuthWrapper';
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../slices/OrderAppointment/thunk";

const Appointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);

  document.title = "Appointment | Velzon - React Admin & Dashboard Template";

  const handleRedirect = () => {
    navigate("/dashboard/doctor/schedule-appointment");
  };
    useEffect(() => {
      dispatch(getOrders());
      setLoading(false);
    }, [dispatch]);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.OrderAppointment);

  return (
    <div className="page-content">
      <DoctorAuthWrapper>
        <Container fluid>
          <BreadCrumb title="Appointment" pageTitle="Pages" />

          <Row className="mt-4">
            <Col md={7}>
            <AppointmentTable orders={orders} loading={ordersLoading} error={ordersError}/>
            </Col>
            <Col md={5}>
              <Button color="primary" className="mt-3" onClick={handleRedirect}>
                Schedule Appointments Time
              </Button>
              <DoctorScheduleTime />
            </Col>
          </Row>
        </Container>
      </DoctorAuthWrapper>
    </div>
  );
};

export default Appointment;
