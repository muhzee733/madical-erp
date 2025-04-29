import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Row, Col, Button, Table, Spinner } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get query param
  const getPaymentId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("paymentId");
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const paymentId = getPaymentId();
        const res = await axios.get(`/api/payment/${paymentId}`);
        setPaymentData(res.data);
      } catch (error) {
        console.error("Failed to fetch payment data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!paymentData) {
    return <div className="text-center mt-5">Payment data not found.</div>;
  }

  return (
    <div className="page-content">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <CardBody>
                <div className="mb-4">
                  <div className="avatar-lg mx-auto">
                    <div className="avatar-title bg-light text-primary rounded-circle fs-36">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                  </div>
                </div>

                <h4 className="text-success">Payment Success</h4>
                <p className="text-muted mb-4">Total Payment</p>
                <h2 className="mb-4">${paymentData.amount}</h2>

                <div className="table-responsive mb-4">
                  <Table className="table-borderless mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Payment Summary</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.details.map((item, index) => (
                        <tr key={index}>
                          <td>{item.title}</td>
                          <td>${item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="text-start mb-4">
                  <h5>Bill to</h5>
                  <p className="mb-1">
                    <strong>Name:</strong> {paymentData.name}
                  </p>
                  <p className="mb-1">
                    <strong>Address:</strong> {paymentData.address}
                  </p>
                  <p className="mb-0">
                    <strong>Contact No:</strong> {paymentData.contact}
                  </p>
                </div>

                <div className="d-flex justify-content-center gap-2">
                  <Button color="primary" onClick={handleBackToDashboard}>
                    Back to Dashboard
                  </Button>
                  <Button color="light" onClick={handlePrintReceipt}>
                    Print Receipt
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Success;
