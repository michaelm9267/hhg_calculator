// WeightTickets.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const WeightTickets = ({ weightTickets, setWeightTickets }) => {
  // State for new weight ticket inputs
  const [newTicket, setNewTicket] = useState({
    grossWeight: "",
    tareWeight: "",
    pbpe: "",
  });

  const handleNewTicketChange = (field) => (event) => {
    setNewTicket({
      ...newTicket,
      [field]: event.target.value,
    });
  };

  const addTicket = () => {
    const grossWeight = parseFloat(newTicket.grossWeight) || 0;
    const tareWeight = parseFloat(newTicket.tareWeight) || 0;
    const pbpe = parseFloat(newTicket.pbpe) || 0;

    if (pbpe > 2000) {
      alert("PBP&E cannot exceed 2000 pounds.");
      return;
    }


    const totalWeight =
      grossWeight - tareWeight - pbpe;

    const ticket = {
      ...newTicket,
      grossWeight,
      tareWeight,
      pbpe,
      totalWeight,
    };

    setWeightTickets([...weightTickets, ticket]);
    // Reset new ticket inputs
    setNewTicket({
      grossWeight: "",
      tareWeight: "",
      pbpe: "",
    });
  };

  const deleteTicket = (index) => {
    const updatedTickets = [...weightTickets];
    updatedTickets.splice(index, 1);
    setWeightTickets(updatedTickets);
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Weight Tickets
      </Typography>
      <Grid container spacing={2}>
        {/* Gross Weight */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Gross Weight"
            fullWidth
            type="number"
            value={newTicket.grossWeight}
            onChange={handleNewTicketChange("grossWeight")}
          />
        </Grid>
        {/* Tare Weight */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Tare Weight"
            fullWidth
            type="number"
            value={newTicket.tareWeight}
            onChange={handleNewTicketChange("tareWeight")}
          />
        </Grid>
        {/* PBP&E */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="PBP&E"
            fullWidth
            type="number"
            value={newTicket.pbpe}
            onChange={handleNewTicketChange("pbpe")}
          />
        </Grid>
        {/* Add Button */}
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={addTicket}
            disabled={!newTicket.grossWeight || !newTicket.tareWeight}
          >
            Add Weight Ticket
          </Button>
        </Grid>
      </Grid>
      {/* Tickets Table */}
      {weightTickets.length > 0 && (
        <Table mt={2}>
          <TableHead>
            <TableRow>
              <TableCell>Gross Weight</TableCell>
              <TableCell>Tare Weight</TableCell>
              <TableCell>PBP&E</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weightTickets.map((ticket, index) => (
              <TableRow key={index}>
                <TableCell>{ticket.grossWeight}</TableCell>
                <TableCell>{ticket.tareWeight}</TableCell>
                <TableCell>{ticket.pbpe}</TableCell>
                <TableCell>{ticket.totalWeight.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteTicket(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default WeightTickets;
