import React from 'react';
import './Animation.css'; // make sure this path is correct

const Animation = () => {
  return (
    <div className="calendar-wrapper">
      {/* Bank icon */}
      <div className="bank-icon">🏛️</div>

      {/* Calendar */}
      <div className="calendar">
        <div className="tabs">
          <div className="tab"></div>
          <div className="tab"></div>
        </div>

        <div className="calendar-header">Month</div>

        <div className="calendar-body">
          {[1, 2, 3].map((n) => (
            <div key={n} className="circle gold">
              ⭐
            </div>
          ))}
          <div className="circle dark">4</div>
          <div className="circle dark">5</div>
        </div>
      </div>
    </div>
  );
};

export default Animation;
