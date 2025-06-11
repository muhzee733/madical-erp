import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

const DoctorAuthWrapper = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("authUser");
    const user = cookies.get("user");

    if (!token || !user) {
      setAuthorized(false);
      return;
    }

    // First check the user role from cookies
    if (user.role !== "doctor") {
      setAuthorized(false);
      cookies.remove("authUser");
      cookies.remove("user");
      return;
    }

    // Then verify with the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/dashboard/doctor/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.success) {
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
  // if (!authorized) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default DoctorAuthWrapper;

