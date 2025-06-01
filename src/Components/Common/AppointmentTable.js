import React, { useEffect, useState, useMemo } from "react";
import TableContainer from "./TableContainer";
import { Spinner } from "reactstrap";
import { useNavigate } from 'react-router-dom';

// Function to format time to 'HH:mm' format
const formatTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AppointmentTable = ({ appointments, loading, error }) => {
  const navigate = useNavigate();
  
  const handleViewAppointment = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index", 
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => <span>{cell.row.index + 1}</span>,
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        enableColumnFilter: false,
        cell: (cell) => (
          <span>
            {new Date(cell.getValue()).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        ),
      },
      {
        header: "Date",
        accessorKey: "start_time",
        enableColumnFilter: false,
        cell: (cell) => <span>{formatDate(cell.getValue())}</span>,
      },
      {
        header: "Start Time",
        accessorKey: "start_time",
        enableColumnFilter: false,
        cell: (cell) => <span>{formatTime(cell.getValue())}</span>,
      },
      {
        header: "End Time",
        accessorKey: "end_time",
        enableColumnFilter: false,
        cell: (cell) => <span>{formatTime(cell.getValue())}</span>,
      },
      {
        header: "Slot Type",
        accessorKey: "slot_type",
        enableColumnFilter: false,
        cell: (cell) => {
          const slotType = cell.getValue();
          return <span className="text-capitalize">{slotType}</span>;
        },
      }
      ,
      {
        header: "Is Booked",
        accessorKey: "is_booked",
        enableColumnFilter: false,
        cell: (cell) => {
          const isBooked = cell.getValue();
          const badgeColor = isBooked ? "success" : "warning";
          const status = isBooked ? "Yes" : "No";
          return (
            <span className={`badge bg-${badgeColor} p-2`}>
              {status}
            </span>
          );
        },
      },
      {
        header: "Action",
        accessorKey: "",
        cell: (cell) => (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleViewAppointment(cell.row.original.id)}
          >
            View
          </button>
        ),
      }
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
          ) : appointments && appointments?.results?.length > 0 ? (
            <TableContainer
              columns={columns}
              data={appointments?.results || []}
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
