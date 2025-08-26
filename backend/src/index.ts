import express from 'express';
import cors from 'cors';
import db from './db.js';

const app  = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(PORT,() => {
    db();
    console.log(`Server is running on port ${PORT}`);
})