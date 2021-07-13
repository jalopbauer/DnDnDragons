import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { useHistory } from 'react-router-dom';

import AuthService from "../services/authService";
import { Typography } from "@material-ui/core";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const SignIn = ({setCurrentPage}) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [successful, setSuccessful] = useState(false);

  const history = useHistory();

  useEffect(() => setCurrentPage(": Sign Up"));

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleError = (error) => {
    const resMessage =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();

    setMessage(resMessage.substring(7));
    setSuccessful(false);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          AuthService.login(username, password).then(
            () => {
              history.push('/');
              window.location.reload();
            },
            (error) => handleError(error)
          );
        },
        (error) => handleError(error)
      );
    }
  };

  return (
    <div className="col-md-12">
      <div style={{width: '25%'}} className="auth-container">
      <Typography className="welcome" variant="h3">Welcome</Typography>

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username"><Typography variant="h5">Username</Typography></label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                  autoFocus={true}
                  autoComplete='off'
                  style={{width: '100%', fontSize: 24}}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email"><Typography variant="h5">Email</Typography></label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                  autoComplete='off'
                  style={{width: '100%', fontSize: 24}}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password"><Typography variant="h5">Password</Typography></label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                  autoComplete='off'
                  style={{width: '100%', fontSize: 24}}
                />
              </div>

              <div className="form-group">
                <button className="btn">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group" style={{marginTop: '8px'}}>
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                { successful ? <Typography>{message}</Typography> : message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default SignIn;