import express from 'express';
import RunRepository from '../repositories/RunRepository';
import ShoeRepository from '../repositories/ShoeRepository';
import Shoe from '../models/Shoe';

const router = express.Router();

router.get('/active', (_, res) => {
    ShoeRepository.GetAllSneakers(true, (error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

router.get('/', (_, res) => {
    ShoeRepository.GetAllSneakers(false, (error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        res.json(data);
    });
});

export default router;
