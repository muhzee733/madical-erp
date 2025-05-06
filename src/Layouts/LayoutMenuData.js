import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navdata = () => {
  const navigate = useNavigate();
  const [isDashboard, setIsDashboard] = useState(false);
  const [currentState, setCurrentState] = useState("Dashboard");
  const [role, setRole] = useState(null);

  const updateIconSidebar = (e) => {
    if (e?.target?.getAttribute("subitems")) {
      const iconItems = document.querySelectorAll(
        "#two-column-menu .nav-icon.active"
      );
      iconItems.forEach((item) => {
        item.classList.remove("active");
        const id = item.getAttribute("subitems");
        document.getElementById(id)?.classList.remove("show");
      });
    }
  };

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    const routes = {
      Widgets: "/widgets",
      Questions: "/questions",
      Appointment: "/appointment",
      Chat: "/chatroom",
    };

    if (routes[currentState]) {
      navigate(routes[currentState]);
      document.body.classList.add("twocolumn-panel");
    }

    setIsDashboard(currentState === "Dashboard");

    // Get user role from cookies
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    setRole(user?.role || null);
  }, [currentState, navigate]);

  const commonMenuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "bx bxs-dashboard",
      link: "/#",
      stateVariables: isDashboard,
      click: (e) => {
        e.preventDefault();
        setIsDashboard(true);
        setCurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "chatroom",
      label: "Chat Room",
      icon: "bx bx-message-rounded-dots",
      link: "/chatroom",
      stateVariables: currentState === "Chat",
      click: (e) => {
        e.preventDefault();
        setIsDashboard(false);
        setCurrentState("Chat");
        updateIconSidebar(e);
      },
    },
  ];

  const patientMenu = [
    // {
    //   id: "appointment",
    //   label: "Appointments",
    //   icon: "bx bx-calendar",
    //   link: "/appointment",
    //   click: (e) => {
    //     e.preventDefault();
    //     setCurrentState("Appointment");
    //   },
    // },
  ];

  const doctorMenu = [
    {
      id: "appointment",
      label: "Appointments",
      icon: "bx bx-calendar",
      link: "/dashboard/doctor/appointment",
      click: (e) => {
        e.preventDefault();
        setCurrentState("Appointment");
      },
    },
  ];

  const adminMenu = [
    {
      id: "questions",
      label: "Questions",
      icon: "bx bx-help-circle",
      link: "/dashboard/admin/questions",
      click: (e) => {
        e.preventDefault();
        setCurrentState("Questions");
      },
    },
  ];

  let roleBasedMenu = [];

  if (role === "patient") {
    roleBasedMenu = patientMenu;
  } else if (role === "doctor") {
    roleBasedMenu = doctorMenu;
  } else if (role === "admin") {
    roleBasedMenu = adminMenu;
  }

  const finalMenuItems = [...commonMenuItems, ...roleBasedMenu];

  return <>{finalMenuItems}</>;
};

export default Navdata;
