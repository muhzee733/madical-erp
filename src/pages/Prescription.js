import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrescription,
  getPrescription,
  searchPrescriptions,
  downloadPrescriptionPDF,
} from "../slices/prescriptions/thunk";
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import debounce from "lodash/debounce";

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const {
    prescriptions,
    searchResults,
    loading,
    formLoading,
    success,
    error,
    downloadingIds,
  } = useSelector((state) => state.prescriptions);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'drug' or 'supplier'
  const [searchInput, setSearchInput] = useState('');

  const toggleModal = (type) => {
    setModalType(type);
    setIsModalOpen(!isModalOpen);
    setSearchInput('');
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

    const payload = {
      ...formData,
      patient: Number(formData.patient),
      prescribed_drugs: formData.prescribed_drugs.map((d) => ({
        ...d,
        drug: Number(d.drug),
        quantity: Number(d.quantity),
        repeats: Number(d.repeats),
      })),
      prescribed_supplier_products: formData.prescribed_supplier_products.map(
        (p) => ({
          ...p,
          product: Number(p.product),
          quantity: Number(p.quantity),
          repeats: Number(p.repeats),
        })
      ),
    };

    dispatch(createPrescription(payload));
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
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Prescribed Drugs</h5>
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center"
                        onClick={() => toggleModal('drug')}
                      >
                        <i className="ri-search-line me-1"></i>
                        Search Drug
                      </button>
                    </div>
                    <div className="card-body">
                      {formData.prescribed_drugs.map((drug, index) => (
                        <div className="row mb-3" key={index}>
                          <div className="col-md-2">
                            <label className="form-label">Drug ID</label>
                            <input
                              type="number"
                              className="form-control"
                              name="drug"
                              value={drug.drug}
                              onChange={(e) => handleDrugChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Dosage</label>
                            <input
                              type="text"
                              className="form-control"
                              name="dosage"
                              value={drug.dosage}
                              onChange={(e) => handleDrugChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              name="instructions"
                              value={drug.instructions}
                              onChange={(e) => handleDrugChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              value={drug.quantity}
                              onChange={(e) => handleDrugChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Repeats</label>
                            <input
                              type="number"
                              className="form-control"
                              name="repeats"
                              value={drug.repeats}
                              onChange={(e) => handleDrugChange(index, e)}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card mt-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Supplier Products</h5>
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center"
                        onClick={() => toggleModal('supplier')}
                      >
                        <i className="ri-search-line me-1"></i>
                        Search Supplier Products
                      </button>
                    </div>
                    <div className="card-body">
                      {formData.prescribed_supplier_products.map((product, index) => (
                        <div className="row mb-3" key={index}>
                          <div className="col-md-2">
                            <label className="form-label">Product ID</label>
                            <input
                              type="number"
                              className="form-control"
                              name="product"
                              value={product.product}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Dosage</label>
                            <input
                              type="text"
                              className="form-control"
                              name="dosage"
                              value={product.dosage}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              name="instructions"
                              value={product.instructions}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Repeats</label>
                            <input
                              type="number"
                              className="form-control"
                              name="repeats"
                              value={product.repeats}
                              onChange={(e) => handleProductChange(index, e)}
                              required
                            />
                          </div>
                        </div>
                      ))}
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
                    <button type="submit" className="btn btn-primary">
                      {formLoading ? (
                        <Spinner size="sm" className="me-2" />
                      ) : null}
                      Submit Prescription
                    </button>
                  </div>

                  {success && (
                    <div className="alert alert-success mt-3">
                      Prescription created successfully!
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger mt-3">
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
                            <span className="ms-2">Loading prescriptions...</span>
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
                                {pres.prescribed_supplier_products.map((p, idx) => (
                                  <div key={idx} className="mb-1">
                                    <strong>{p.product}</strong>
                                    <br />
                                    Dosage: {p.dosage}
                                    <br />
                                    Qty: {p.quantity}, Repeats: {p.repeats}
                                    <br />
                                    <em>{p.instructions}</em>
                                  </div>
                                ))}
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
                              {pres.prescribed_supplier_products.map((p, idx) => (
                                <div key={idx} className="mb-1">
                                  <strong>{p.product}</strong>
                                  <br />
                                  Dosage: {p.dosage}
                                  <br />
                                  Qty: {p.quantity}, Repeats: {p.repeats}
                                  <br />
                                  <em>{p.instructions}</em>
                                </div>
                              ))}
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
              </div>
            </div>
          </div>
        </div>

        {/* Search Modal */}
        <Modal isOpen={isModalOpen} toggle={() => toggleModal(modalType)} centered>
          <ModalHeader toggle={() => toggleModal(modalType)}>
            {modalType === 'drug' ? 'Search Drugs' : 'Search Supplier Products'}
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <label className="form-label">Search</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Search ${modalType === 'drug' ? 'drugs' : 'supplier products'}...`}
                  value={searchInput}
                  onChange={handleSearchInput}
                />
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => {
                    // Add search functionality here
                  }}
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
              <div className="search-results" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {/* Results will be populated here */}
                <div className="text-center text-muted">
                  {modalType === 'drug' ? 'No drugs found' : 'No supplier products found'}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleModal(modalType)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default PrescriptionForm;
