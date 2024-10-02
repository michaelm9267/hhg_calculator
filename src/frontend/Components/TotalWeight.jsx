// TotalWeight.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const TotalWeight = ({ memberInfo, govMoves, weightTickets, ranks }) => {
  // Calculate total gross weights from govMoves and weightTickets
  const totalGovGrossWeight = govMoves.reduce(
    (sum, move) => sum + parseFloat(move.grossWeight || 0),
    0
  );
  const totalTicketGrossWeight = weightTickets.reduce(
    (sum, ticket) => sum + parseFloat(ticket.grossWeight || 0),
    0
  );

  // Initial totalGrossWeight is sum of gross weights
  let totalGrossWeight = totalGovGrossWeight + totalTicketGrossWeight;

  // Calculate total tare weight from weightTickets
  const totalTareWeight = weightTickets.reduce(
    (sum, ticket) => sum + parseFloat(ticket.tareWeight || 0),
    0
  );

  // Total PBP&E from all moves
  const totalPBPnE =
    govMoves.reduce((sum, move) => sum + parseFloat(move.pbpe || 0), 0) +
    weightTickets.reduce((sum, ticket) => sum + parseFloat(ticket.pbpe || 0), 0);

  // Total packing material weight (10% of gross weight)
  const totalPackingMaterialWeight =
    govMoves.reduce(
      (sum, move) => sum + parseFloat(move.packingMaterialWeight || 0),
      0
    ) +
    weightTickets.reduce(
      (sum, ticket) => sum + 0.1 * parseFloat(ticket.grossWeight || 0),
      0
    );

  // Calculate total weight
  let totalWeight =
    totalGrossWeight - totalTareWeight - totalPBPnE - totalPackingMaterialWeight;

  // Get member's max weight allowance
  const memberRankData = ranks.find((rank) => rank.grade === memberInfo.rank);
  let maxWeightAllowance = 0;

  if (memberInfo.govQtrs === "Yes") {
    maxWeightAllowance = Infinity;
  } else if (memberRankData) {
    if (memberInfo.dependents === "Yes") {
      maxWeightAllowance = memberRankData.weightAllowance.withDependents;
    } else {
      maxWeightAllowance = memberRankData.weightAllowance.withoutDependents;
    }
  }

  // Handle joint spouse
  if (memberInfo.jointSpouse === "Yes" && memberInfo.spouseRank) {
    const spouseRankData = ranks.find(
      (rank) => rank.grade === memberInfo.spouseRank
    );
    if (spouseRankData) {
      // Add the spouse's 'withoutDependents' weight allowance
      const spouseAllowance = spouseRankData.weightAllowance.withoutDependents;
      maxWeightAllowance += spouseAllowance;
    }
  }

  // Adjust total gross weight if actual weight exceeds max allowable weight
  if (maxWeightAllowance !== Infinity && totalWeight > maxWeightAllowance) {
    // Calculate the deductions
    const totalDeductions =
      totalTareWeight + totalPBPnE + totalPackingMaterialWeight;

    // Adjust total gross weight so that total weight equals max weight allowance
    totalGrossWeight = maxWeightAllowance + totalDeductions;
    totalWeight = maxWeightAllowance;
  }

  // Compute remaining weight entitlement
  const remainingEntitlement = maxWeightAllowance - totalWeight;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Total Weight Summary
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            {/* Total Gross Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Gross Weight:</Typography>
              <Typography variant="h6">
                {totalGrossWeight.toFixed(2)} lbs
              </Typography>
            </Grid>

            {/* Total Tare Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Tare Weight:</Typography>
              <Typography variant="h6">
                {totalTareWeight.toFixed(2)} lbs
              </Typography>
            </Grid>

            {/* Total PBP&E */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total PBP&E:</Typography>
              <Typography
                variant="h6"
                color={totalPBPnE > 2000 ? "error" : "textPrimary"}
              >
                {totalPBPnE.toFixed(2)} lbs{" "}
                {totalPBPnE > 2000 ? "(Exceeds limit!)" : ""}
              </Typography>
            </Grid>

            {/* Total Packing Material Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Total Packing Material Weight:
              </Typography>
              <Typography variant="h6">
                {totalPackingMaterialWeight.toFixed(2)} lbs
              </Typography>
            </Grid>

            {/* Total Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Weight:</Typography>
              <Typography variant="h6">{totalWeight.toFixed(2)} lbs</Typography>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Max Weight Allowance */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Max Weight Allowance:</Typography>
              <Typography variant="h6">
                {maxWeightAllowance === Infinity
                  ? "Unlimited"
                  : `${maxWeightAllowance} lbs`}
              </Typography>
            </Grid>

            {/* Remaining Weight Entitlement */}
            {maxWeightAllowance !== Infinity && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Remaining Weight Entitlement:
                </Typography>
                <Typography
                  variant="h6"
                  color={remainingEntitlement < 0 ? "error" : "textPrimary"}
                >
                  {remainingEntitlement.toFixed(2)} lbs{" "}
                  {remainingEntitlement < 0 ? "(Overweight!)" : ""}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TotalWeight;
