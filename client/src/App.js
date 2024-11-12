import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Ask_AI from './components/Ask_AI/Ask_AI';
import OptionsTable from "./components/OptionsTable/OptionsTable";
import OptionsCalender from "./components/OptionsCalender/OptionsCalender";
import StocksPortfolio from "./components/StocksPortfolio/StocksPortfolio";
import OptionsAnalytics from "./components/OptionsAnalytics/OptionsAnalytics";
import StocksTable from "./components/StocksTable/StocksTable";
import StocksAnalytics from "./components/StocksAnalytics/StocksAnalytics";
import Premium from "./components/Premium/Premium";
import Help from "./components/Help/Help";
import Settings from "./components/Settings/Settings";
import HomePage from './components/HomePage/HomePage';

import './App.css'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('userData');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSidebarItemClick = (item) => {
    console.log("Selected Item:", item);
    setSelectedItem(item);
  };

  return (
    <BrowserRouter>
      <div className="app">
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        <div className="body-container" style={{display: 'flex'}}>
          {isLoggedIn && (
            <div className="sidebar-container" style={{width:'220px'}}>
              <Sidebar onSidebarItemClick={handleSidebarItemClick} />
            </div>
          )}
          <div className="render-container">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    {/* <Home setIsLoggedIn={setIsLoggedIn} /> */}
                    <OptionsTable />
                  </ProtectedRoute>
                }
              />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/ask-AI" element={<Ask_AI />} />
              <Route path="/options-journal" element={<OptionsTable />} />
              <Route path="/options-calender" element={<OptionsCalender />} />
              <Route path="/options-analytics" element={<OptionsAnalytics />} />
              <Route path="/stocks-journal" element={<StocksTable />} />
              <Route path="/stocks-holdings" element={<StocksPortfolio />} />
              <Route path="/stocks-analytics" element={<StocksAnalytics />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
