import React, { useState } from 'react';
import './App.css';
import NTSCalculator from './frontend/Components/NTSCalculator.js';

function App() {
const url= "http://localhost:8080";
const [data, setData] = useState(null);

  return (
    <div className="App">
      <NTSCalculator
      url={url}
      data={data}
      setData={setData}
      />
    </div>
  );
}

export default App;
