import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import CryptoJS from "crypto-js";

//redux
import { useSelector, useDispatch } from "react-redux";
import { loginUser, resetLoginFlag } from "../../slices/thunks";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

const LoginForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(false);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(6, "Password must be at least 6 characters long"),
    }),
    onSubmit: async (values) => {
      const hashedPassword = CryptoJS.SHA256(values.password).toString(
        CryptoJS.enc.Base64
      );
      await onSubmit(values.email, hashedPassword);
    },
  });

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
        action="#"
      >
        <div className="mb-3">
          <Label htmlFor="email" className="form-label">
            Email
          </Label>
          <Input
            name="email"
            className="form-control"
            placeholder="Enter email"
            type="email"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.email || ""}
            invalid={
              validation.touched.email && validation.errors.email ? true : false
            }
          />
          {validation.touched.email && validation.errors.email ? (
            <FormFeedback type="invalid">
              {validation.errors.email}
            </FormFeedback>
          ) : null}
        </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="password-input">
            Password
          </Label>
          <div className="position-relative auth-pass-inputgroup mb-3">
            <Input
              name="password"
              value={validation.values.password || ""}
              type={passwordShow ? "text" : "password"}
              className="form-control pe-5"
              placeholder="Enter Password"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.password && validation.errors.password
                  ? true
                  : false
              }
            />
            {validation.touched.password && validation.errors.password ? (
              <FormFeedback type="invalid">
                {validation.errors.password}
              </FormFeedback>
            ) : null}
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
              type="button"
              onClick={() => setPasswordShow(!passwordShow)}
              id="password-addon"
            >
              <i className="ri-eye-fill align-middle"></i>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Button
            color="success"
            disabled={validation.isSubmitting}
            className="btn btn-success w-100"
            type="submit"
          >
            {validation.isSubmitting ? (
              <Spinner size="sm" className="me-2">
                {" "}
                Loading...{" "}
              </Spinner>
            ) : null}
            Sign In
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
