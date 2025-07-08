import React, { useState } from 'react';
import './App.css';
import { BsArrowRepeat } from "react-icons/bs";


function App() {
  const [scenario, setScenario] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });

      const data = await res.json();

      // Display the single prediction
      if (data.prediction) {
        setPrediction(data.prediction);
      } else {
        setPrediction(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setPrediction(null);
    }
  };

  return (
    <div className='App' style={{ backgroundImage: `url("somethingsbackdrop.png")` }}> 
      <div className='Container'>
        <div className="backdrop">
          {/* <img src={"logo-white.png"} alt="logo" className="logo" /> */}
          <a href="https://somethings.com" target="_blank" rel="noopener noreferrer">
            <img src={"logo-white.png"} alt="logo" className="logo" />
          </a>
          {!prediction ? (
            <form onSubmit={handleSubmit} className="form animate-zoom-in">
              <h1>What Will Happen?</h1>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter a scenario..."
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
                <button type="submit">👀</button>
              </div>
            </form>
          ) : (
            <div className="result animate-zoom-in">
              <p className="prediction_outcome">{prediction.outcome}</p>
              {prediction.probability !== "" && (
                  <p className="prediction_probability">
                    {`${prediction.probability}% chance`}
                  </p>
                )}
              <p className="prediction_reasoning">{prediction.reasoning}</p>
              <button
                className="ask-another"
                onClick={() => {
                  setPrediction(null);
                  setScenario('');
                }}
              >
                <BsArrowRepeat /> Ask Another
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="footer">
        <p>Real life is full of surprises! ✨</p>
      </div>
    </div>
  );
}

export default App;