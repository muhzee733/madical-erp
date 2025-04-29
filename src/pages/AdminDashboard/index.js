import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import AdminAuthWrapper from '../../Routes/AdminAuthWrapper';

const DashboardPatient = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
  console.log('dashboard')

  return (
    <React.Fragment>
      <div className="page-content">
        <AdminAuthWrapper>
          <Container fluid>
            <Row>
              <Col>
                <div className="h-100">
                  <span>Admin Dashboard</span>
                </div>
              </Col>
            </Row>
          </Container>
        </AdminAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default DashboardPatient;
