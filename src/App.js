import React, { useState } from 'react';
import './App.css';
import NTSCalculator from './frontend/Components/NTSCalculator.js';
import Layout from './frontend/Layout/Layout.js';

function App() {
const url= "http://localhost:8080";
const [data, setData] = useState(null);

  return (
    <div className="App">
      <Layout>
      <NTSCalculator
      url={url}
      data={data}
      setData={setData}
      />
      </Layout> 
    </div>
  );
}

export default App;
