import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

function UserRegister() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => setMessage("");
  }, []);

  const emailValidationRegex =
    /^(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;'"<>,.?/~`|\\])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;'"<>,.?/~`|\\]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
      password2: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),

      email: Yup.string()
        .matches(
          emailValidationRegex,
          "Email must contain at least one lowercase letter, one special character, and be in a valid email format"
        )
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(10, "Password must be at least 10 characters long"),

      password2: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("http://127.0.0.1:5555/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        setMessage(data.msg);

        if (response.ok) {
          resetForm();
          navigate("/login");
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    },
  });

  return (
    <>
      <div className="login-wrapper">
        <div className="all-logins-container">
          <div className="form-signin">
            <h1 className="h3 mb-3 fw-normal">User Registration</h1>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-floating">
                <br />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter a Username"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className="form-control"
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="user-signup-error-message">
                    {formik.errors.username}
                  </div>
                ) : null}
                <label htmlFor="username">Username</label>
              </div>
              <br />
              <div className="form-floating">
                <br />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="form-control"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="user-signup-error-message">
                    {formik.errors.email}
                  </div>
                ) : null}
                <label htmlFor="email">Email Address</label>
              </div>
              <div className="form-floating">
                <br />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="form-control"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="user-signup-error-message">
                    {formik.errors.password}
                  </div>
                ) : null}
                <label htmlFor="password">Password</label>
              </div>{" "}
              <br />
              <div className="form-floating">
                <br />
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password2}
                  className="form-control"
                />
                {formik.touched.password2 && formik.errors.password2 ? (
                  <div className="user-signup-error-message">
                    {formik.errors.password2}
                  </div>
                ) : null}
                <label htmlFor="password2">Confirm Password</label>
              </div>
              <button
                type="submit"
                disabled={!formik.isValid}
                className="w-100 btn btn-lg btn-primary"
              >
                Register
              </button>
            </form>
            {message && <p className="user-signup-message">{message}</p>}
            <div className="join-link-div">
              Already on RevRescue?
              <Link to="/login" className="join-link">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegister;
