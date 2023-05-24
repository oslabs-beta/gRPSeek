import * as React from 'react';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import "../styles.scss";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';


const BoxMetric:React.FC = () => {
    return(
        <>
    <div>
    <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
    transition={{
      duration: 1.15,
      delay: 0.1,
      ease: [0.4, 0.65, 0.75, 1]
  }}
    >
    <Card sx={{ width: '15rem', boxShadow: 5 }}>
      <CardContent>
        <div className='box_title'>
        Total RPCs Started on Server
        </div>
        <Divider textAlign="center" sx={{ fontWeight: 700 }} />
        <div className='box_data'>36</div>
      </CardContent>
    </Card>
    </motion.div>
    </div>
        </>
    )
}

export default BoxMetric



{/* <Typography sx={{ fontWeight: 700, fontSize: 17, textAlign: 'center' }} color="text.secondary" gutterBottom> */}
// </Typography>

{/* <Typography style={{ backgroundColor: 'white', color: '#4B91F1', fontWeight: 700, fontSize: 55, textAlign: 'center' }} component="div">
          36
        </Typography> */}