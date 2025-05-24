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

  const handleMenuClick = (e, state) => {
    e.preventDefault();
    setIsDashboard(state === "Dashboard");
    setCurrentState(state);
    updateIconSidebar(e);
  };

  const commonMenuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "chatroom",
      label: "Chat Room",
      icon: "bx bx-message-rounded-dots",
      link: "/chatroom",
      stateVariables: currentState === "Chat",
      click: (e) => handleMenuClick(e, "Chat"),
    },
  ];

  const roleBasedMenus = {
    patient: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "bx bxs-dashboard",
        link: "/dashboard/patient",
        stateVariables: isDashboard,
        click: (e) => {
          e.preventDefault();
          navigate("/dashboard/patient");
          setIsDashboard(true);
          setCurrentState("Dashboard");
        },
      },
      {
        id: "appointment",
        label: "Appointments",
        icon: "bx bx-calendar",
        link: "/dashboard/patient/appointment",
        click: (e) => handleMenuClick(e, "Appointment"),
      },
    ],
    doctor: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "bx bxs-dashboard",
        link: "/dashboard/doctor",
        stateVariables: isDashboard,
        click: (e) => {
          e.preventDefault();
          navigate("/dashboard/doctor");
          setIsDashboard(true);
          setCurrentState("Dashboard");
        },
      },
      {
        id: "appointment",
        label: "Appointments",
        icon: "bx bx-calendar",
        link: "/dashboard/doctor/appointment",
        click: (e) => handleMenuClick(e, "Appointment"),
      },
    ],
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "bx bxs-dashboard",
        link: "/dashboard/admin",
        stateVariables: isDashboard,
        click: (e) => {
          e.preventDefault();
          navigate("/dashboard/admin");
          setIsDashboard(true);
          setCurrentState("Dashboard");
        },
      },
      {
        id: "questions",
        label: "Questions",
        icon: "bx bx-help-circle",
        link: "/dashboard/admin/questions",
        click: (e) => handleMenuClick(e, "Questions"),
      },
    ],
  };

  const roleBasedMenu = roleBasedMenus[role] || [];
  const finalMenuItems = [...commonMenuItems, ...roleBasedMenu];

  return <>{finalMenuItems}</>;
};

export default Navdata;
