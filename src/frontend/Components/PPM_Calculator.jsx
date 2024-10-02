import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import ranks from "../../backend/ranks.json";
import GovMove from "./GovMove";
import WeightTickets from "./WeightTickets";
import TotalWeight from "./TotalWeight";

const PPM_Calculator = () => {
  // State variables for member info
  const [memberInfo, setMemberInfo] = useState({
    rank: "",
    firstName: "",
    lastName: "",
    ssn: "",
    dependents: "No",
    jointSpouse: "No",
    spouseRank: "",
    govQtrs: "No",
  });

  // State variables for Gov Moves and Weight Tickets
  const [govMoves, setGovMoves] = useState([]);
  const [weightTickets, setWeightTickets] = useState([]);

  // Handle member info changes
  const handleMemberInfoChange = (field) => (event) => {
    setMemberInfo({
      ...memberInfo,
      [field]: event.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        PPM Calculator
      </Typography>
      <Box className="member-information">
        <Grid container spacing={2}>
          {/* Rank */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="rank-label">Rank</InputLabel>
              <Select
                labelId="rank-label"
                id="rank"
                label="Rank"
                value={memberInfo.rank}
                onChange={handleMemberInfoChange("rank")}
              >
                {ranks.map((rank) => (
                  <MenuItem key={rank.grade} value={rank.grade}>
                    {rank.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* First Name */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="First Name"
              fullWidth
              value={memberInfo.firstName}
              onChange={handleMemberInfoChange("firstName")}
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Last Name"
              fullWidth
              value={memberInfo.lastName}
              onChange={handleMemberInfoChange("lastName")}
            />
          </Grid>
          {/* SSN */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="SSN"
              fullWidth
              value={memberInfo.ssn}
              onChange={handleMemberInfoChange("ssn")}
            />
          </Grid>
          {/* Dependents */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="dependents-label">Dependents</InputLabel>
              <Select
                labelId="dependents-label"
                id="dependents"
                label="Dependents"
                value={memberInfo.dependents}
                onChange={handleMemberInfoChange("dependents")}
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Joint Spouse */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="jointSpouse-label">Joint Spouse</InputLabel>
              <Select
                labelId="jointSpouse-label"
                id="jointSpouse"
                label="Joint Spouse"
                value={memberInfo.jointSpouse}
                onChange={handleMemberInfoChange("jointSpouse")}
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Spouse Rank */}
          {memberInfo.jointSpouse === "Yes" && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="spouseRank-label">Spouse Rank</InputLabel>
                <Select
                  labelId="spouseRank-label"
                  id="spouseRank"
                  label="Spouse Rank"
                  value={memberInfo.spouseRank}
                  onChange={handleMemberInfoChange("spouseRank")}
                >
                  {ranks.map((rank) => (
                    <MenuItem key={rank.grade} value={rank.grade}>
                      {rank.grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {/* Gov-Qtrs */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="govQtrs-label">Gov-Qtrs</InputLabel>
              <Select
                labelId="govQtrs-label"
                id="govQtrs"
                label="Gov-Qtrs"
                value={memberInfo.govQtrs}
                onChange={handleMemberInfoChange("govQtrs")}
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      {/* GovMove Component */}
      <GovMove govMoves={govMoves} setGovMoves={setGovMoves} />
      {/* WeightTickets Component */}
      <WeightTickets weightTickets={weightTickets} setWeightTickets={setWeightTickets} />
      {/* TotalWeight Component */}
      <TotalWeight
        memberInfo={memberInfo}
        govMoves={govMoves}
        weightTickets={weightTickets}
        ranks={ranks}
      />
    </>
  );
};

export default PPM_Calculator;
