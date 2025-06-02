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
        header: "Patient Name",
        accessorKey: "patient.full_name",
        cell: ({ row }) => {
          const patient = row.original.patient || {};
          return <span>{patient.first_name || ''} {patient.last_name || ''}</span>;
        },
      },
      {
        header: "Email",
        accessorKey: "patient.email",
        cell: ({ row }) => <span>{row.original.patient?.email || ''}</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = getValue();
          const badgeColor = value === "booked" ? "success" : "danger";
          return <span className={`badge bg-${badgeColor} text-capitalize`}>{value?.replace(/_/g, ' ') || ''}</span>;
        },
      },
      {
        header: "Booked At",
        accessorKey: "booked_at",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return '';
          return new Date(value).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        header: "Action",
        accessorKey: "id",
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
    [handleViewAppointment]
  );
  

  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-body pt-0">
          {error ? (
            <div className="text-center py-5">
              <h5 className="text-danger">Error: {error}</h5>
            </div>
          ) : loading || !appointments?.results ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading appointments...</p>
            </div>
          ) : (
            <TableContainer
              columns={columns}
              data={appointments?.results || []}
              isGlobalFilter={true}
              isAddUserList={false}
              customPageSize={10}
              divClass="table-responsive mb-1"
              tableClass="mb-0 align-middle table-bordered"
              theadClass="table-light text-muted"
              isProductsFilter={false}
              SearchPlaceholder="Search Appointments..."
              loading={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentTable;
