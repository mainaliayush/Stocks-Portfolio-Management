import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar, Bubble } from 'react-chartjs-2';
import axios from 'axios';
import './optionsAnalytics.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const OptionsAnalytics = () => {
  const [optionsData, setOptionsData] = useState([]);

  const fetchOptionsData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/optionsTrade/optionTrades');
      const data = response.data.optionsTrades;
      console.log('Options Data: ', data);
      setOptionsData(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchOptionsData();
  }, []);

  const calculateCategoryStats = () => {
    const categoryStats = {};

    optionsData.forEach((trade) => {
      const { selectOptionsCategory: category, optionsPercentProfitLoss: profitLoss } = trade;

      if (!categoryStats[category]) {
        categoryStats[category] = { totalProfitLoss: 0, count: 0 };
      }

      categoryStats[category].totalProfitLoss += profitLoss;
      categoryStats[category].count += 1;
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      averageProfitLoss: stats.totalProfitLoss / stats.count,
      frequency: stats.count,
    }));
  };

  const getColor = (value) => {
    const green = 'rgba(75, 192, 192, 0.6)';
    const red = 'rgba(255, 99, 132, 0.6)';
    return value >= 0 ? green : red;
  };

  const categoryStats = calculateCategoryStats();

  const categoryBubbleChartData = {
    datasets: [
      {
        label: false,
        data: categoryStats.map((stat) => ({
          x: Math.random() * 150,
          y: Math.random() * 150, 
          r: stat.frequency * 25, 
          category: stat.category,
          averageProfitLoss: stat.averageProfitLoss,
        })),
        backgroundColor: categoryStats.map((stat) => getColor(stat.averageProfitLoss)),
        hoverBackgroundColor: categoryStats.map((stat) => getColor(stat.averageProfitLoss)),
      },
    ],
  };

  const categoryBubbleChartOptions = {
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const { category, averageProfitLoss, r } = context.raw;
            return `Category: ${category}\nAvg ${averageProfitLoss > 0 ? `Profit`: `Loss`}: ${averageProfitLoss.toFixed(2)}%\nTrades: ${r / 25}`;
          },
        },
      },
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            const labels = [
              {
                text: 'Profit',
                fillStyle: 'rgba(75, 192, 192, 0.6)',
              },
              {
                text: 'Loss',
                fillStyle: 'rgba(255, 99, 132, 0.6)'
              },
            ];
            // 'rgba(75, 192, 192, 0.6)',
            // 'rgba(255, 99, 132, 0.6)'
            return labels;
          },
        },
      },
    },
    elements: {
      point: {
        display: true,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
      },
    },
  };
  

  const lineChartData = () => {
    const sortedData = optionsData.sort((a, b) => new Date(a.optionsDateSold) - new Date(b.optionsDateSold));

    const formattedDates = sortedData.map(trade => {
      const date = new Date(trade.optionsDateSold);
      return new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric' }).format(date);
    });

    const accountBalanceData = sortedData.map(trade => parseFloat(trade.accountBalance));

    return {
      labels: formattedDates,
      datasets: [
        {
          label: 'Account Balance',
          data: accountBalanceData,
          borderColor: 'rgba(75, 192, 192, 1)',
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
    };
  };

  const lineChartOptions = {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const countCallsPuts = () => {
    const tradeCountByCategory = {};
    optionsData.forEach(trade => {
      const category = trade.selectOptionsType;
      tradeCountByCategory[category] = (tradeCountByCategory[category] || 0) + 1;
    });
    return tradeCountByCategory;
  };

  const countProfitLoss = () => {
    let totalProfit = 0;
    let totalLoss = 0;

    optionsData.forEach(trade => {
      const profitLoss = trade.optionsProfitLoss;
      if (profitLoss > 0) {
        totalProfit += profitLoss;
      } else {
        totalLoss += Math.abs(profitLoss);
      }
    });

    return {
      totalProfit,
      totalLoss,
    };
  };

  const callPutDoughnut = () => {
    const tradeCountByCategory = countCallsPuts();
    const labels = Object.keys(tradeCountByCategory);
    const data = Object.values(tradeCountByCategory);

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        cutout: '70%',
      }],
    };
  };

  const profitLossDoughnut = () => {
    const { totalProfit, totalLoss } = countProfitLoss();
    const labels = ['Profit', 'Loss'];
    const data = [totalProfit, totalLoss];

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        cutout: '70%',
      }],
    };
  };

  const createPieChartOptions = (title) => {
    return {
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: false,
          text: title,
          font: {
            size: 20,
          },
          align: 'start',
          padding: 1,
          color: 'grey',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `Trades: ${value}`;
            },
          },
        },
      },
      maintainAspectRatio: false,
    };
  };

  const getBestAndWorstTrades = (trades) => {
    const sortedTrades = trades.sort((a, b) => b.optionsProfitLoss - a.optionsProfitLoss);
    const bestTrades = sortedTrades.slice(0, 5);
    const worstTrades = sortedTrades.slice(-5);

    return {
      bestTrades,
      worstTrades,
    };
  };

  const { bestTrades, worstTrades } = getBestAndWorstTrades(optionsData);

  const barChartLabels = [
    ...bestTrades.map(trade => trade.optionsTicker),
    ...worstTrades.map(trade => trade.optionsTicker),
  ];
  const barChartDataPoints = [
    ...bestTrades.map(trade => trade.optionsProfitLoss),
    ...worstTrades.map(trade => trade.optionsProfitLoss),
  ];

  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        label: 'Trade Profit',
        data: barChartDataPoints,
        backgroundColor: barChartDataPoints.map(profit =>
          profit > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        hoverBackgroundColor: barChartDataPoints.map(profit =>
          profit > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'
        ),
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `$${value}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="options-analytics-container">
      <div className="top-container">
        <div className="portfolio-linegraph">
          <div className="chart-header">Account Balance Over Time</div>
          <Line data={lineChartData()} options={lineChartOptions} />
        </div>
        <div className="profit-loss-doughnut">
          <div className="chart-header">Profit to Loss Ratio</div>
          <Doughnut data={profitLossDoughnut()} options={createPieChartOptions('Profit/Loss Ratio')} />
        </div>
        <div className="call-put-doughnut">
          <div className="chart-header">Call to Put Ratio</div>
          <Doughnut data={callPutDoughnut()} options={createPieChartOptions('Call/Put Ratio')} />
        </div>
      </div>
      <div className="middle-container">
        <div className="profit-loss-category">
          <div className="chart-header">Top 5 Winners Vs Losers</div>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="category-bubble">
          <div className="chart-header">Comparison by Category</div>
          <Bubble data={categoryBubbleChartData} options={categoryBubbleChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default OptionsAnalytics;
