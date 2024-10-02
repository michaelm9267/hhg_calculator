import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import NTSCalculator from './frontend/Components/NTSCalculator.js';
import PPM_Calculator from './frontend/Components/PPM_Calculator.jsx';
import Layout from './frontend/Layout/Layout.js';

function App() {
const url= "http://localhost:8080";
const [data, setData] = useState(null);

  return (
      <Router>
    <div className="App">
        <Layout>
        <Routes>
          <Route path="/NTSCalulator" element={<NTSCalculator url={url} data={data} setData={setData} />} />
          <Route path="/PPMCalulator" element={<PPM_Calculator url={url} data={data} setData={setData} />} />
        </Routes>
        
        </Layout> 
    </div>
      </Router>
  );
}

export default App;
