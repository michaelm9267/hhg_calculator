import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import PrintForm from "./PrintForm";

const PPMTotals = ({
  totalWeight,
  grade,
  firstName,
  lastName,
  middleInitial,
  ssn,
  orderNumber,
  joinSpouse,
  spouseGrade,
  dependents,
  toFromGovtQtrs,
  gamMoves,
  weightTickets
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById("print-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <Box>
      <Typography variant="h4">Totals</Typography>
      <Divider />
      <Box>
        <Typography variant="h6">Total Weight: {totalWeight}</Typography>
        <Typography variant="h6">Total PBP&E: 0</Typography>
      </Box>
      <Box>
        <Button variant="contained" onClick={handlePrint}>Print</Button>
      </Box>
      <div id="print-content" style={{ display: "none" }}>
        <PrintForm
          grade={grade}
          name={`${firstName} ${lastName} ${middleInitial}`}
          ssn={ssn}
          orderNumber={orderNumber}
          joinSpouse={joinSpouse}
          spouseGrade={spouseGrade}
          dependents={dependents}
          toFromGovtQtrs={toFromGovtQtrs}
          gamMoves={gamMoves}
          weightTickets={weightTickets}
          totalWeight={totalWeight}
        />
      </div>
    </Box>
  );
};

export default PPMTotals;
