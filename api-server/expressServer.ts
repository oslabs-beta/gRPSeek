// Dendencies 
import express, { Request, Response } from 'express';
import cors from 'cors';


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
