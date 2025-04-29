import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import DoctorAuthWrapper from '../../Routes/DoctorAuthWrapper';

const DashboardPatient = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DoctorAuthWrapper>
          <Container fluid>
            <Row>
              <Col>
                <div className="h-100">
                  <span>Doctor Dashboard</span>
                </div>
              </Col>
            </Row>
          </Container>
        </DoctorAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default DashboardPatient;
