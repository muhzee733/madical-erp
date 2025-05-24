import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPlus, FiTrash2, FiPrinter } from "react-icons/fi";

// Dummy data for prescriptions
const dummyPrescriptions = [
  {
    id: 1,
    created_at: "2024-03-15",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Take after meals"
      }
    ],
    followUpDate: "2024-03-22"
  },
  {
    id: 2,
    created_at: "2024-03-10",
    medications: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "2 times daily",
        duration: "5 days",
        instructions: "Take with food"
      }
    ],
    followUpDate: "2024-03-17"
  }
];

const Prescription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState(dummyPrescriptions);

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPrescription = {
        id: prescriptions.length + 1,
        created_at: new Date().toISOString(),
        medications,
        followUpDate: followUpDate ? followUpDate.toISOString() : null,
      };
      
      setPrescriptions([newPrescription, ...prescriptions]);
      setLoading(false);
      toast.success("Prescription created successfully!");
      
      // Reset form
      setMedications([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
      setNotes("");
      setFollowUpDate(null);
    }, 1000);
  };

  const handleDownloadPDF = async (prescriptionId) => {
    toast.info("PDF download functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Create Prescription</CardTitle>
                
                <Form onSubmit={handleSubmit}>
                  {/* Medications Section */}
                  <div className="mb-4">
                    <h5 className="mb-3">Medications</h5>
                    {medications.map((medication, index) => (
                      <Card key={index} className="mb-3 border">
                        <CardBody>
                          <Row>
                            <Col md={11}>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label>Medicine Name</Label>
                                    <Input
                                      type="text"
                                      value={medication.name}
                                      onChange={(e) =>
                                        handleMedicationChange(index, "name", e.target.value)
                                      }
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label>Dosage</Label>
                                    <Input
                                      type="text"
                                      value={medication.dosage}
                                      onChange={(e) =>
                                        handleMedicationChange(index, "dosage", e.target.value)
                                      }
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label>Frequency</Label>
                                    <Input
                                      type="text"
                                      value={medication.frequency}
                                      onChange={(e) =>
                                        handleMedicationChange(index, "frequency", e.target.value)
                                      }
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label>Duration</Label>
                                    <Input
                                      type="text"
                                      value={medication.duration}
                                      onChange={(e) =>
                                        handleMedicationChange(index, "duration", e.target.value)
                                      }
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={12}>
                                  <FormGroup>
                                    <Label>Instructions</Label>
                                    <Input
                                      type="textarea"
                                      value={medication.instructions}
                                      onChange={(e) =>
                                        handleMedicationChange(index, "instructions", e.target.value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                            <Col md={1} className="d-flex align-items-center justify-content-center">
                              <Button
                                color="danger"
                                className="btn-icon"
                                onClick={() => handleRemoveMedication(index)}
                                disabled={medications.length === 1}
                              >
                                <FiTrash2 />
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ))}
                    <Button
                      color="light"
                      className="mt-2"
                      onClick={handleAddMedication}
                    >
                      <FiPlus className="me-2" />
                      Add Medication
                    </Button>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-4">
                    <h5 className="mb-3">Additional Notes</h5>
                    <FormGroup>
                      <Input
                        type="textarea"
                        rows="4"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any additional notes or instructions..."
                      />
                    </FormGroup>
                  </div>

                  {/* Follow-up Date */}
                  <div className="mb-4">
                    <h5 className="mb-3">Follow-up Date</h5>
                    <FormGroup>
                      <DatePicker
                        selected={followUpDate}
                        onChange={(date) => setFollowUpDate(date)}
                        className="form-control"
                        placeholderText="Select follow-up date"
                        minDate={new Date()}
                      />
                    </FormGroup>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner size="sm" /> : "Save Prescription"}
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Prescription List */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Recent Prescriptions</CardTitle>
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Medications</th>
                        <th>Follow-up Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                          <td>{new Date(prescription.created_at).toLocaleDateString()}</td>
                          <td>{prescription.medications.length} medications</td>
                          <td>
                            {prescription.followUpDate
                              ? new Date(prescription.followUpDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                color="info"
                                size="sm"
                                onClick={() => handleDownloadPDF(prescription.id)}
                              >
                                <FiPrinter className="me-1" />
                                Print
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Prescription; 