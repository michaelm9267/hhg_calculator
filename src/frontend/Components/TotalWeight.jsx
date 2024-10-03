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

const TotalWeight = React.forwardRef(({ totalWeights }, ref) => {
  const {
    adjustedTotalGrossWeight,
    adjustedTotalTareWeight,
    adjustedTotalNetWeight,
    totalPBPnE,
    maxWeightAllowance,
    remainingEntitlement,
  } = totalWeights;

  return (
    <Box mt={4} ref={ref}>
      <Typography variant="h5" gutterBottom>
        Total Weight Summary
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            {/* Adjusted Total Gross Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Gross Weight:</Typography>
              <Typography variant="h6">
                {adjustedTotalGrossWeight} lbs
              </Typography>
            </Grid>

            {/* Adjusted Total Tare Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Tare Weight:</Typography>
              <Typography variant="h6">
                {adjustedTotalTareWeight} lbs
              </Typography>
            </Grid>

            {/* Adjusted Total Net Weight */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Net Weight:</Typography>
              <Typography variant="h6">
                {adjustedTotalNetWeight} lbs
              </Typography>
            </Grid>

            {/* Total PBP&E */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Total PBP&E (Included in Allowance):
              </Typography>
              <Typography
                variant="h6"
                color={totalPBPnE > 2000 ? "error" : "textPrimary"}
              >
                {totalPBPnE} lbs{" "}
                {totalPBPnE > 2000 ? "(Exceeds limit!)" : ""}
              </Typography>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Max Weight Allowance */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Max Weight Allowance (Including PBP&E):
              </Typography>
              <Typography
                variant="h6"
                color={
                  adjustedTotalNetWeight >= maxWeightAllowance
                    ? "error"
                    : "textPrimary"
                }
              >
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
                  {remainingEntitlement} lbs{" "}
                  {remainingEntitlement < 0 ? "(Overweight!)" : ""}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

export default TotalWeight;
