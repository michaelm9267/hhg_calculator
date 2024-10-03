// PrintableForm.jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

const PrintableForm = React.forwardRef((props, ref) => {
  const { memberInfo, govMoves, weightTickets, totalWeights } = props;

  const {
    adjustedTotalGrossWeight,
    adjustedTotalTareWeight,
    adjustedTotalNetWeight,
    totalPBPnE,
    maxWeightAllowance,
    remainingEntitlement,
  } = totalWeights;

  // Define a common style for table cells to include borders
  const tableCellStyle = {
    border: "1px solid black",
    padding: "8px",
  };

  // Define a common style for tables to include borders
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  // Style for header rows
  const headerRowStyle = {
    backgroundColor: "#f0f0f0", // Light grey background
  };

  return ReactDOM.createPortal(
    <Box ref={ref} p={4} bgcolor="#ffffff" color="#000000">
      <Typography variant="h4" sx={{ textAlign: 'center', my: 0 }}>
        PPM Calculator
      </Typography>

      {/* Member Information */}
      <Paper elevation={1} style={{ padding: "5px", marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Member Information
        </Typography>
        <Table style={tableStyle}>
          <TableBody>
            {/* Row 1: Labels */}
            <TableRow style={headerRowStyle}>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Rank
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                SSN
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                {/* Optional Fourth Column */}
              </TableCell>
            </TableRow>
            {/* Row 2: Values */}
            <TableRow>
              <TableCell style={tableCellStyle}>
                {`${memberInfo.firstName} ${memberInfo.lastName}`}
              </TableCell>
              <TableCell style={tableCellStyle}>{memberInfo.rank}</TableCell>
              <TableCell style={tableCellStyle}>{memberInfo.ssn}</TableCell>
              <TableCell style={tableCellStyle}>{/* Optional */}</TableCell>
            </TableRow>
            {/* Row 3: Labels */}
            <TableRow style={headerRowStyle}>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Dependents
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Joint Spouse
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Spouse Rank
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Gov-Qtrs
              </TableCell>
            </TableRow>
            {/* Row 4: Values */}
            <TableRow>
              <TableCell style={tableCellStyle}>
                {memberInfo.dependents}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {memberInfo.jointSpouse}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {memberInfo.jointSpouse === "Yes"
                  ? memberInfo.spouseRank
                  : "N/A"}
              </TableCell>
              <TableCell style={tableCellStyle}>{memberInfo.govQtrs}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Government Moves */}
      <Paper elevation={2} style={{ padding: "16px", marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Government Moves
        </Typography>
        {govMoves.length > 0 ? (
          <Table style={tableStyle}>
            <TableHead>
              <TableRow style={headerRowStyle}>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Move Type
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Gross Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Packing Material Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Net Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  PBP&E
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {govMoves.map((move, index) => (
                <TableRow key={index}>
                  <TableCell style={tableCellStyle}>{move.moveType}</TableCell>
                  <TableCell style={tableCellStyle}>
                    {move.grossWeight} lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    {parseFloat(move.packingMaterialWeight)} lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    {(
                      parseFloat(move.grossWeight) -
                      parseFloat(move.packingMaterialWeight)
                    )}{" "}
                    lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>{move.pbpe} lbs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No Government Moves</Typography>
        )}
      </Paper>

      {/* Weight Tickets */}
      <Paper elevation={2} style={{ padding: "16px", marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Weight Tickets
        </Typography>
        {weightTickets.length > 0 ? (
          <Table style={tableStyle}>
            <TableHead>
              <TableRow style={headerRowStyle}>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Gross Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Tare Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Net Weight
                </TableCell>
                <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  PBP&E
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weightTickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell style={tableCellStyle}>
                    {ticket.grossWeight} lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    {ticket.tareWeight} lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    {(
                      parseFloat(ticket.grossWeight) -
                      parseFloat(ticket.tareWeight)
                    )}{" "}
                    lbs
                  </TableCell>
                  <TableCell style={tableCellStyle}>{ticket.pbpe} lbs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No Weight Tickets</Typography>
        )}
      </Paper>

      {/* Total Weight Summary */}
      <Paper elevation={2} style={{ padding: "16px", marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Total Weight Summary
        </Typography>
        <Table style={tableStyle}>
          <TableBody>
            {/* Row 1: Labels */}
            <TableRow style={headerRowStyle}>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Total Gross Weight
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Total Tare Weight
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Total Net Weight
              </TableCell>
            </TableRow>
            {/* Row 2: Values */}
            <TableRow>
              <TableCell style={tableCellStyle}>
                {`${adjustedTotalGrossWeight} lbs`}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {`${adjustedTotalTareWeight} lbs`}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {`${adjustedTotalNetWeight} lbs`}
              </TableCell>
            </TableRow>
            {/* Row 3: Labels */}
            <TableRow style={headerRowStyle}>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Total PBP&E
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Max Weight Allowance (Including PBP&E)
              </TableCell>
              <TableCell style={{ ...tableCellStyle, fontWeight: "bold" }}>
                Remaining Weight Entitlement
              </TableCell>
            </TableRow>
            {/* Row 4: Values */}
            <TableRow>
              <TableCell style={tableCellStyle}>
                {`${totalPBPnE} lbs`}
              </TableCell>
              <TableCell style={tableCellStyle}>
                {maxWeightAllowance === Infinity
                  ? "Unlimited"
                  : `${maxWeightAllowance} lbs`}
              </TableCell>
              <TableCell
                style={{
                  ...tableCellStyle,
                  backgroundColor:
                    remainingEntitlement < 0 ? "#f23a13" : "inherit", // Red background if negative
                }}
              >
                {`${remainingEntitlement} lbs`}
                {remainingEntitlement < 0 ? " (Overweight!)" : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Confirmation Statement and Signature */}
      <Paper elevation={2} style={{ padding: "16px" }}>
        <Box>
          <Typography variant="body1" gutterBottom>
            I certify that the above weight information is accurate and complete to
            the best of my knowledge.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15%",
            }}
          >
            <Box mt={6}>
              <Typography variant="body1">
                ______________________________
              </Typography>
              <Typography variant="body2">Member Signature</Typography>
            </Box>

            <Box mt={6}>
              <Typography variant="body1"> ______________________</Typography>
              <Typography variant="body2">Date</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>,
    document.getElementById("print-root") // This is the target DOM node
  );
});

export default PrintableForm;
