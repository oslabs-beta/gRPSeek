import express, {Express, Request, Response} from 'express';
import cors from 'cors';
const app = express();
app.use(cors())
const PORT = 3000;


app.get('/', (req,res) => {
  res.status(200).send('Sanity Check');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
