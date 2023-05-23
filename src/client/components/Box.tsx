import * as React from 'react';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


const BoxMetric:React.FC = () => {
    return(
        <>
    <Card sx={{ width: '15rem', boxShadow: 5 }}>
      <CardContent>
        <Typography sx={{ fontWeight: 700, fontSize: 17, textAlign: 'center' }} color="text.secondary" gutterBottom>
        Total RPCs Started on Server
        </Typography>
        <Divider textAlign="center" sx={{ fontWeight: 700 }} />
        <Typography style={{ backgroundColor: 'white', color: '#4B91F1', fontWeight: 700, fontSize: 55, textAlign: 'center' }} component="div">
          36
        </Typography>
      </CardContent>
    </Card>
        </>
    )
}

export default BoxMetric