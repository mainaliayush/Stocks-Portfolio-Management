import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './optionsCalender.css';

const OptionsCalender = () => {
  // Sample trading data for the entire month of May 2024
  const tradingData = [
    { date: 'Wed May 01 2024', pnl: 150 },
    { date: 'Thu May 02 2024', pnl: -50 },
    { date: 'Fri May 03 2024', pnl: 100 },
    { date: 'Mon May 06 2024', pnl: 200 },
    { date: 'Tue May 07 2024', pnl: -1200 },
    { date: 'Wed May 08 2024', pnl: 0 },
    { date: 'Thu May 09 2024', pnl: 250 },
    { date: 'Fri May 10 2024', pnl: 300 },
    { date: 'Mon May 13 2024', pnl: -200 },
    { date: 'Tue May 14 2024', pnl: 100 },
    { date: 'Wed May 15 2024', pnl: 150 },
    { date: 'Thu May 16 2024', pnl: 0 },
    { date: 'Fri May 17 2024', pnl: -150 },
    { date: 'Mon May 20 2024', pnl: 200 },
    { date: 'Tue May 21 2024', pnl: -50 },
    { date: 'Wed May 22 2024', pnl: 0 },
    { date: 'Thu May 23 2024', pnl: 300 },
    { date: 'Fri May 24 2024', pnl: 100 },
    { date: 'Mon May 27 2024', pnl: -75 },
    { date: 'Tue May 28 2024', pnl: 0 },
    { date: 'Wed May 29 2024', pnl: 200 },
    { date: 'Thu May 30 2024', pnl: -100 },
    { date: 'Fri May 31 2024', pnl: 150 },
  ];

  const getPnL = (date) => {
    if (tradingData && tradingData.length > 0) {
      const trade = tradingData.find((trade) => trade.date === date.toDateString());
      return trade ? trade.pnl : 'No Trade';
    }
    return 'No Trade';
  };

  const tileDisabled = ({ date, view }) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const pnl = getPnL(date);
      if (pnl !== 'No Trade') {
        const profitOrLossClass = pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : 'neutral';
        const displayPnl = pnl === 0 ? '0' : Math.abs(pnl);
        return (
          <div className={`day-tile ${profitOrLossClass}`}>
            <span className="pnl-amount">${displayPnl}</span>
          </div>
        );
      } else {
        return (
          <div className="day-tile no-trade">
            {/* <span className="pnl-amount">No Trade</span> */}
          </div>
        );
      }
    }
    return null; 
  };

  return (
    <div className="options-calendar">
      <Calendar
        calendarType="US"
        tileDisabled={tileDisabled}
        tileContent={tileContent}
        onClickDay={() => null}
      />
    </div>
  );
};

export default OptionsCalender;
