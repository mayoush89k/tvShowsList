import React from 'react';
import './Spinner.css';

const Spinner = ({size , title}) => {
  return (
    <div className="spinner-wrapper">
      <div className={size == "Big" ? "spinner big" : "small spinner"} />
      <p>Loading {title}</p>
    </div>
  );
};

export default Spinner;
