import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrescription,
  getPrescription,
  searchPrescriptions,
  downloadPrescriptionPDF,
} from "../slices/prescriptions/thunk";
import { Spinner } from "reactstrap";
import debounce from "lodash/debounce";

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const { prescriptions, searchResults, loading, success, error, downloadingIds } = useSelector(
    (state) => state.prescriptions
  );
  console.log(prescriptions, "prescriptions");

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

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="patient" className="form-label">
              Patient ID
            </label>
            <input
              type="number"
              className="form-control"
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
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

          <h5>Prescribed Drugs</h5>
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

          <h5>Prescribed Supplier Products</h5>
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

          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              {loading ? <Spinner color="primary" /> : "Submit Prescription"}
            </button>
          </div>

          {success && (
            <p className="text-success mt-2">
              Prescription created successfully!
            </p>
          )}
          {error && (
            <p className="text-danger mt-2">
              Error: {error?.message || "Failed to submit"}
            </p>
          )}
        </form>

        <row>
          <h4 className="mb-3">Prescriptions</h4>

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
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <button 
                  className="btn btn-secondary" 
                  type="button"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* {loading && (
            <div className="text-center mb-3">
              <Spinner color="primary" />
              <span className="ms-2">Loading...</span>
            </div>
          )} */}

          <div className="table-responsive">
            <table className="table align-middle table-nowrap table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Patient ID</th>
                  <th>Doctor</th>
                  <th>Notes</th>
                  <th>Drugs</th>
                  <th>Supplier Products</th>
                  <th>PDF</th>
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
                            onClick={() => dispatch(downloadPrescriptionPDF(pres.id))}
                            className="btn btn-sm btn-soft-primary"
                            disabled={downloadingIds.includes(pres.id)}
                          >
                            {downloadingIds.includes(pres.id) ? <Spinner size="sm" /> : "Download"}
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
                          onClick={() => dispatch(downloadPrescriptionPDF(pres.id))}
                          className="btn btn-sm btn-soft-primary"
                          disabled={downloadingIds.includes(pres.id)}
                        >
                          {downloadingIds.includes(pres.id) ? <Spinner size="sm" /> : "Download"}
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
        </row>
      </div>
    </div>
  );
};

export default PrescriptionForm;
