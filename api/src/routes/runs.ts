import express from 'express';
import RunRepository from '../repositories/RunRepository';

const router = express.Router();

router.get('/shoe/:id', (req, res) => {
	const id = parseInt(req.params.id);

	RunRepository.GetRunsForShoe(id, (error, data) => {
		if (error) {
			return res.status(400).json({ error });
		}

		res.json(data);
	});
});

export default router;
