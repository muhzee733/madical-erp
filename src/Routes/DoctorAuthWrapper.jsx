import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

const PatientAuthWrapper = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("authUser");

    if (!token) {
      setAuthorized(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/users/dashboard/doctor/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res, 'res')
        if (res?.user?.role === "doctor") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          cookies.remove("authUser");
          cookies.remove("user");
        }
      })
      .catch(() => {
        setAuthorized(false);
        cookies.remove("authUser");
        cookies.remove("user");
      });
  }, []);

  if (authorized === null) return null;
  if (!authorized) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default PatientAuthWrapper;
