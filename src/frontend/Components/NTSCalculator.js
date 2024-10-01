import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  const [totalDays, setTotalDays] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Editable fields
  const [rateZone, setRateZone] = useState(NTSData[0].RateZone);
  const [tsp, setTsp] = useState(NTSData[0]["NTS-TSP Name"]);
  const [city, setCity] = useState(NTSData[0].City);
  const [packRate, setPackRate] = useState(NTSData[0]["Pack Rate"]);
  const [handlingInRate, setHandlingInRate] = useState(NTSData[0]["HI Rate"]);
  const [storageRate, setStorageRate] = useState(NTSData[0]["Strg Rate"]);
  const [handlingOutRate, setHandlingOutRate] = useState(NTSData[0]["HO Rate"]);
  const [unpackRate, setUnpackRate] = useState(NTSData[0]["UnpackDray"]);
  const [drayageInRate, setDrayageInRate] = useState(NTSData[0]["Dray In"]);
  const [drayageOutRate, setDrayageOutRate] = useState(NTSData[0]["Dray Out"]);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Calculate calendar months when dates change
    if (dateIntoStorage && dateOutOfStorage) {
      const inDate = moment(dateIntoStorage);
      const outDate = moment(dateOutOfStorage);
      const diffMonths = outDate.diff(inDate, "months");
      const remainderDays = outDate.diff(
        inDate.clone().add(diffMonths, "months"),
        "days"
      );
      const totalDays = outDate.diff(inDate, "days");

      let totalMonths = diffMonths;

      if (remainderDays > 0 && remainderDays <= 15) {
        totalMonths += 0.5;
      } else if (remainderDays > 15) {
        totalMonths += 1;
      }

      setCalendarMonths(totalMonths);
      setTotalDays(totalDays);
    }
  }, [dateIntoStorage, dateOutOfStorage]);

  const calculateReimbursementAllowance = () => {
    if (packRate && grossWeight > 0) {
      const cwt = grossWeight / 100;
      const totalReimbursement =
        parseFloat(packRate * cwt) +
        parseFloat(drayageInRate * cwt) +
        parseFloat(handlingInRate * cwt) +
        parseFloat(handlingOutRate * cwt) +
        parseFloat(storageRate * cwt * calendarMonths) +
        parseFloat(drayageOutRate * cwt) +
        parseFloat(unpackRate * cwt);
      setReimbursementAllowance(totalReimbursement);
    }
  };

  const localRate =
    totalDays > 0 ? reimbursementAllowance / totalDays : 0;

  return (
    <Box>
      <Box className="NTS-calc-con">
        <Typography variant={isMobile ? "h6" : "h3"}>
          NTS Calculator For Dyess AFB, TX
        </Typography>
        <Box className={"grid-container"}>
          <div className="gridItem item1">
            <strong>{`Rate Zone`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={rateZone}
                onChange={(e) => setRateZone(e.target.value)}
              />
            ) : (
              <Typography>{rateZone}</Typography>
            )}
          </div>
          <div className="gridItem item2">
            <strong>{`TSP:`}</strong>
            <br />
            {editMode ? (
              <TextField value={tsp} onChange={(e) => setTsp(e.target.value)} />
            ) : (
              <Typography>{tsp}</Typography>
            )}
          </div>
          <div className="gridItem item3">
            <strong>{`City:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            ) : (
              <Typography>{city}</Typography>
            )}
          </div>
          <div className="gridItem item4">
            <strong>{`Packing Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={packRate}
                type="number"
                onChange={(e) => setPackRate(parseFloat(e.target.value))}
              />
            ) : (
              <Typography>{packRate}</Typography>
            )}
          </div>
          <div className="gridItem item5">
            <strong>{`Handling-In Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={handlingInRate}
                type="number"
                onChange={(e) =>
                  setHandlingInRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{handlingInRate}</Typography>
            )}
          </div>
          <div className="gridItem item6">
            <strong>{`Storage Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={storageRate}
                type="number"
                onChange={(e) =>
                  setStorageRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{storageRate}</Typography>
            )}
          </div>
          <div className="gridItem item7">
            <strong>{`Handling-Out Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={handlingOutRate}
                type="number"
                onChange={(e) =>
                  setHandlingOutRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{handlingOutRate}</Typography>
            )}
          </div>
          <div className="gridItem item8">
            <strong>{`Unpacking Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={unpackRate}
                type="number"
                onChange={(e) =>
                  setUnpackRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{unpackRate}</Typography>
            )}
          </div>
          <div className="gridItem item9">
            <strong>{`Drayage-In Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={drayageInRate}
                type="number"
                onChange={(e) =>
                  setDrayageInRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{drayageInRate}</Typography>
            )}
          </div>
          <div className="gridItem item10">
            <strong>{`Drayage-Out Rate:`}</strong>
            <br />
            {editMode ? (
              <TextField
                value={drayageOutRate}
                type="number"
                onChange={(e) =>
                  setDrayageOutRate(parseFloat(e.target.value))
                }
              />
            ) : (
              <Typography>{drayageOutRate}</Typography>
            )}
          </div>
        </Box>
      <Button variant="contained" sx={{margin: "8px 0"}} onClick={() => setEditMode(!editMode)}>
        {editMode ? "Save" : "Edit"}
      </Button>
        <Typography
          bgcolor={"rgb(254, 253, 253)"}
          sx={{ width: "95%", margin: "0 auto" }}
        >
          <strong>{`Reimbursement Allowance`}</strong>
          <br /> {`$${reimbursementAllowance.toFixed(2)}`}
        </Typography>
        <Typography
          bgcolor={"rgb(254, 253, 253)"}
          sx={{ width: "95%", margin: "0 auto" }}
        >
          <strong>{`Local Rate`}</strong>
          <br /> {`$${localRate.toFixed(2)}`}
        </Typography>
        <Box className={"input-container"}>
          <Box>
            <Typography className="input-label" sx={{ fontWeight: "bold" }}>
              Gross Weight
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
              sx={{
                ...(isMobile ? { width: "90%" } : { width: "60%" }),
              }}
              variant="contained"
              onClick={calculateReimbursementAllowance}
            >
              Calculate
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NTSCalculator;
