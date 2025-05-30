import React from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import AdminAuthWrapper from "../../Routes/AdminAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../slices/OrderAppointment/thunk";
import { useEffect } from "react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  document.title = "Admin Dashboard | Velzon - React Admin & Dashboard Template";

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
        <AdminAuthWrapper>
          <Container fluid>
            <BreadCrumb title="Admin Dashboard" pageTitle="Dashboard" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">All Appointments</h4>
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
        </AdminAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default AdminDashboard;
