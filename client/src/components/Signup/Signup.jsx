import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './signup.css';
import SignUp_img from '../../images/login_img.png'

import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const Signup = () => {
  const [isUserCreationSuccess, setIsUserCreationSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.status === 201) {
        setIsUserCreationSuccess(true);
        console.log("Data:", data);
      } else if (response.status === 400 && data.message === "User already exists!") {
        console.log("User already exists");
      } else {
        console.error("Error:", data.message);
      }

      console.log("Data:", data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-image">
          <img src={SignUp_img} alt="Sign Up" />
        </div>
        <div className="signup-form">
          <div className='signup-header'>
            Sign Up
          </div>
          <div className="signup-body">
            {isUserCreationSuccess && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                New user successfully created!
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" className="input-field" id="first-name" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} required />
                <input type="text" className="input-field" id="last-name" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <input type="text" className="input-field" id="username" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <input type="password" className="input-field" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                <input type="password" className="input-field" id="confirm-password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
              <div className="checkbox">
                <input type="checkbox" id="terms-checkbox" required />
                <label htmlFor="terms-checkbox">I have agreed to the <a href="#">Terms and Conditions</a></label>
              </div>
              <button type="submit" className='signup-button'>Sign Up</button>
            </form>
            <div className="sign-up">Already a user? <Link to="/login">Login</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
