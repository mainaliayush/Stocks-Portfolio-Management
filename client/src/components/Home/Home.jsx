// // Home.js
// import React, { useState } from 'react';
// import './home.css';
// import Sidebar from "../Sidebar/Sidebar";
// import {Routes, Route} from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';

// import Ask_AI from '../Ask_AI/Ask_AI';
// import OptionsTable from "../OptionsTable/OptionsTable";
// import OptionsCalender from "../OptionsCalender/OptionsCalender";
// import StocksPortfolio from "../StocksPortfolio/StocksPortfolio";
// import OptionsAnalytics from "../OptionsAnalytics/OptionsAnalytics";
// import StocksTable from "../StocksTable/StocksTable";
// import StocksAnalytics from "../StocksAnalytics/StocksAnalytics";
// import Premium from "../Premium/Premium";
// import Help from "../Help/Help";
// import Settings from "../Settings/Settings";
// import HomePage from '../HomePage/HomePage';

// const Home = ({setIsLoggedIn}) => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleSidebarItemClick = (item) => {
//     console.log("Selected Item:", item);
//     setSelectedItem(item);
//   };

//   return (
//     <div>
//       <Navbar setIsLoggedIn={setIsLoggedIn} />
//       <div className="home-container">
//         <div className="sidebar-container">
//           <Sidebar onSidebarItemClick={handleSidebarItemClick} />
//         </div>
//         <div className="render-container">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/homepage" element={<HomePage />} />
//             <Route path="/ask-AI" element={<Ask_AI />} />

//             <Route path="/options-journal" element={<OptionsTable />} />
//             <Route path="/options-calender" element={<OptionsCalender />} />
//             <Route path="/options-analytics" element={<OptionsAnalytics />} />
            
//             <Route path="/stocks-journal" element={<StocksTable />} />
//             <Route path="/stocks-holdings" element={<StocksPortfolio />} />
//             <Route path="/stocks-analytics" element={<StocksAnalytics />} />

//             <Route path="/premium" element={<Premium />} />
//             <Route path="/help" element={<Help />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
