import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import NTSData from "../../backend/NTSData.json";
const NTSCalculator = () => {
  const [reimbursementAllowance, setReimbursementAllowance] = useState(0);
  const [grossWeight, setGrossWeight] = useState(0);
  const [dateIntoStorage, setDateIntoStorage] = useState("");
  const [dateOutOfStorage, setDateOutOfStorage] = useState("");
  const [calendarMonths, setCalendarMonths] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Calculate calendar months when dates change
    if (dateIntoStorage && dateOutOfStorage) {
      const inDate = moment(dateIntoStorage);
      const outDate = moment(dateOutOfStorage);
      const diffDays = outDate.diff(inDate, "months") % 12;
      const inMonth = inDate.month();
      const outMonth = outDate.month();
      const remainderDays = outDate.diff(
        inDate.add(diffDays, "months"),
        "days"
      );

      console.log("diffDays", diffDays);
      console.log(remainderDays);

      let totalMonths = outMonth - inMonth;

      switch (true) {
        case diffDays === 0 && remainderDays <= 15:
          totalMonths = 0.5;
          break;
        case diffDays === 0 && remainderDays > 15:
          totalMonths = 1;
          break;
        case diffDays !== 0 && remainderDays <= 15 && remainderDays > 0:
          totalMonths += 0.5;
          break;
        case diffDays !== 0 && remainderDays > 15 && remainderDays !== 0:
          totalMonths += 1;
          break;
        default:
        // Handle other cases if needed
      }

      setCalendarMonths(totalMonths);
    }
  }, [dateIntoStorage, dateOutOfStorage]);

  console.log("calendarMonths", calendarMonths);

  const calculateReimbursementAllowance = () => {
    if (NTSData && NTSData.length > 0) {
      const cwt = grossWeight / 100;
      const totalReimbursement =
        parseFloat(NTSData[0]["Pack Rate"] * cwt) +
        parseFloat(NTSData[0]["Dray In"] * cwt) +
        parseFloat(NTSData[0]["HI Rate"] * cwt) +
        parseFloat(NTSData[0]["HO Rate"] * cwt) +
        parseFloat(NTSData[0]["Strg Rate"] * cwt * calendarMonths) +
        parseFloat(NTSData[0]["Dray Out"] * cwt) +
        parseFloat(NTSData[0]["UnpackDray"] * cwt);
      setReimbursementAllowance(totalReimbursement);
    }
  };

  return (
    <Box>
      {NTSData?.map((row, index) => (
        <Box key={index} className="NTS-calc-con">
          <Typography variant={isMobile ? "h6" : "h3"}>
            NTS Calculator For Dyess AFB, TX
          </Typography>
          <Box className={"grid-container"}>
            <Typography className="gridItem item1">
              <strong>{`Rate Zone`}</strong>
              <br />
              {row.RateZone}
            </Typography>
            <Typography className="gridItem item2">
              <strong>{`TSP:`}</strong>
              <br />
              {row["NTS-TSP Name"]}
            </Typography>
            <Typography className="gridItem item3">
              <strong>{`City:`}</strong>
              <br />
              {row.City}
            </Typography>
            <Typography className="gridItem item4">
              <strong>{`Packing Rate:`}</strong>
              <br />
              {row["Pack Rate"]}
            </Typography>
            <Typography className="gridItem item5">
              <strong>{`Handling-In Rate:`}</strong>
              <br />
              {row["HI Rate"]}
            </Typography>
            <Typography className="gridItem item6">
              <strong>{`Storage Rate:`}</strong>
              <br />
              {row["Strg Rate"]}
            </Typography>
            <Typography className="gridItem item7">
              <strong>{`Handling-Out Rate:`}</strong>
              <br />
              {row["HO Rate"]}
            </Typography>
            <Typography className="gridItem item8">
              <strong>{`Unpacking Rate:`}</strong>
              <br />
              {row["UnpackDray"]}
            </Typography>
            <Typography className="gridItem item9">
              <strong>{`Drayage-In Rate:`}</strong>
              <br />
              {row["Dray In"]}
            </Typography>
            <Typography className="gridItem item10">
              <strong>{`Drayage-Out Rate:`}</strong>
              <br />
              {row["Dray Out"]}
            </Typography>
          </Box>
          <Typography
            bgcolor={"rgb(254, 253, 253)"}
            sx={{ width: "95%", margin: "0 auto" }}
          >
            <strong>{`Reimbursement Allowance`}</strong>
            <br /> {`$${reimbursementAllowance.toFixed(2)}`}
          </Typography>
          <Box className={"input-container"}>
            <Box>
              <Typography className="input-label" sx={{ fontWeight: "bold" }}>
                Gross Wieght
              </Typography>
              <TextField
                label="Please enter your Gross HHG Weight"
                type="number"
                onChange={(e) => setGrossWeight(parseFloat(e.target.value))}
                margin={isMobile ? "5px 0" : "none"}
                sx={{ ...(!isMobile ? { width: "60%" } : { width: "90%" }) }}
              />
            </Box>
            <Box>
              <Typography className="input-label" sx={{ fontWeight: "bold" }}>
                Storage In Date
              </Typography>
              <TextField
                type="date"
                onChange={(e) => setDateIntoStorage(e.target.value)}
                margin={isMobile ? "5px 0" : "none"}
                sx={{ ...(!isMobile ? { width: "60%" } : { width: "90%" }) }}
              />
            </Box>
            <Box>
              <Typography className="input-label" sx={{ fontWeight: "bold" }}>
                Storage Out Date
              </Typography>
              <TextField
                type="date"
                onChange={(e) => setDateOutOfStorage(e.target.value)}
                margin={isMobile ? "5px 0" : "none"}
                sx={{ ...(!isMobile ? { width: "60%" } : { width: "90%" }) }}
              />
            </Box>
            <Box sx={{ margin: "5% auto", width: "90%" }}>
              <Button
                sx={{...isMobile ?
                  {width: "90%"} : {width: "60%"}
                }}
                variant="contained"
                onClick={calculateReimbursementAllowance}
              >
                Calculate
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default NTSCalculator;
