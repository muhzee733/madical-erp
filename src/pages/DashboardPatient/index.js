import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Section from "./Section";
import PatientAuthWrapper from "../../Routes/PatientAuthWrapper";
import MiniAppointment from "./MiniAppointment";

const DashboardPatient = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => setRightColumn(!rightColumn);

  return (
    <React.Fragment>
      <div className="page-content">
        <PatientAuthWrapper>
          <Container fluid>
            <Row>
              <Col>
                <div className="h-100">
                  <Section rightClickBtn={toggleRightColumn} />
                  <MiniAppointment />
                </div>
              </Col>
            </Row>
          </Container>
        </PatientAuthWrapper>
      </div>
    </React.Fragment>
  );
};

export default DashboardPatient;
