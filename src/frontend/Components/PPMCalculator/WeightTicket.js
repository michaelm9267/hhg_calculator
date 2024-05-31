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
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";

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

const WeightTicket = ({ onTotalWeightChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [tickets, setTickets] = useState([{ id: 0, grossWeight: '', tareWeight: '' }]);

  useEffect(() => {
    const totalWeight = tickets.reduce((sum, ticket) => sum + (parseFloat(ticket.grossWeight || 0) - parseFloat(ticket.tareWeight || 0)), 0);
    onTotalWeightChange(totalWeight);
  }, [tickets, onTotalWeightChange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addNewTicket = () => {
    setTickets([...tickets, { id: tickets.length, grossWeight: '', tareWeight: '' }]);
    setTabValue(tickets.length);
  };

  const deleteTicket = (index) => {
    const newTickets = tickets.filter((_, i) => i !== index);
    setTickets(newTickets);
    setTabValue((prev) => (prev === index ? (newTickets.length > 0 ? 0 : -1) : prev > index ? prev - 1 : prev));
  };

  return (
    <Box>
      <Typography variant="h4">Weight Tickets</Typography>
      <Divider />
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
        {tickets.map((ticket, index) => (
          <Tab 
            key={index} 
            label={
              <Box display="flex" alignItems="center">
                {`Ticket ${index + 1}`}
                <IconButton onClick={() => deleteTicket(index)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            } 
            {...a11yProps(index)} 
          />
        ))}
        <Button onClick={addNewTicket}>Add Ticket</Button>
      </Tabs>
      {tickets.map((ticket, index) => (
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
              label="Gross Weight"
              fullWidth
              value={ticket.grossWeight}
              onChange={(e) => {
                const newTickets = [...tickets];
                newTickets[index].grossWeight = e.target.value;
                setTickets(newTickets);
              }}
            />
            <TextField
              label="Tare Weight"
              fullWidth
              value={ticket.tareWeight}
              onChange={(e) => {
                const newTickets = [...tickets];
                newTickets[index].tareWeight = e.target.value;
                setTickets(newTickets);
              }}
            />
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export default WeightTicket;
