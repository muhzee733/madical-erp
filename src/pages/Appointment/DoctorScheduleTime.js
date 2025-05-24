import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Spinner } from "reactstrap";
import Cookies from "js-cookie";
import axios from "axios";

const DoctorScheduleTime = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      const userAuthToken = Cookies.get("authUser");

      if (!userAuthToken) {
        console.error("User is not authenticated.");
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/availabilities/list/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userAuthToken}`,
          },
        });
        if (response.success) {
          setSchedules(response.appointments);
        } else {
          console.error("Failed to fetch schedules");
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <React.Fragment>
      <Col xl={12}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Doctor Schedule Time</h4>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              {loading ? (
                // Loader when data is loading
                <div className="d-flex justify-content-center">
                  <Spinner color="primary" />
                </div>
              ) : schedules.length === 0 ? (
                // Message if no schedules are found
                <div className="d-flex justify-content-center">
                  <p>No Schedule Appointment Available</p>
                </div>
              ) : (
                <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                  <thead className="text-muted table-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Date</th>
                      <th scope="col">Start Time</th>
                      <th scope="col">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules?.map((item, key) => (
                      <tr key={key}>
                        <td>
                        {item.id.slice(1,5)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1">{item.date}</div>
                          </div>
                        </td>
                        <td>{item.start_time}</td>
                        <td>{item.end_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default DoctorScheduleTime;
