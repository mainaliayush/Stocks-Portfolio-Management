import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsightsIcon from '@mui/icons-material/Insights';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsIcon from '@mui/icons-material/Settings';

import './sidebar.css';

const sidebarList = [
  { text: 'Home', icon: <HomeIcon />, link: '/homepage' },
  { text: 'Ask AI', icon: <EngineeringIcon />, link: '/ask-AI' },

  { type: 'divider' },
  { type: 'header', text: 'Options' },
  { text: 'Options Journal', icon: <CandlestickChartIcon />, link: '/options-journal' },
  { text: 'Options Calender', icon: <CalendarMonthIcon />, link: '/options-calender' },
  { text: 'Options Analytics', icon: <AnalyticsIcon />, link: '/options-analytics' },
  { type: 'divider' },
  { type: 'header', text: 'Stocks' },
  { text: 'Stocks Journal', icon: <InsightsIcon />, link: '/stocks-journal' },
  { text: 'Current Holdings', icon: <DonutLargeIcon />, link: '/stocks-holdings' },
  { text: 'Stocks Analytics', icon: <AnalyticsIcon />, link: '/stocks-analytics' },
  { type: 'divider' },
  { type: 'header', text: 'Others' },
  { text: 'Premium', icon: <MilitaryTechIcon />, link: '/premium' },
  { text: 'Help', icon: <HelpCenterIcon />, link: '/help' },
  { text: 'Settings', icon: <SettingsIcon />, link: '/settings' },
];

const Sidebar = ({ onSidebarItemClick }) => {
  const handleClick = (item) => {
    console.log("Click -> ", item)
    onSidebarItemClick(item);
  };

  return (
    <div className="sidebar">
      {sidebarList.map((item, index) => {
        if (item.type === 'header') {
          return <div key={index} className="sidebar-header">{item.text}</div>;
        } else if (item.type === 'divider') {
          return <div key={index} className="sidebar-divider" />;
        } else {
          return (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <div onClick={() => handleClick(item)}>
                <span className="icon">{item.icon}</span> {item.text}
              </div>
            </NavLink>
          );
        }
      })}
    </div>
  );
};

export default Sidebar;
