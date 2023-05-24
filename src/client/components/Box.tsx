import * as React from "react";
import Card from "@mui/material/Card";
// import CardActions from '@mui/material/CardActions';
import CardContent from "@mui/material/CardContent";
// import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CountUp from "react-countup";
import {motion} from 'framer-motion'
import { duration } from "@mui/material";

interface BoxProps {
  metric: string;
  total: number;
  id: number;
}

const BoxMetric = ({ metric, total, id }: BoxProps) => {
  // return (
  //   <>
  //     <Card id = {`card--${id}`} sx={{ boxShadow: 2, width: 150, height: 150 }}>
  //       <CardContent>
  //         <Typography
  //           sx={{ fontWeight: 500, fontSize: 13, textAlign: "center" }}
  //           color="text.secondary"
  //           gutterBottom
  //         >
  //           {metric}
  //         </Typography>
  //         <Divider />
  //         <Typography
  //           style={{
  //             marginTop: "10px",
  //             backgroundColor: "white",
  //             color: "#4B91F1",
  //             fontWeight: 300,
  //             fontSize: 55,
  //             textAlign: "center",
  //           }}
  //           component="div"
  //         >
  //           <CountUp start = {0} end = {total} duration = {3.5}/>
  //         </Typography>
  //       </CardContent>
  //     </Card>
  //   </>
  // );

  return (

    <motion.div className={`card--${id}`}
    initial={{scale:0}} animate={{scale:1}} 
    exit={{ scale: 0, transition: { duration: 0.1 } }}
    transition={{
      duration: .75,
      delay: 0.1,
      ease: [0.4, 0.65, 0.75, 1]
  }}
  whileHover={{
    scale: 1.135,
    transition: { duration: .25 },
    
  
     
  }} >
      <h3 className="card--metric">
        {metric}
        <hr/>
        <div className="card--number">
          <CountUp start={0} end={total} duration={3.5} />
        </div>
      </h3>
    </motion.div>
  );
};

export default BoxMetric;
