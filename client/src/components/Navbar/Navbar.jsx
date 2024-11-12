import React from 'react';
import './navbar.css';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false); 
    navigate("/login");
  }

  return (
    <nav className="navbar-container">
      <h1 className="navbar-h1">TradeLikeGOD</h1>
      <div className="navbar-profile">
        <PublicIcon className="avatar-icon" sx={{ color: "black", fontSize: 30, cursor: "pointer" }} />
        {/* <Avatar className="avatar-icon" sx={{ color: "black", fontSize: 15, cursor: "pointer" }}>AM</Avatar> */}
        <LogoutIcon onClick={handleLogout} className="logout-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
