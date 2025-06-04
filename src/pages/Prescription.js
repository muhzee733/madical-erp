import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrescription,
  getPrescription,
  searchPrescriptions,
  downloadPrescriptionPDF,
  searchDrugs,
  searchSupplierProducts,
  searchPatients,
} from "../slices/prescriptions/thunk";
import {
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import debounce from "lodash/debounce";
import { resetPrescriptionState, clearSuccess } from "../slices/prescriptions/slice";

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const {
    prescriptions,
    searchResults,
    drugResults,
    supplierResults,
    patientResults,
    loading,
    formLoading,
    success,
    error,
    downloadingIds,
  } = useSelector((state) => state.prescriptions);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [manualDrugName, setManualDrugName] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientSearchInput, setPatientSearchInput] = useState("");

  const toggleModal = (type) => {
    setModalType(type);
    setIsModalOpen(!isModalOpen);
    setSearchInput("");
    setIsManualEntry(false);
    setManualDrugName("");
    // Clear search results when closing modal
    if (type === "drug") {
      dispatch({ type: "prescriptions/searchDrugs/fulfilled", payload: { results: [] } });
    } else if (type === "supplier") {
      dispatch({ type: "prescriptions/searchSupplierProducts/fulfilled", payload: { results: [] } });
    }
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    dispatch(getPrescription());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    patient: "",
    notes: "",
    prescribed_drugs: [
      {
        drug: "",
        dosage: "",
        instructions: "",
        quantity: "",
        repeats: "",
      },
    ],
    prescribed_supplier_products: [
      {
        product: "",
        dosage: "",
        instructions: "",
        quantity: "",
        repeats: "",
      },
    ],
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim()) {
        dispatch(searchPrescriptions(term));
      }
    }, 500),
    [dispatch]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrugChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDrugs = [...formData.prescribed_drugs];
    updatedDrugs[index][name] = value;
    setFormData((prev) => ({ ...prev, prescribed_drugs: updatedDrugs }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.prescribed_supplier_products];
    updatedProducts[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      prescribed_supplier_products: updatedProducts,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearSuccess()); // Clear any existing success message

    const payload = {
      notes: formData.notes,
      patient: 2,
      prescribed_drugs: selectedDrugs.map((drug) => ({
        drug: drug.id,
        dosage: drug.dosage,
        instructions: drug.instructions,
        quantity: Number(drug.quantity),
        repeats: Number(drug.repeats),
      })),
      prescribed_supplier_products: selectedProducts.map((product) => ({
        product: product.id,
        dosage: product.dosage,
        instructions: product.instructions,
        quantity: Number(product.quantity),
        repeats: Number(product.repeats),
      })),
    };

    dispatch(createPrescription(payload)).then(() => {
      // Reset form after successful submission
      setFormData({
        patient: "",
        notes: "",
        prescribed_drugs: [
          {
            drug: "",
            dosage: "",
            instructions: "",
            quantity: "",
            repeats: "",
          },
        ],
        prescribed_supplier_products: [
          {
            product: "",
            dosage: "",
            instructions: "",
            quantity: "",
            repeats: "",
          },
        ],
      });
      setSelectedDrugs([]);
      setSelectedProducts([]);
      setSelectedPatient(null);
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchPrescriptions(searchTerm));
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    dispatch(getPrescription());
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleModalSearch = () => {
    if (searchInput.trim()) {
      if (modalType === "drug") {
        dispatch(searchDrugs(searchInput));
      } else if (modalType === "supplier") {
        dispatch(searchSupplierProducts(searchInput));
      }
    }
  };

  const handleDrugSelect = (drug) => {
    setSelectedDrugs((prev) => [
      ...prev,
      { ...drug, dosage: "", instructions: "", quantity: "", repeats: "" },
    ]);
    setSearchInput("");
    // Clear drug search results
    dispatch({ type: "prescriptions/searchDrugs/fulfilled", payload: { results: [] } });
    toggleModal(modalType);
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prev) => [
      ...prev,
      { ...product, dosage: "", instructions: "", quantity: "", repeats: "" },
    ]);
    setSearchInput("");
    // Clear supplier search results
    dispatch({ type: "prescriptions/searchSupplierProducts/fulfilled", payload: { results: [] } });
    toggleModal(modalType);
  };

  const handleManualDrugAdd = () => {
    if (manualDrugName.trim()) {
      setSelectedDrugs((prev) => [
        ...prev,
        {
          id: Date.now(),
          drug_name: manualDrugName,
          dosage: "",
          instructions: "",
          quantity: "",
          repeats: "",
          is_manual_entry: true,
        },
      ]);
      setManualDrugName("");
      setIsManualEntry(false);
      // Clear drug search results
      dispatch({ type: "prescriptions/searchDrugs/fulfilled", payload: { results: [] } });
      toggleModal(modalType);
    }
  };

  const handleDrugDetailsChange = (index, field, value) => {
    setSelectedDrugs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProductDetailsChange = (index, field, value) => {
    setSelectedProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeDrug = (index) => {
    setSelectedDrugs((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePatientModal = () => {
    setIsPatientModalOpen(!isPatientModalOpen);
    setPatientSearchInput("");
    dispatch({ type: "prescriptions/searchPatients/fulfilled", payload: { results: [] } });
  };

  const handlePatientSearch = () => {
    if (patientSearchInput.trim()) {
      dispatch(searchPatients(patientSearchInput));
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchInput("");
    dispatch({ type: "prescriptions/searchPatients/fulfilled", payload: { results: [] } });
    togglePatientModal();
  };

  // Clear success message when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Create New Prescription</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Patient Card */}
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Patient</h5>
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center"
                        onClick={togglePatientModal}
                      >
                        <i className="ri-add-line me-1"></i>
                        Add Patient
                      </button>
                    </div>
                    <div className="card-body">
                      {selectedPatient ? (
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{selectedPatient.name}</h5>
                            <p className="text-muted mb-0">
                              ID: {selectedPatient.id}
                              {selectedPatient.email && ` • ${selectedPatient.email}`}
                              {selectedPatient.phone && ` • ${selectedPatient.phone}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setSelectedPatient(null)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          No patient selected. Click "Add Patient" to select a patient.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Prescribed Drugs</h5>
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center"
                        onClick={() => toggleModal("drug")}
                      >
                        <i className="ri-add-line me-1"></i>
                        Add Drug
                      </button>
                    </div>
                    <div className="card-body">
                      {selectedDrugs.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-centered table-nowrap mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Drug Name</th>
                                <th>Dosage</th>
                                <th>Instructions</th>
                                <th>Quantity</th>
                                <th>Repeats</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDrugs.map((drug, index) => (
                                <tr key={index}>
                                  <td>{drug.drug_name}</td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={drug.dosage}
                                      onChange={(e) =>
                                        handleDrugDetailsChange(
                                          index,
                                          "dosage",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={drug.instructions}
                                      onChange={(e) =>
                                        handleDrugDetailsChange(
                                          index,
                                          "instructions",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={drug.quantity}
                                      onChange={(e) =>
                                        handleDrugDetailsChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={drug.repeats}
                                      onChange={(e) =>
                                        handleDrugDetailsChange(
                                          index,
                                          "repeats",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => removeDrug(index)}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          No drugs added yet. Click "Add Drug" to add drugs.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card mt-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Supplier Products</h5>
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center"
                        onClick={() => toggleModal("supplier")}
                      >
                        <i className="ri-add-line me-1"></i>
                        Add Supplier Product
                      </button>
                    </div>
                    <div className="card-body">
                      {selectedProducts.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-centered table-nowrap mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Supplier</th>
                                <th>Dosage</th>
                                <th>Instructions</th>
                                <th>Quantity</th>
                                <th>Repeats</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProducts.map((product, index) => (
                                <tr key={index}>
                                  <td>{product.supplier_name}</td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={product.dosage}
                                      onChange={(e) =>
                                        handleProductDetailsChange(
                                          index,
                                          "dosage",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={product.instructions}
                                      onChange={(e) =>
                                        handleProductDetailsChange(
                                          index,
                                          "instructions",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={product.quantity}
                                      onChange={(e) =>
                                        handleProductDetailsChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={product.repeats}
                                      onChange={(e) =>
                                        handleProductDetailsChange(
                                          index,
                                          "repeats",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => removeProduct(index)}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          No supplier products added yet. Click "Add Supplier
                          Product" to add products.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card mt-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Additional Notes</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows="3"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      
                    >
                      {formLoading ? (
                        <Spinner size="sm" className="me-2" />
                      ) : null}
                      Submit Prescription
                    </button>
                  </div>

                  {success && (
                    <div className="alert alert-success mt-3" role="alert">
                      <i className="ri-check-double-line me-1 align-middle"></i>
                      Prescription created successfully!
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      <i className="ri-error-warning-line me-1 align-middle"></i>
                      Error: {error?.message || "Failed to submit"}
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">
                <h4 className="card-title mb-0">Prescriptions List</h4>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search prescriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearch}
                      >
                        <i className="ri-search-line me-1"></i>
                        Search
                      </button>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleClear}
                      >
                        <i className="ri-close-line me-1"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Patient ID</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Drugs</th>
                        <th scope="col">Supplier Products</th>
                        <th scope="col">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <Spinner color="primary" />
                            <span className="ms-2">
                              Loading prescriptions...
                            </span>
                          </td>
                        </tr>
                      ) : searchTerm ? (
                        searchResults?.count > 0 ? (
                          searchResults?.results.map((pres, index) => (
                            <tr key={pres.id}>
                              <td>{index + 1}</td>
                              <td>{pres.patient}</td>
                              <td>{pres.doctor_name}</td>
                              <td>{pres.notes}</td>
                              <td>
                                {pres.prescribed_drugs.map((d, idx) => (
                                  <div key={idx} className="mb-1">
                                    <strong>{d.drug}</strong>
                                    <br />
                                    Dosage: {d.dosage}
                                    <br />
                                    Qty: {d.quantity}, Repeats: {d.repeats}
                                    <br />
                                    <em>{d.instructions}</em>
                                  </div>
                                ))}
                              </td>
                              <td>
                                {pres.prescribed_supplier_products.map(
                                  (p, idx) => (
                                    <div key={idx} className="mb-1">
                                      <strong>{p.product}</strong>
                                      <br />
                                      Dosage: {p.dosage}
                                      <br />
                                      Qty: {p.quantity}, Repeats: {p.repeats}
                                      <br />
                                      <em>{p.instructions}</em>
                                    </div>
                                  )
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    dispatch(downloadPrescriptionPDF(pres.id))
                                  }
                                  className="btn btn-sm btn-soft-primary"
                                  disabled={downloadingIds.includes(pres.id)}
                                >
                                  {downloadingIds.includes(pres.id) ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <i className="ri-download-line me-1"></i>
                                      Download
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No prescriptions found.
                            </td>
                          </tr>
                        )
                      ) : prescriptions?.count > 0 ? (
                        prescriptions?.results.map((pres, index) => (
                          <tr key={pres.id}>
                            <td>{index + 1}</td>
                            <td>{pres.patient}</td>
                            <td>{pres.doctor_name}</td>
                            <td>{pres.notes}</td>
                            <td>
                              {pres.prescribed_drugs.map((d, idx) => (
                                <div key={idx} className="mb-1">
                                  <strong>{d.drug}</strong>
                                  <br />
                                  Dosage: {d.dosage}
                                  <br />
                                  Qty: {d.quantity}, Repeats: {d.repeats}
                                  <br />
                                  <em>{d.instructions}</em>
                                </div>
                              ))}
                            </td>
                            <td>
                              {pres.prescribed_supplier_products.map(
                                (p, idx) => (
                                  <div key={idx} className="mb-1">
                                    <strong>{p.product}</strong>
                                    <br />
                                    Dosage: {p.dosage}
                                    <br />
                                    Qty: {p.quantity}, Repeats: {p.repeats}
                                    <br />
                                    <em>{p.instructions}</em>
                                  </div>
                                )
                              )}
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  dispatch(downloadPrescriptionPDF(pres.id))
                                }
                                className="btn btn-sm btn-soft-primary"
                                disabled={downloadingIds.includes(pres.id)}
                              >
                                {downloadingIds.includes(pres.id) ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <>
                                    <i className="ri-download-line me-1"></i>
                                    Download
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No prescriptions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {!searchTerm && prescriptions?.count > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing {((prescriptions.current_page - 1) * prescriptions.page_size) + 1} to {Math.min(prescriptions.current_page * prescriptions.page_size, prescriptions.count)} of {prescriptions.count} entries
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination pagination-rounded mb-0">
                        <li className={`page-item ${prescriptions.current_page === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => dispatch(getPrescription(prescriptions.current_page - 1))}
                            disabled={prescriptions.current_page === 1}
                          >
                            <i className="ri-arrow-left-s-line"></i>
                          </button>
                        </li>
                        {(() => {
                          const totalPages = Math.ceil(prescriptions.count / prescriptions.page_size);
                          const maxVisiblePages = 5;
                          let startPage = Math.max(1, prescriptions.current_page - Math.floor(maxVisiblePages / 2));
                          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                          
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }

                          const pages = [];
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <li key={i} className={`page-item ${prescriptions.current_page === i ? 'active' : ''}`}>
                                <button 
                                  className="page-link"
                                  onClick={() => dispatch(getPrescription(i))}
                                >
                                  {i}
                                </button>
                              </li>
                            );
                          }
                          return pages;
                        })()}
                        <li className={`page-item ${prescriptions.current_page === Math.ceil(prescriptions.count / prescriptions.page_size) ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => dispatch(getPrescription(prescriptions.current_page + 1))}
                            disabled={prescriptions.current_page === Math.ceil(prescriptions.count / prescriptions.page_size)}
                          >
                            <i className="ri-arrow-right-s-line"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Modal */}
        <Modal
          isOpen={isModalOpen}
          toggle={() => toggleModal(modalType)}
          centered
        >
          <ModalHeader toggle={() => toggleModal(modalType)}>
            {modalType === "drug" ? "Add Drug" : "Add Supplier Product"}
          </ModalHeader>
          <ModalBody>
            {modalType === "drug" && (
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="manualEntrySwitch"
                    checked={isManualEntry}
                    onChange={(e) => setIsManualEntry(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="manualEntrySwitch">
                    Add New Drug
                  </label>
                </div>
              </div>
            )}

            {modalType === "drug" && isManualEntry ? (
              <div className="mb-3">
                <label className="form-label">Drug Name</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter drug name..."
                    value={manualDrugName}
                    onChange={(e) => setManualDrugName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleManualDrugAdd}
                    disabled={!manualDrugName.trim()}
                  >
                    <i className="ri-add-line me-1"></i>
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Search</label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Search ${
                        modalType === "drug" ? "drugs" : "supplier products"
                      }...`}
                      value={searchInput}
                      onChange={handleSearchInput}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleModalSearch();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center"
                      onClick={handleModalSearch}
                    >
                      <i className="ri-search-line me-1"></i>
                      Search
                    </button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <span className="ms-2">Searching...</span>
                  </div>
                ) : (
                  <div
                    className="search-results"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {modalType === "drug" && drugResults?.results?.length > 0 ? (
                      <ListGroup flush>
                        {drugResults.results?.map((drug) => (
                          <ListGroupItem
                            key={drug.id}
                            onClick={() => handleDrugSelect(drug)}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="ri-medicine-bottle-line align-middle me-2"></i>
                            {drug.drug_name}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    ) : modalType === "supplier" &&
                      supplierResults?.results?.length > 0 ? (
                      <ListGroup flush>
                        {supplierResults.results?.map((product) => (
                          <ListGroupItem
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="ri-shopping-bag-line align-middle me-2"></i>
                            {product.product_name} - {product.supplier_name}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center text-muted">
                        {modalType === "drug"
                          ? "No drugs found"
                          : "No supplier products found"}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleModal(modalType)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Patient Search Modal */}
        <Modal isOpen={isPatientModalOpen} toggle={togglePatientModal} centered>
          <ModalHeader toggle={togglePatientModal}>
            Add Patient
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <label className="form-label">Search Patient</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patients..."
                  value={patientSearchInput}
                  onChange={(e) => setPatientSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlePatientSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handlePatientSearch}
                >
                  <i className="ri-search-line me-1"></i>
                  Search
                </button>
              </div>
            </div>
            {loading ? (
              <div className="text-center">
                <Spinner color="primary" />
                <span className="ms-2">Searching...</span>
              </div>
            ) : (
              <div className="search-results" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {patientResults?.results?.length > 0 ? (
                  <ListGroup flush>
                    {patientResults.results?.map((patient) => (
                      <ListGroupItem
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-user-line align-middle me-2"></i>
                        {patient.name}
                        {patient.email && ` • ${patient.email}`}
                        {patient.phone && ` • ${patient.phone}`}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center text-muted">
                    No patients found
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={togglePatientModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default PrescriptionForm;
