import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../slices/OrderAppointment/thunk";
import AppointmentTable from "./AppointmentTable";

const AppointmentTableWrapper = ({ title, className }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.OrderAppointment);

  return (
    <div className={className}>
      {title && <h4 className="mb-4">{title}</h4>}
      <AppointmentTable 
        orders={orders} 
        loading={ordersLoading} 
        error={ordersError}
      />
    </div>
  );
};

export default AppointmentTableWrapper; 