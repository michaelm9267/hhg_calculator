import React, { useState } from "react";
import { Box, Grid, TextField, MenuItem, FormControl } from "@mui/material";
import GAM from "./GAM";
import WeightTicket from "./WeightTicket";
import PPMTotals from "./PPMTotals";

const PPMCalculator = () => {
  const [ssn, setSsn] = useState("");
  const [grade, setGrade] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [joinSpouse, setJoinSpouse] = useState("");
  const [spouseGrade, setSpouseGrade] = useState("");
  const [dependents, setDependents] = useState("");
  const [toFromGovtQtrs, setToFromGovtQtrs] = useState("");
  const [gamMoves, setGamMoves] = useState([]);
  const [weightTickets, setWeightTickets] = useState([]);
  const [gamTotalWeight, setGamTotalWeight] = useState(0);
  const [weightTicketTotalWeight, setWeightTicketTotalWeight] = useState(0);

  const totalWeight = gamTotalWeight + weightTicketTotalWeight;

  return (
    <Box>
      <Grid container gap={1} justifyContent={"center"}>
        <Grid item md={1}>
          <FormControl fullWidth>
            <TextField label="Grade" onChange={(e) => setGrade(e.target.value)} select>
              <MenuItem value="E1">E-1</MenuItem>
              {/* Add other grade options */}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item md={3}><TextField label="First Name" onChange={(e) => setFirstName(e.target.value)} fullWidth /></Grid>
        <Grid item md={3}><TextField label="Last Name" onChange={(e) => setLastName(e.target.value)} fullWidth /></Grid>
        <Grid item md={1}><TextField label="M.I" onChange={(e) => setMiddleInitial(e.target.value)} fullWidth /></Grid>
        <Grid item md={3}>
          <TextField
            fullWidth
            label="SSN"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container gap={4} justifyContent={"center"} margin={"30px 0"}>
        <Grid item md={2}><TextField label="Order Number" onChange={(e) => setOrderNumber(e.target.value)} fullWidth /></Grid>
        <Grid item md={2}>
          <FormControl fullWidth>
            <TextField label="Join Spouse" onChange={(e) => setJoinSpouse(e.target.value)} select>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        {joinSpouse === "Yes" && <Grid item md={2}>
          <FormControl fullWidth>
            <TextField label="Spouse Grade" onChange={(e) => setSpouseGrade(e.target.value)} select>
              <MenuItem value="E1">E-1</MenuItem>
              {/* Add other spouse grade options */}
            </TextField>
          </FormControl>
        </Grid>}
        <Grid item md={2}>
          <FormControl fullWidth>
            <TextField label="Dependents" onChange={(e) => setDependents(e.target.value)} select>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <FormControl fullWidth>
            <TextField label="To/From Govt Qtrs" onChange={(e) => setToFromGovtQtrs(e.target.value)} select>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
      </Grid>
      <GAM onTotalWeightChange={setGamTotalWeight} />
      <WeightTicket onTotalWeightChange={setWeightTicketTotalWeight} />
      <PPMTotals
        totalWeight={totalWeight}
        grade={grade}
        firstName={firstName}
        lastName={lastName}
        middleInitial={middleInitial}
        ssn={ssn}
        orderNumber={orderNumber}
        joinSpouse={joinSpouse}
        spouseGrade={spouseGrade}
        dependents={dependents}
        toFromGovtQtrs={toFromGovtQtrs}
        gamMoves={gamMoves}
        weightTickets={weightTickets}
      />
    </Box>
  );
};

export default PPMCalculator;
