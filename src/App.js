import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import NTSCalculator, { getInitialNTS } from './frontend/Components/NTSCalculator';
import PPMCalculator, { initialMember } from './frontend/Components/PPM_Calculator';
import SITCalculator, { initialSIT } from './frontend/Components/SITCalculator';
import Layout from './frontend/Layout/layout';

const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#79d5c5', contrastText: '#102521' },
    secondary: { main: '#9aaff4' }, background: { default: '#101722', paper: '#192434' },
    text: { primary: '#e8eef5', secondary: '#aebfd0' }, error: { main: '#ffaaa0' },
    warning: { main: '#efc982' }, divider: '#314255' },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, sans-serif', h4: { fontWeight: 700 } },
  shape: { borderRadius: 10 },
  components: { MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 44 } } },
    MuiCheckbox: { styleOverrides: { root: { padding: 10 } } },
    MuiInputBase: { styleOverrides: { root: { fontSize: 16 } } },
    MuiFormControlLabel: { styleOverrides: { root: { marginLeft: -8, alignItems: 'flex-start' }, label: { fontSize: 14, lineHeight: 1.6, paddingTop: 9 } } } },
});
function App() {
  const [memberInfo, setMemberInfo] = useState(initialMember);
  const [govMoves, setGovMoves] = useState([]);
  const [weightTickets, setWeightTickets] = useState([]);
  const [nts, setNts] = useState(getInitialNTS);
  const [sit, setSit] = useState(initialSIT);
  return <ThemeProvider theme={theme}><CssBaseline /><HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Layout><Routes>
      <Route path="/ppm" element={<PPMCalculator {...{ memberInfo, setMemberInfo, govMoves, setGovMoves, weightTickets, setWeightTickets }} />} />
      <Route path="/sit" element={<SITCalculator form={sit} setForm={setSit} />} />
      <Route path="/SITCalulator" element={<Navigate to="/sit" replace />} />
      <Route path="/nts" element={<NTSCalculator form={nts} setForm={setNts} />} />
      <Route path="/PPMCalulator" element={<Navigate to="/ppm" replace />} />
      <Route path="/NTSCalulator" element={<Navigate to="/nts" replace />} />
      <Route path="*" element={<Navigate to="/ppm" replace />} />
    </Routes></Layout>
  </HashRouter></ThemeProvider>;
}
export default App;
