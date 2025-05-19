import express from 'express';
import RunRepository from '../repositories/RunRepository';
import Run from '../models/Run';

const router = express.Router();

router.get('/shoe/:id', (req, res) => {
	const id = parseInt(req.params.id);

	RunRepository.GetRunsForShoe(id)
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

router.get('/', (_, res) => {
	RunRepository.GetAllRuns()
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

    const run: Run = {
        runId: 0,
		dateRan: formBody.dateRan,
		distance: parseFloat(formBody.distance),
		hours: parseInt(formBody.hours),
		minutes: parseInt(formBody.minutes),
		seconds: parseInt(formBody.seconds),
		elevation: parseInt(formBody.elevation),
		heartRate: parseInt(formBody.heartRate),
		temperature: parseInt(formBody.temperature),
		shoeId: parseInt(formBody.shoeId) > 0 ? parseInt(formBody.shoeId) : null,
    };

    RunRepository.AddRun(run)
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

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const formBody = req.body;

    const run: Run = {
        runId: id,
		dateRan: formBody.dateRan,
		distance: parseFloat(formBody.distance),
		hours: parseInt(formBody.hours),
		minutes: parseInt(formBody.minutes),
		seconds: parseInt(formBody.seconds),
		elevation: parseInt(formBody.elevation),
		heartRate: parseInt(formBody.heartRate),
		temperature: parseInt(formBody.temperature),
		shoeId: parseInt(formBody.shoeId) > 0 ? parseInt(formBody.shoeId) : null,
    };

    RunRepository.UpdateRun(run)
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

    RunRepository.DeleteRun(id)
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
