import React, { useState, useEffect } from 'react';
import './homePage.css'; // Import CSS file for styling
import axios from 'axios';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newsArticles, setNewsArticles] = useState([]);

  const [watchlistData] = useState([
    { ticker: 'AAPL', price: 135.25, change: -0.75, changePercent: -0.55 },
    { ticker: 'MSFT', price: 252.20, change: 1.35, changePercent: 0.54 },
    { ticker: 'GOOG', price: 285.75, change: -4.25, changePercent: -0.16 },
    { ticker: 'TSLA', price: 183.90, change: 9.10, changePercent: 3.84 },
    { ticker: 'META', price: 273.30, change: -9.10, changePercent: -0.65 },
    { ticker: 'NFLX', price: 451.10, change: 22.70, changePercent: 0.99 },
    { ticker: 'JPM', price: 611.30, change: 12.10, changePercent: 1.34 },
    { ticker: 'NVDA', price: 911.30, change: 43.85, changePercent: 3.82 },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 
    return () => clearInterval(intervalId);
  }, []);

  const isMarketOpen = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours === 9 && minutes >= 30) || (hours > 9 && hours < 16) || (hours === 16 && minutes === 0);
  };

  const formatTime = () => {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return currentTime.toLocaleTimeString([], options);
  };

  const formatDate = () => {
    const month = currentTime.toLocaleString('default', { month: 'long' });
    const day = currentTime.getDate();
    return `${month} ${day}`;
  };

  const API_KEY = 'SOBPTWDIK9A3GLZP'; 
  const BASE_URL = 'https://www.alphavantage.co/query';

  const getStockNews = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'NEWS_SENTIMENT',
          sort: 'LATEST',
          limit: 50,
          apikey: API_KEY,
        },
      });
      return response.data.feed; 
    } catch (error) {
      console.error('Error fetching news data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      const articles = await getStockNews();
      setNewsArticles(articles.slice(0, 10));
    };
    fetchNews();
  }, []);

  return (
    <div className="homepage-container">
      <div className="upper-container-parent">
        <div className="greeting-time">
          <div className="date-time">
            <h1>Welcome, Trader!</h1>
            <div className="time"> {formatDate()}, {formatTime()} </div>
            <div className="time"> {isMarketOpen() ? "Market Open!" : "Market Closed!"}</div>
          </div>
        </div>
        <div className="portfolio-overview">
          <h3>Account Overview</h3>
          <div className="investment-portfolio">
            Investment Total: 
            <span className="value">${(53045 + (Math.random() * 600 - 300)).toFixed(2)}</span>
            <span className={`change ${Math.random() > 0.5 ? 'positive' : 'negative'}`}>
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
            </span>
          </div>
          <div className="stocks-trade-profit-loss">
            Stocks Trade PnL: 
            <span className="value">${(4500 + (Math.random() * 600 - 300)).toFixed(2)}</span>
            <span className={`change ${Math.random() > 0.5 ? 'positive' : 'negative'}`}>
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
            </span>
          </div>
          <div className="options-profit-loss">
            Options Trade PnL: 
            <span className="value">${(1500 + (Math.random() * 600 - 300)).toFixed(2)}</span>
            <span className={`change ${Math.random() > 0.5 ? 'positive' : 'negative'}`}>
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="news-container">
          <h3>Market Updates</h3>
          <div className="news-list">
            {newsArticles.map((article, index) => (
              <div key={index} className="news-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <h2>{article.title}</h2>
                </a>
                <p>{article.summary}</p>
                <p><strong>Source:</strong> {article.source}</p>
                <p><em>{new Date(article.time_published).toLocaleString()}</em></p>
              </div>
            ))}
          </div>
        </div>
        <div className="watchlist">
          <h3>Watchlist</h3>
          <div className="watchlist-items">
            {watchlistData.map((stock, index) => (
              <div key={index} className="watchlist-item">
                <div className="ticker">{stock.ticker}</div>
                <div className="price">${(stock.price).toFixed(2)}</div>
                <div className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {(stock.change).toFixed(2)} 
                </div>
                <div className="percentage-change">
                  ({stock.changePercent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
