
import * as dotenv from 'dotenv';
import express from 'express';

const app = express();
dotenv.config();

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});