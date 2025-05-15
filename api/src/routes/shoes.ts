import express from 'express';
import RunRepository from '../repositories/RunRepository';
import ShoeRepository from '../repositories/ShoeRepository';
import Shoe from '../models/Shoe';

const router = express.Router();

router.get('/active', (_, res) => {
    ShoeRepository.GetAllShoes(true)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.json(data);
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    ShoeRepository.GetShoeById(id)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.json(data);
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

router.get('/', async (_, res) => {
    ShoeRepository.GetAllShoes(false)
        .then(([error, data]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.json(data);
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

router.post('/', (req, res) => {
    const formBody = req.body;

    const shoe: Shoe = {
        shoeId: 0,
        name: formBody.name,
        datePurchased: formBody.datePurchased,
        isRetired: formBody.isRetired,
    };

    ShoeRepository.AddShoe(shoe)
        .then(([error, shoeId]) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.json({ shoeId });
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const formBody = req.body;

    const shoe: Shoe = {
        shoeId: id,
        name: formBody.name,
        datePurchased: formBody.datePurchased,
        isRetired: formBody.isRetired,
    };

    ShoeRepository.UpdateShoe(shoe)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    ShoeRepository.DeleteShoe(id)
        .then((error) => {
            if (error) {
                return res.status(400).json({ error });
            }

            res.send();
        })
        .catch((e) => {
            return res.status(400).json({ error: e });
        });
});

export default router;
