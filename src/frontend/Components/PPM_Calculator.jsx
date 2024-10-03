// PPM_Calculator.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
} from "@mui/material";
import ranks from "../../backend/ranks.json";
import GovMove from "./GovMove";
import WeightTickets from "./WeightTickets";
import TotalWeight from "./TotalWeight";
import PrintableForm from "./PrintableForm";
import { useReactToPrint } from "react-to-print";
import { getTotalWeights } from "./utils";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";




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

  // Ref for the PrintableForm component
  // Refs
  const printableRef = useRef();

  // Handle PDF generation and opening in a new tab

  const handlePrint = () => {
    const element = printableRef.current;
  
    const options = {
      margin: 0,
      filename: "PPM Calculator.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };
  
    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const pdfBlobUrl = pdf.output('bloburl');
        window.open(pdfBlobUrl);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };
  // Calculate totalWeights
  const totalWeights = getTotalWeights(memberInfo, govMoves, weightTickets, ranks);


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
      <WeightTickets
        weightTickets={weightTickets}
        setWeightTickets={setWeightTickets}
      />
      {/* TotalWeight Component */}
      <TotalWeight
        memberInfo={memberInfo}
        govMoves={govMoves}
        weightTickets={weightTickets}
        ranks={ranks}
        totalWeights={totalWeights} // Pass totalWeights as prop
      />

      {/* Print Button */}
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Form
        </Button>
      </Box>

      {/* PrintableForm Component */}
      <PrintableForm
        ref={printableRef}
        memberInfo={memberInfo}
        govMoves={govMoves}
        weightTickets={weightTickets}
        totalWeights={totalWeights} // Pass totalWeights as prop
      />
    </>
  );
};

export default PPM_Calculator;