import React from 'react';

const Spinner = () => {

    const style = `.spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
      }
      
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3; /* Light grey */
        border-top: 5px solid #3498db; /* Blue */
        border-radius: 50%;
        animation: spin 1s linear infinite; /* Animation */
      }
      
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      `

  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <style>{style}</style>
    </div>
  );
};

export default Spinner;
