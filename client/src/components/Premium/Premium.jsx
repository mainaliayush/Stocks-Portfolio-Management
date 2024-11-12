import React from 'react';
import Button from 'react-bootstrap/Button';
import { Check, Close } from "@mui/icons-material";
import './premium.css';

const Premium = () => {
    return (
      <div className="upgrade-container">
        <div className="container">
          <div className="card">
            <div>
              <h2 className="title">Current Offering</h2>
              <p className="description">Your current plan includes the following features:</p>
            </div>
            <div className="feature-list">
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Basic Stocks trade analysis" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Basic Options trade analysis" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Trade Performance tracking" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Interactive Visualization Dashboard" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Profit and Loss Calender" />
              <FeatureItem icon={<Close style={{ color: 'red', margin: '0px 10px'}} />} text="Advanced backtesting and optimization" />
              <FeatureItem icon={<Close style={{ color: 'red', margin: '0px 10px'}} />} text="Automated trade execution" />

            </div>
          </div>
          <div className="card">
            <div>
              <h2 className="title">Premium Features</h2>
              <p className="description">Upgrade to premium to unlock these features:</p>
            </div>
            <div className="feature-list">
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Advanced charting and analysis tools" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Automated trade logging and analysis" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Comprehensive performance reporting" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Advanced backtesting and optimization" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Automated trade execution" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Generative AI for portfolio management" />
              <FeatureItem icon={<Check style={{ color: 'green', margin: '0px 10px'}} />} text="Unlimited Trade Imports from Brokerage" />

            </div>
            <div className="button-wrapper">
              <Button className="add-trade" variant="outline-dark" size="lg" onClick="" style={{fontSize:"20px", width: '100%'}}>
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
}

function FeatureItem({ icon, text }) {
  return (
    <div className="feature">
      {icon}
      <span className="feature-text">{text}</span>
    </div>
  );
}

export default Premium;
