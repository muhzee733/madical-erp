import React, { useEffect, useState, useMemo } from "react";
import TableContainer from "./TableContainer";
import { Spinner } from "reactstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Function to format time to 'HH:mm' format
const formatTime = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  return `${hour}:${minute}`;
};

const AppointmentTable = ({ orders, loading, error }) => {
  const navigate = useNavigate();

  const handleChatButtonClick = async (order) => {
    const payload = {
      patient: order.patient_id,
      doctor: order.appointment?.doctor,
      appointment: order.appointment?.id,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms/`, payload);
      navigate(`/chatroom/${response?.id}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Something went wrong while creating the chat room.");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index", // Added index as a custom accessor
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => <span>{cell.row.index + 1}</span>, // Shows row index (1-based)
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        enableColumnFilter: false,
        cell: (cell) => (
          <span>{new Date(cell.getValue()).toLocaleString()}</span>
        ), // Format the date
      },
      {
        header: "Date",
        accessorKey: "appointment_date",
        enableColumnFilter: false,
        cell: (cell) => <span>{cell.getValue()}</span>,
      },
      {
        header: "Time",
        accessorKey: "start_time", // Show formatted start time
        enableColumnFilter: false,
        cell: (cell) => <span>{formatTime(cell.getValue())}</span>,
      },
      {
        header: "Price",
        accessorKey: "amount",
        enableColumnFilter: false,
        cell: (cell) => <span>{cell.getValue()} USD</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          let badgeColor = "secondary"; // Default badge color

          // Assign colors for different statuses
          if (status === "pending") badgeColor = "warning";
          if (status === "confirmed") badgeColor = "success";
          if (status === "cancelled") badgeColor = "danger";

          return <span className={`badge bg-${badgeColor}`}>{status}</span>;
        },
      },
      {
        header: "Chat",
        accessorKey: "Chat",
        enableColumnFilter: false,
        cell: (cell) => (
          <button
            onClick={() => handleChatButtonClick(cell.row.original)}
            className="btn btn-primary"
          >
            Open Chat
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-body pt-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <h5 className="text-danger">Error: {error}</h5>
            </div>
          ) : orders && orders.length > 0 ? (
            <TableContainer
              columns={columns}
              data={orders || []}
              isGlobalFilter={true}
              isAddUserList={false}
              customPageSize={10}
              divClass="table-responsive mb-1"
              tableClass="mb-0 align-middle table-borderless"
              theadClass="table-light text-muted"
              isProductsFilter={false}
              SearchPlaceholder="Search Appointments..."
            />
          ) : (
            <div className="py-4 text-center">
              <div>
                <lord-icon
                  src="https://cdn.lordicon.com/msoeawqm.json"
                  trigger="loop"
                  colors="primary:#405189,secondary:#0ab39c"
                  style={{ width: "72px", height: "72px" }}
                ></lord-icon>
              </div>
              <div className="mt-4">
                <h5>Sorry! No Appointments Found</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentTable;
