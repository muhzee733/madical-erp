import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import DashboardPatient from "../pages/DashboardPatient";
import Questions from "../pages/AdminDashboard/AddQuestions";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

import PrivecyPolicy from "../pages/Pages/PrivacyPolicy"
import TermsCondition from '../pages/Pages/TermsCondition';
import UserProfile from "../pages/Authentication/user-profile";
import PreQuestions from "../pages/Questions/preQuestions";
import Appointment from "../pages/Appointment";
import ScheduleAppointment from "../pages/Appointment/scheduleAppointment";
import NotFound from "../pages/AuthenticationInner/Errors/Alt404";
import Unauthorized from "../pages/Pages/Maintenance/Maintenance";
import DoctorDashboard from '../pages/DoctorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Checkout from '../pages/Checkout';
import Chatroom from '../pages/Chat/index';
import Success from "../pages/Success";

const authProtectedRoutes = [
  { path: "/dashboard/patient", component: <DashboardPatient /> },
  { path: "/index", component: <DashboardPatient /> },
  { path: "/questions", component: <Questions /> },
  { path: "/dashboard/doctor/appointment", component: <Appointment /> },
  { path: "/pages-privacy-policy", component: <PrivecyPolicy /> },
  { path: "/pages-terms-condition", component: <TermsCondition /> },
  { path: "/dashboard/doctor/schedule-appointment", component: <ScheduleAppointment /> },
  { path: "/dashboard/doctor", component: <DoctorDashboard /> },
  { path: "/dashboard/admin", component: <AdminDashboard /> },
  { path: "/checkout", component: <Checkout /> },
  { path: "/chatroom", component: <Chatroom /> },
  
   //User Profile
  { path: "/profile", component: <UserProfile /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard/patient" />,
  },
  { path: "*", component: <Navigate to="/404" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/404", component: <NotFound /> },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/prequestions", component: <PreQuestions /> },
  { path: "/unauthorized", component: <Unauthorized /> },
  { path: "/appointment-success", component: <Success /> },

];

export { authProtectedRoutes, publicRoutes };