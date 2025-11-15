import React from 'react';
import './Counter.css';

const Counter = ({ count, total, daysAbroad, currentCountry, currentArea, currentYear }) => {
  return (
    <div className="counter-container">
      <div className="counter">
        <div className="counter-value">{count}</div>
        <div className="counter-label">
          {count === 1 ? 'Country Visited' : 'Countries Visited'}
        </div>
      </div>
      {daysAbroad !== undefined && (
        <div className="counter">
          <div className="counter-value">{daysAbroad}</div>
          <div className="counter-label">Days Abroad</div>
        </div>
      )}
      {currentCountry && (
        <div className="counter current-country-counter">
          <div className="counter-value">
            <div className="country-area-line">
              <span className="counter-year">{currentYear} </span>
              <span>{currentCountry}</span>
              {currentArea && <span className="counter-area"> ({currentArea})</span>}
            </div>
          </div>
          <div className="counter-label">Current Country</div>
        </div>
      )}
    </div>
  );
};

export default Counter;
