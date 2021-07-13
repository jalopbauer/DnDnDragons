import React, { useState, useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/authService";
import { Typography } from "@material-ui/core";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert-danger" role="alert">
        <p>This field is required!</p>
      </div>
    );
  }
};

const LogIn = ({setCurrentPage}) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [successful, setSuccessful] = useState(false);

  const history = useHistory();

  useEffect(() => setCurrentPage(": Log In"));

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        (response) => {
          // console.log(result.message);
          // console.log(result.response.status);
          // console.log('result 1 ' + result);
          // console.log('result 1 object keys ' + Object.getOwnPropertyNames(result));
          // console.log('result 2 ' + result.response);
          if(response.response && response.response.status == 401) {
            setMessage('Sorry, your password or your user was incorrect');
            setLoading(false);
          } else if(JSON.parse(localStorage.getItem('user'))) {
            setLoading(false);
            history.push('/');
            window.location.reload();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setLoading(false);
          setMessage(resMessage);
        }
      )
      .catch((error) => {
        console.log(error);
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div style={{width: '25%'}} className="auth-container">
        <Typography className="welcome" variant="h3">Welcome</Typography>
        <Form onSubmit={handleLogin} autoComplete="off" ref={form} >
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
                  validations={[required]}
                  autoFocus={true}
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
                  validations={[required]}
                  autoComplete='off'
                  style={{width: '100%', fontSize: 24}}
                />
              </div>
              <div className="form-group">
                <button className="btn" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Log in</span>
                </button>
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

export default LogIn;
