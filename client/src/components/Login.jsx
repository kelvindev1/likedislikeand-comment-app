import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("Must enter a password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("http://127.0.0.1:5555/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("RefreshToken", data.refresh_token);
            navigate("/homepage");
            resetForm();
          } else {
            alert(data.msg);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
        });
    },
  });

  return (
    <>
      <div className="login-wrapper">
        <div className="all-logins-container">
          <div className="form-signin">
            <form onSubmit={formik.handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">User Signin</h1>
              <div className="form-floating">
                <br />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="error-message">{formik.errors.email}</p>
                ) : null}
                <label htmlFor="email">Email Address</label>
              </div>{" "}
              <br />
              <div className="form-floating">
                <br />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  required
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="error-message">{formik.errors.password}</p>
                ) : null}
                <label htmlFor="password">Password</label>
              </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Sign in
              </button>
            </form>
            <p className="register-link-p">
              {" "}
              New ?
              <Link to="/register" className="register-link">
                Join now
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
