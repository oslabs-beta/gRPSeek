import * as React from "react";
import Card from "@mui/material/Card";
// import CardActions from '@mui/material/CardActions';
import CardContent from "@mui/material/CardContent";
// import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CountUp from "react-countup";

interface BoxProps {
  metric: string;
  total: number;
}

const BoxMetric = ({ metric, total }: BoxProps) => {
  return (
    <>
      <Card sx={{ boxShadow: 5 }}>
        <CardContent>
          <Typography
            sx={{ fontWeight: 500, fontSize: 17, textAlign: "center" }}
            color="text.secondary"
            gutterBottom
          >
            {metric}
          </Typography>
          <Divider />
          <Typography
            style={{
              marginTop: "18px",
              backgroundColor: "white",
              color: "#4B91F1",
              fontWeight: 300,
              fontSize: 55,
              textAlign: "center",
            }}
            component="div"
          >
            <CountUp start = {0} end = {total} duration = {3.5}/>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default BoxMetric;
