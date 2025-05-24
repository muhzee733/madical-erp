import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  ListGroupItem,
  ListGroup
} from "reactstrap";
import Cookies from "js-cookie";

import BreadCrumb from "../../Components/Common/BreadCrumb";
const Questions = () => {
  document.title = "Create Questions | Velzon";

  const [question, setQuestion] = useState("");
  const [type, setType] = useState("text");
  const [choices, setChoices] = useState([""]);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const addChoiceField = () => {
    setChoices([...choices, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      question,
      type,
      choices:
        type === "text" ? [] : choices.filter((choice) => choice.trim() !== ""),
    };

    const token = Cookies.get("authUser");
    try {
                      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create_questions/`,
        payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.message);
      setLoading(false);
      setQuestion("");
      setType("text");
      setChoices([""]);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized! Please log in again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/questions/questions/`
        );
        setQuestions(response);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Question" pageTitle="Pages" />

        <Row className="justify-content-center">
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h4" className="mb-4">
                  New Question Form
                </CardTitle>
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {message && (
                  <div
                    className="alert alert-primary alert-dismissible fade show"
                    role="alert"
                  >
                    {message}
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                      onClick={() => setMessage("")}
                    ></button>
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="question">Question</Label>
                    <Input
                      type="text"
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter your question"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="type">Question Type</Label>
                    <Input
                      type="select"
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="radio">Radio</option>
                      <option value="checkbox">Checkbox</option>
                    </Input>
                  </FormGroup>

                  {(type === "radio" || type === "checkbox") && (
                    <>
                      <Label>Choices</Label>
                      {choices.map((choice, index) => (
                        <FormGroup key={index}>
                          <Input
                            type="text"
                            placeholder={`Choice ${index + 1}`}
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(index, e.target.value)
                            }
                          />
                        </FormGroup>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        onClick={addChoiceField}
                      >
                        + Add Choice
                      </Button>
                    </>
                  )}

                  <div className="mt-4">
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5">Existing Questions</CardTitle>

                {loading && <p>Loading questions...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && questions.length === 0 && (
                  <p>No questions found.</p>
                )}

                <ListGroup className="mt-3">
                  {questions.map((q, index) => (
                    <ListGroupItem key={index}>
                      <i className="ri-question-answer-line align-middle me-2"></i>
                      <strong>Q{index + 1}:</strong> {q.question}
                      {q.choices?.length > 0 && (
                        <ul className="mt-2 ms-4 mb-0">
                          {q.choices.map((choice, i) => (
                            <li key={i}>• {choice}</li>
                          ))}
                        </ul>
                      )}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Questions;
