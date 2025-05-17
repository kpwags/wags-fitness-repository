import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import RunRoutes from './routes/runs';
import ShoeRoutes from './routes/shoes';

const app = express();

const port = config.port || 3020;

const corsOptions = {
    origin: ['http://localhost:3019', 'http://127.0.0.1:3019', 'http://192.168.1.152:3019', 'https://192.168.1.232'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/run', RunRoutes);
app.use('/shoe', ShoeRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});