import React, { useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Label,
  Input,
} from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../Components/Common/BreadCrumb";
import Cookies from 'js-cookie';

const EcommerceCheckout = () => {
  
  const token = Cookies.get('authUser');
  const [isProcessing, setIsProcessing] = useState(false);
  const { items = [], isLoading } = useSelector((state) => state.Cart || {});
  const location = useLocation();
  const { appointmentId } = location.state || {};

  document.title = "Checkout | ProMedicine";

  if (!appointmentId) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">Invalid Checkout Session</h4>
        <p>Please refresh you browser or login again. Thanks for your patient</p>
      </Container>
    );
  }
  

  const handleCompleteOrder = async () => {
    try {
      setIsProcessing(true);
      const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}/create_order/`, {
        appointmentId: appointmentId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(orderResponse, 'orderResponse')
      const { orderId } = orderResponse;
      const stripeResponse = await axios.post(`${process.env.REACT_APP_API_URL}/create-stripe-session/`, {
        orderId: orderId,
      });
      console.log(stripeResponse, 'stripeResponse')

      const { checkout_url } = stripeResponse;
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Something went wrong. Please try again!");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading cart items...</p>
        </div>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Checkout" pageTitle="Dashboard" />

          <Row>
            {/* Payment Section */}
            <Col xl="8">
              <Card>
                <CardBody>
                  <Form>
                    <h5 className="mb-3">Payment Selection</h5>
                    <Row className="g-4">
                      <Col lg={4} sm={6}>
                        <div className="form-check card-radio">
                          <Input
                            id="paymentMethod01"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                          />
                          <Label className="form-check-label" htmlFor="paymentMethod01">
                            <span className="fs-16 text-muted me-2">
                              <i className="ri-paypal-fill align-bottom"></i>
                            </span>
                            <span className="fs-14">Paypal (Coming Soon)</span>
                          </Label>
                        </div>
                      </Col>

                      <Col lg={4} sm={6}>
                        <div className="form-check card-radio">
                          <Input
                            id="paymentMethod02"
                            name="paymentMethod"
                            type="radio"
                            className="form-check-input"
                            defaultChecked
                          />
                          <Label className="form-check-label" htmlFor="paymentMethod02">
                            <span className="fs-16 text-muted me-2">
                              <i className="ri-bank-card-fill align-bottom"></i>
                            </span>
                            <span className="fs-14">Credit / Debit Card</span>
                          </Label>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex align-items-center gap-3 mt-4">
                      <button
                        type="button"
                        className="btn btn-primary ms-auto"
                        onClick={handleCompleteOrder}
                        disabled={isProcessing || items.length === 0}
                      >
                        {isProcessing ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <i className="ri-shopping-basket-line label-icon align-middle fs-16 ms-2"></i>
                        )}
                        {isProcessing ? "Processing..." : "Complete Order"}
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            {/* Order Summary Section */}
            <Col xl="4">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Appointment Summary</h5>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless align-middle mb-0">
                      <tbody>
                        {items?.length > 0 ? (
                          items.map((product, key) => (
                            <tr key={key}>
                              <td>
                                <h5 className="fs-14">Schedule Date: {product.date}</h5>
                                <p className="text-muted mb-0">
                                  Schedule Time: {product.start_time} - {product.end_time}
                                </p>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center">
                              No items in cart
                            </td>
                          </tr>
                        )}

                        <tr className="table-active">
                          <th>Total (USD):</th>
                          <td className="text-end fw-semibold">
                            $
                            {items
                              .reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCheckout;
