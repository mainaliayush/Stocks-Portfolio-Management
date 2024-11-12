import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './login.css'; 
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login_img from '../../images/login_img.png'

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isLoggedIn, setIsLoggedInState] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem("userData", JSON.stringify(data));
        setIsLoggedIn(true);
        setIsLoggedInState(true);
        console.log("Data:", data);
      } else if (response.status === 401 && data.message === "Invalid username or password!") {
        toast.error("Wrong username/password!");
        setIsWrongPassword(true);
      } else {
        console.error("Error:", data.message);
      }      

      if (data.result && data.result._id.length) {
        localStorage.setItem("userData", JSON.stringify(data));
        setIsLoggedIn(true);
        setIsLoggedInState(true);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoggedIn && <Navigate to="/" />}
      <div className="login-container">
        <div className="login-image">
          <img src={Login_img} alt="Login" />
        </div>
        <div className="login-form">
          <div className='login-header'>
            Log In to your account
          </div>
          <div className="sign-up">Don't have an account? <Link to="/signup">Sign up</Link></div>
          <div className="login-body">
            {isWrongPassword && (
              <ToastContainer position="top-right" />
              // <Alert icon={<ErrorIcon fontSize="inherit" className="error-div" />} severity="error">
              //   Wrong username/password!
              // </Alert>
            )}
            <form onSubmit={handleSubmit} className="form-element">
              <div className="input-group">
                <input type="text" className="input-field" id="username" value={username} placeholder="Username" onChange={handleUsernameChange} required />
              </div>
              <div className="input-group">
                <input type="password" className="input-field" id="password" value={password} placeholder="Password" onChange={handlePasswordChange} required />
              </div>
              <button type="submit" className='login-button'>Login</button>
            </form>
            <div className="forgot-password">
              Forgot your password? <span><a href="/">Reset your password</a></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
