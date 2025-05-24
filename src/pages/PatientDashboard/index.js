import React from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import PatientAuthWrapper from "../../Routes/PatientAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../slices/OrderAppointment/thunk";
import { useEffect } from "react";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  document.title = "Patient Dashboard | Velzon - React Admin & Dashboard Template";

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.OrderAppointment);

  return (
    <React.Fragment>
      <div className="page-content">
        <PatientAuthWrapper>
          <Container fluid>
            <BreadCrumb title="Patient Dashboard" pageTitle="Dashboard" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">My Appointments</h4>
                    <AppointmentTable 
                      orders={orders} 
                      loading={ordersLoading} 
                      error={ordersError}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </PatientAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default PatientDashboard; 