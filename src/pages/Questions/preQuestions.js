import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Input,
  Label,
  FormGroup,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const PreQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/questions/`
        );
        setQuestions(res);
      } catch (err) {
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value, type) => {
    if (type === "checkbox") {
      const current = userAnswers[questionId] || [];
      setUserAnswers({
        ...userAnswers,
        [questionId]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      });
    } else {
      setUserAnswers({ ...userAnswers, [questionId]: value });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const allAnswered = questions.every((q) => {
    const ans = userAnswers[q.id];
    return q.type === "checkbox" ? ans && ans.length > 0 : !!ans;
  });

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError("Please fill out all questions before submitting.");
      return;
    }
    sessionStorage.setItem("preAnswers", JSON.stringify(userAnswers));
    setSubmitLoading(true);
    setError("");

    setTimeout(() => {
      setSubmitted(true);
      setSubmitLoading(false);
      navigate('/register');
    }, 1000); 
  };

  const renderInput = (q) => {
    switch (q.type) {
      case "text":
        return (
          <Input
            type="text"
            value={userAnswers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value, "text")}
          />
        );
      case "radio":
        return q.choices.map((choice, i) => (
          <FormGroup check key={i}>
            <Input
              type="radio"
              name={`radio-${q.id}`}
              checked={userAnswers[q.id] === choice}
              onChange={() => handleAnswerChange(q.id, choice, "radio")}
            />
            <Label check>{choice}</Label>
          </FormGroup>
        ));
      case "checkbox":
        return q.choices.map((choice, i) => (
          <FormGroup check key={i}>
            <Input
              type="checkbox"
              checked={(userAnswers[q.id] || []).includes(choice)}
              onChange={() => handleAnswerChange(q.id, choice, "checkbox")}
            />
            <Label check>{choice}</Label>
          </FormGroup>
        ));
      default:
        return null;
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="page-content">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col lg={8} md={10}>
            <Card className="mt-5 p-3" style={{ minHeight: "400px" }}>
              <CardBody
                className="d-flex flex-column justify-content-center align-items-start text-left"
                style={{ minHeight: "400px" }}
              >
                {/* Intro Section */}
                {showIntro && !submitted && (
                  <>
                    <h4>
                      Great, and how have you tried treating your condition?
                    </h4>
                    <p className="mb-4">
                      Let's start with a 30-second pre-screening. Tell us about
                      your condition and any previous treatment to determine if
                      plant alternatives are right for you.
                    </p>
                    <Button color="primary" onClick={() => setShowIntro(false)}>
                      Let’s Go
                    </Button>
                  </>
                )}

                {error && <Alert color="danger">{error}</Alert>}
                {/* Questions Section */}
                {!showIntro &&
                  !loading &&
                  questions.length > 0 &&
                  !submitted && (
                    <>
                      <h5 className="mb-3">
                        Q{currentIndex + 1}: {currentQuestion.question}
                      </h5>
                      <div className="w-100">
                        {renderInput(currentQuestion)}
                      </div>

                      <div className="d-flex justify-content-between mt-4 gap-5">
                        <Button
                          color="secondary"
                          onClick={handlePrevious}
                          disabled={currentIndex === 0}
                        >
                          Previous
                        </Button>

                        {currentIndex < questions.length - 1 ? (
                          <Button color="primary" onClick={handleNext}>
                            Next
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            onClick={handleSubmit}
                            disabled={submitLoading}
                          >
                            {submitLoading ? <Spinner size="sm" /> : "Submit"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}

                {loading && (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Loading questions...</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PreQuestions;
