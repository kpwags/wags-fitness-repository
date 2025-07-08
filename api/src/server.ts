import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config';

import { bikeRouter } from '@routes/bike';
import { runRouter } from '@routes/run';
import { shoeRouter } from '@routes/shoe';

const app = express();

const port = config.port ?? 3020;

const corsOptions = {
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/bike', bikeRouter);
app.use('/run', runRouter);
app.use('/shoe', shoeRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});