import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
} from "@mui/material";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const GAM = ({ onTotalWeightChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [moves, setMoves] = useState([{ id: 0, method: '', weight: '', pbpe: '', totalWeight: '' }]);

  useEffect(() => {
    const totalWeight = moves.reduce((sum, move) => sum + parseFloat(move.totalWeight || 0), 0);
    onTotalWeightChange(totalWeight);
  }, [moves, onTotalWeightChange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addNewMove = () => {
    setMoves([...moves, { id: moves.length, method: '', weight: '', pbpe: '', totalWeight: '' }]);
    setTabValue(moves.length);
  };

  const deleteMove = (index) => {
    const newMoves = moves.filter((_, i) => i !== index);
    setMoves(newMoves);
    setTabValue((prev) => (prev === index ? (newMoves.length > 0 ? 0 : -1) : prev > index ? prev - 1 : prev));
  };

  return (
    <Box>
      <Typography variant="h4">Government Arrange Moves</Typography>
      <Divider />
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
        {moves.map((move, index) => (
          <Tab 
            key={index} 
            label={
              <Box display="flex" alignItems="center">
                {`Move ${index + 1}`}
                <IconButton onClick={() => deleteMove(index)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            } 
            {...a11yProps(index)} 
          />
        ))}
        <Button onClick={addNewMove}>Add Move</Button>
      </Tabs>
      {moves.map((move, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
            }}
          >
            <TextField
              label="Method of Transportation"
              fullWidth
              select
              value={move.method}
              onChange={(e) => {
                const newMoves = [...moves];
                newMoves[index].method = e.target.value;
                setMoves(newMoves);
              }}
            >
              <MenuItem value="coded">Coded</MenuItem>
            </TextField>
            <TextField
              label="Weight"
              fullWidth
              value={move.weight}
              onChange={(e) => {
                const newMoves = [...moves];
                newMoves[index].weight = e.target.value;
                setMoves(newMoves);
              }}
            />
            <TextField
              label="PBP&E"
              fullWidth
              value={move.pbpe}
              onChange={(e) => {
                const newMoves = [...moves];
                newMoves[index].pbpe = e.target.value;
                setMoves(newMoves);
              }}
            />
            <TextField
              label="Total Weight"
              fullWidth
              value={move.totalWeight}
              onChange={(e) => {
                const newMoves = [...moves];
                newMoves[index].totalWeight = e.target.value;
                setMoves(newMoves);
              }}
            />
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
}

export default GAM;
