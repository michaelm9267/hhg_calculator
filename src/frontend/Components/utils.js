// utils.js
export const getTotalWeights = (memberInfo, govMoves, weightTickets, ranks) => {
    // Helper function to get max weight allowance
    const getMaxWeightAllowance = (memberInfo, ranks) => {
      // Get member's weight allowance based on rank and dependents
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
  
      return maxWeightAllowance;
    };
  
    // Calculate total net weights from govMoves and weightTickets
    const totalGovNetWeight = govMoves.reduce(
      (sum, move) =>
        sum +
        (parseFloat(move.grossWeight || 0) -
          parseFloat(move.packingMaterialWeight || 0)),
      0
    );
  
    const totalTicketNetWeight = weightTickets.reduce(
      (sum, ticket) =>
        sum +
        (parseFloat(ticket.grossWeight || 0) -
          parseFloat(ticket.tareWeight || 0)),
      0
    );
  
    // Total Net Weight
    let totalNetWeight = totalGovNetWeight + totalTicketNetWeight;
  
    // Total Gross Weight
    let totalGrossWeight =
      govMoves.reduce(
        (sum, move) => sum + parseFloat(move.grossWeight || 0),
        0
      ) +
      weightTickets.reduce(
        (sum, ticket) => sum + parseFloat(ticket.grossWeight || 0),
        0
      );
  
    // Total Tare Weight
    let totalTareWeight =
      govMoves.reduce(
        (sum, move) => sum + parseFloat(move.packingMaterialWeight || 0),
        0
      ) +
      weightTickets.reduce(
        (sum, ticket) => sum + parseFloat(ticket.tareWeight || 0),
        0
      );
  
    // Total PBP&E (not to exceed 2000 lbs)
    const totalPBPnE = Math.min(
      2000,
      govMoves.reduce((sum, move) => sum + parseFloat(move.pbpe || 0), 0) +
        weightTickets.reduce(
          (sum, ticket) => sum + parseFloat(ticket.pbpe || 0),
          0
        )
    );
  
    // Max Weight Allowance
    let maxWeightAllowance = getMaxWeightAllowance(memberInfo, ranks);
  
    // Add PBP&E to Max Weight Allowance
    if (maxWeightAllowance !== Infinity) {
      maxWeightAllowance += totalPBPnE;
    }
  
    // Adjust Gross and Tare Weights if total net weight exceeds max weight allowance
    let adjustedTotalGrossWeight = totalGrossWeight;
    let adjustedTotalTareWeight = totalTareWeight;
    let adjustedTotalNetWeight = totalNetWeight;
  
    if (totalNetWeight > maxWeightAllowance && maxWeightAllowance !== Infinity) {
      const adjustmentFactor = maxWeightAllowance / totalNetWeight;
      adjustedTotalGrossWeight = totalGrossWeight * adjustmentFactor;
      adjustedTotalTareWeight = totalTareWeight * adjustmentFactor;
      adjustedTotalNetWeight = adjustedTotalGrossWeight - adjustedTotalTareWeight;
  
      // Update totalNetWeight to adjustedTotalNetWeight
      totalNetWeight = adjustedTotalNetWeight;
    }
  
    // Round adjusted weights
    adjustedTotalGrossWeight = parseFloat(adjustedTotalGrossWeight.toFixed(0));
    adjustedTotalTareWeight = parseFloat(adjustedTotalTareWeight.toFixed(0));
    adjustedTotalNetWeight = parseFloat(adjustedTotalNetWeight.toFixed(0));
  
    // Remaining Entitlement
    let remainingEntitlement =
      maxWeightAllowance - (totalGrossWeight - totalTareWeight);;
  
    // Return totalWeights object
    return {
      adjustedTotalGrossWeight,
      adjustedTotalTareWeight,
      adjustedTotalNetWeight,
      totalPBPnE: parseFloat(totalPBPnE.toFixed(0)),
      maxWeightAllowance:
        maxWeightAllowance === Infinity
          ? Infinity
          : parseFloat(maxWeightAllowance.toFixed(0)),
      remainingEntitlement: parseFloat(remainingEntitlement.toFixed(0)),
    };
  };
  