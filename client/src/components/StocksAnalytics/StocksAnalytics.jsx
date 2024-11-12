import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

import './stocksAnalytics.css';

// Chart.register(CategoryScale);

const StocksAnalytics = () => {
  const [stocksData, setStocksData] = useState([]);

  const fetchStocksData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/stockTrade/stockTrades");
      const data = response.data.stockTrades;
      console.log("Stocks Data: ", data);
      setStocksData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchStocksData();
  }, []);

  const createPNLChartData = () => {
    const sortedData = stocksData.sort((a, b) => new Date(a.dateSold) - new Date(b.dateSold));

    const formattedDates = sortedData.map(trade => {
      const date = new Date(trade.dateSold);
      const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric' }).format(date); // Format date as MM/DD
      return formattedDate;
  });

    const accountBalanceData = sortedData.map(trade => parseFloat(trade.accountBalance));


    return {
        labels: formattedDates,
        datasets: [
            {
                label: 'Account Balance',
                data: accountBalanceData,
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const balance = accountBalanceData[index];
                  return balance < 10000 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)';
              },
              fill: {
                  target: {
                    value: 10000
                },
                above: 'rgba(75, 192, 192, 0.2)',
                below: 'rgba(255, 99, 132, 0.2)'
            },
            borderWidth: 2,
            pointRadius: 0,

            },
        ],
        options: {
          scales: {
              x: {
                  grid: {
                      display: false 
                  }
              },
              y: {
                  ticks: {
                      callback: function(value) {
                          return value >= 1000 ? (value / 1000) + 'k' : value; 
                      }
                  }
              }
          }
      }
    };
  };

  const calculateProfitLossPerSector = () => {
    const profitLossPerSector = {};
    stocksData.forEach(trade => {
      const sector = trade.selectCategory;
      const profitLoss = parseFloat(trade.profitOrLoss);
      profitLossPerSector[sector] = (profitLossPerSector[sector] || 0) + profitLoss;
    });
    return profitLossPerSector;
  };

  const createBarChartData = () => {
    const profitLossPerSector = calculateProfitLossPerSector();
    const labels = Object.keys(profitLossPerSector);
    const data = Object.values(profitLossPerSector);
    const backgroundColors = data.map(profitLoss => profitLoss < 0 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)');
    const borderColors = data.map(profitLoss => profitLoss < 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)');
    return {
      labels: labels,
      datasets: [{
        label: 'PnL',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    };
  };

  const countTradesByCategory = () => {
    const tradeCountByCategory = {};
    stocksData.forEach(trade => {
      const category = trade.selectCategory;
      tradeCountByCategory[category] = (tradeCountByCategory[category] || 0) + 1;
    });
    return tradeCountByCategory;
  };

  const createPieChartData = () => {
    const tradeCountByCategory = countTradesByCategory();
    const labels = Object.keys(tradeCountByCategory);
    const data = Object.values(tradeCountByCategory);
  
    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        cutout: '50%',
      }],
    };
  };
  
  const createPieChartOptions = () => {
    return {
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `Trades: ${value}`;
            }
          }
        },
        cutout: '90%',
      },
      maintainAspectRatio: false
    };
  };

  const calculateHoldPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const createHoldPeriodChartData = () => {
    const holdPeriodData = stocksData.map(trade => {
      const holdPeriod = calculateHoldPeriod(trade.dateBought, trade.dateSold);
      return {
        ticker: trade.ticker,
        holdPeriod: holdPeriod
      };
    });

    holdPeriodData.sort((a, b) => b.holdPeriod - a.holdPeriod);

    const labels = holdPeriodData.map(item => item.ticker);
    const data = holdPeriodData.map(item => item.holdPeriod);

    return {
      labels: labels,
      datasets: [{
        label: 'Average Hold Period (Days)',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  };
  
  

  return (
    <div className="stocks-analytics-container">
      <div className="chart">
        {/* <h4>Profit and Loss Chart</h4> */}
        <Line data={createPNLChartData()} />
      </div>
      <div className="chart">
        {/* <h4>Profit and Loss by Sector</h4> */}
        <Bar data={createBarChartData()} />
      </div>
      <div className="chart">
        {/* <h4>Hold Period by Ticker</h4> */}
        <Bar
          data={createHoldPeriodChartData()}
          options={{
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                beginAtZero: true 
              }
            }
          }}
        />
      </div>
      <div className="category-chart">
        <Doughnut data={createPieChartData()} options={createPieChartOptions()} />
      </div>
    </div>
  );
};

export default StocksAnalytics;
