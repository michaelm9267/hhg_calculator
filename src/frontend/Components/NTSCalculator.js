import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import moment from "moment";
import NTSData from "../../backend/NTSData.json";
const NTSCalculator = () => {
  const [reimbursementAllowance, setReimbursementAllowance] = useState(0);
  const [grossWeight, setGrossWeight] = useState(0);
  const [dateIntoStorage, setDateIntoStorage] = useState("");
  const [dateOutOfStorage, setDateOutOfStorage] = useState("");
  const [calendarMonths, setCalendarMonths] = useState(0);



  useEffect(() => {
    // Calculate calendar months when dates change
    if (dateIntoStorage && dateOutOfStorage) {
        const inDate = moment(dateIntoStorage);
        const outDate = moment(dateOutOfStorage);
        const diffDays = outDate.diff(inDate, 'months') % 12;
        const inMonth = inDate.month();
        const outMonth = outDate.month();
        const remainderDays = outDate.diff(inDate.add(diffDays, 'months'), 'days');

        console.log('diffDays', diffDays);
        console.log(remainderDays)
  
        let totalMonths = outMonth - inMonth;

        if (remainderDays <= 15 && remainderDays > 0) {
          totalMonths += 0.5;
        } else if ((remainderDays > 15 && remainderDays !== 0)) {
          totalMonths += 1;
        }
  
        setCalendarMonths(totalMonths);
      }
    }, [dateIntoStorage, dateOutOfStorage]);

  console.log('calendarMonths', calendarMonths);
      


  const calculateReimbursementAllowance = () => {
    if (NTSData && NTSData.length > 0) {
      const cwt = grossWeight / 100;
      const totalReimbursement =
        parseFloat(NTSData[0]["Pack Rate"] * cwt ) +
        parseFloat(NTSData[0]["Dray In"] * cwt)  +
        parseFloat(NTSData[0]["HI Rate"] * cwt)  +
        parseFloat(NTSData[0]["HO Rate"] * cwt)  +
        parseFloat(NTSData[0]["Strg Rate"] * cwt  * calendarMonths) +
        parseFloat(NTSData[0]["Dray Out"] * cwt)  +
        parseFloat(NTSData[0]["UnpackDray"] * cwt) ;
      setReimbursementAllowance(totalReimbursement);
    }
  };

  return (
    <Box>
      {NTSData?.map((row, index) => (
        <Box key={index}>
          <Typography>NTS Calculator For {row.City}</Typography>
          <Typography>{`Rate Zone: ${row.RateZone}`}</Typography>
          <Typography>{`TSP: ${row["NTS-TSP Name"]}`}</Typography>
          <Typography>{`City: ${row.City}`}</Typography>
          <Typography>{`Packing Rate: ${row["Pack Rate"]}`}</Typography>
          <Typography>{`Handling-In Rate: ${row["HI Rate"]}`}</Typography>
          <Typography>{`Storage Rate: ${row["Strg Rate"]}`}</Typography>
          <Typography>{`Handling-Out Rate: ${row["HO Rate"]}`}</Typography>
          <Typography>{`Unpacking Rate: ${row["UnpackDray"]}`}</Typography>
          <Typography>{`Drayage-In Rate: ${row["Dray In"]}`}</Typography>
          <Typography>{`Drayage-Out Rate: ${row["Dray Out"]}`}</Typography>
          <TextField
            label="Please enter your Gross HHG Weight"
            type="number"
            onChange={(e) => setGrossWeight(parseFloat(e.target.value))}
            margin="normal"
          />
          <TextField
            type="date"
            onChange={(e) => setDateIntoStorage(e.target.value)}
            margin="normal"
          />
          <TextField
            type="date"
            onChange={(e) => setDateOutOfStorage(e.target.value)}
            margin="normal"
          />
          <Button onClick={calculateReimbursementAllowance}>Calculate</Button>
          <Typography>{`Reimbursement Allowance: $${reimbursementAllowance.toFixed(2)}`}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default NTSCalculator;



