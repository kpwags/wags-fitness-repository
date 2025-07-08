import express from 'express';
import { BikeRepository } from '@repositories/BikeRepository';
import { Bike } from '@models/Bike';

const bikeRouter = express.Router();

bikeRouter.get('/active', (_, res) => {
	BikeRepository.GetAllBikes(true)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bikeRouter.get('/:id', async (req, res) => {
	const id = parseInt(req.params.id);

	BikeRepository.GetBikeById(id)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bikeRouter.get('/', async (_, res) => {
	BikeRepository.GetAllBikes(false)
		.then(([error, data]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json(data);
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bikeRouter.post('/', (req, res) => {
	const formBody = req.body;

	const bike: Bike = {
		bikeId: 0,
		name: formBody.name,
		isRetired: formBody.isRetired,
	};

	BikeRepository.AddBike(bike)
		.then(([error, bikeId]) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.json({ bikeId });
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bikeRouter.put('/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const formBody = req.body;

	const bike: Bike = {
		bikeId: id,
		name: formBody.name,
		isRetired: formBody.isRetired,
	};

	BikeRepository.UpdateBike(bike)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

bikeRouter.delete('/:id', (req, res) => {
	const id = parseInt(req.params.id);

	BikeRepository.DeleteBike(id)
		.then((error) => {
			if (error) {
				return res.status(400).json({ error });
			}

			return res.send();
		})
		.catch((e) => {
			return res.status(400).json({ error: e });
		});
});

export { bikeRouter };
