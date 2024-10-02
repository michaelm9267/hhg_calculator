// GovMove.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const GovMove = ({ govMoves, setGovMoves }) => {
  // State for new move inputs
  const [newMove, setNewMove] = useState({
    moveType: "",
    grossWeight: "",
    pbpe: "",
  });

  const handleNewMoveChange = (field) => (event) => {
    setNewMove({
      ...newMove,
      [field]: event.target.value,
    });
  };

  const addMove = () => {
    const grossWeight = parseFloat(newMove.grossWeight) || 0;
    const pbpe = parseFloat(newMove.pbpe) || 0;

    if (pbpe > 2000) {
      alert("PBP&E cannot exceed 2000 pounds.");
      return;
    }

    // Subtract 10% of grossWeight for packing material
    const packingMaterialWeight = 0.1 * grossWeight;

    // Calculate totalWeight
    const totalWeight = grossWeight - pbpe - packingMaterialWeight;

    const move = {
      ...newMove,
      grossWeight,
      pbpe,
      totalWeight,
      packingMaterialWeight,
    };
    setGovMoves([...govMoves, move]);
    // Reset new move inputs
    setNewMove({
      moveType: "",
      grossWeight: "",
      pbpe: "",
    });
  };

  const deleteMove = (index) => {
    const updatedMoves = [...govMoves];
    updatedMoves.splice(index, 1);
    setGovMoves(updatedMoves);
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Government Moves
      </Typography>
      <Grid container spacing={2}>
        {/* Move Type */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="moveType-label">Move Type</InputLabel>
            <Select
              labelId="moveType-label"
              id="moveType"
              label="Move Type"
              value={newMove.moveType}
              onChange={handleNewMoveChange("moveType")}
            >
              <MenuItem value="Coded">Coded</MenuItem>
              <MenuItem value="UB">UB</MenuItem>
              <MenuItem value="PPM">PPM</MenuItem>
              <MenuItem value="NTS">NTS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Gross Weight */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Gross Weight"
            fullWidth
            type="number"
            value={newMove.grossWeight}
            onChange={handleNewMoveChange("grossWeight")}
          />
        </Grid>
        {/* PBP&E */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="PBP&E"
            fullWidth
            type="number"
            value={newMove.pbpe}
            onChange={handleNewMoveChange("pbpe")}
          />
        </Grid>
        {/* Add Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={addMove}
            disabled={!newMove.moveType || !newMove.grossWeight}
          >
            Add Move
          </Button>
        </Grid>
      </Grid>
      {/* Moves Table */}
      {govMoves.length > 0 && (
        <Table mt={2}>
          <TableHead>
            <TableRow>
              <TableCell>Move Type</TableCell>
              <TableCell>Gross Weight</TableCell>
              <TableCell>PBP&E</TableCell>
              <TableCell>Packing Material (10%)</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {govMoves.map((move, index) => (
              <TableRow key={index}>
                <TableCell>{move.moveType}</TableCell>
                <TableCell>{move.grossWeight}</TableCell>
                <TableCell>{move.pbpe}</TableCell>
                <TableCell>{move.packingMaterialWeight.toFixed(2)}</TableCell>
                <TableCell>{move.totalWeight.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteMove(index)}>
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

export default GovMove;
