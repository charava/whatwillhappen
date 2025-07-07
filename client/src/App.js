import React, { useState } from 'react';
import './App.css';

function App() {
  const [scenario, setScenario] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });

  
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error('Error:', err);
      setPrediction("Something went wrong. Try again!");
    }
  };

  return (
    <div className="container">
      <h1>What Will Happen? 🔮</h1>
      <p className="description">
        A fun, predictive tool where teens describe a situation (like “If I text my ex...”) and get playful GPT-style predictions with funny odds and emoji reactions.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a scenario..."
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />
        <button type="submit">Predict</button>
      </form>
      {prediction && <div className="result">{prediction}</div>}
    </div>
  );
}

export default App;
