import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const stocks =
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v1/open-close/AAPL/2023-01-09?adjusted=true&apiKey=xaE8FzKFab5HAdjoqW_yBCecCXyu3jgU');
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  useEffect(() => {
    console.log("Stock Data: ", stockData);
  }, [stockData]);

  return (
    <div>
     
    </div>
  );
};

export default YourComponent;
