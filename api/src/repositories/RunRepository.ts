import { db } from '../lib/db';

import Run from '../models/Run';

import {
	getAllRuns,
	getRunsByShoe,
} from '../queries/runs';
import displayRunTime from '../lib/displayRunTime';
import { CalculatePace } from '../lib/runFunctions';

type RunQueryReturn = {
	RunId: number;
	DateRan: Date;
	Temperature: number;
	Hours: number;
	Minutes: number;
	Seconds: number;
	RunTime: string;
	MilesRun: number;
	Elevation: number;
	HeartRate: number;
	ShoeId: number;
}

class RunRepository {
	static async GetAllRuns(): Promise<[error: string | null, runs: Run[]]> {
		const [error, data] = await db.Query<RunQueryReturn>(getAllRuns);

		if (error) {
			return [error, []];
		}

		const runs: Run[] = [];

		data.forEach((row) => {
			runs.push({
				runId: row.RunId,
				dateRan: row.DateRan,
				temperature: row.Temperature,
				hours: row.Hours,
				minutes: row.Minutes,
				seconds: row.Seconds,
				runTime: displayRunTime({
					hours: row.Hours,
					minutes: row.Minutes,
					seconds: row.Seconds,
				}),
				milesRun: row.MilesRun,
				pace: CalculatePace(row.MilesRun, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
			});
		});

		return [null, runs];
	};

	static async GetRunsForShoe(shoeId: number): Promise<[error: string | null, runs: Run[]]> {
		const [error, data] = await db.Query<RunQueryReturn>(getRunsByShoe, [shoeId]);

		if (error) {
			return [error, []];
		}

		const runs: Run[] = [];

		data.forEach((row) => {
			runs.push({
				runId: row.RunId,
				dateRan: row.DateRan,
				temperature: row.Temperature,
				hours: row.Hours,
				minutes: row.Minutes,
				seconds: row.Seconds,
				runTime: displayRunTime({
					hours: row.Hours,
					minutes: row.Minutes,
					seconds: row.Seconds,
				}),
				milesRun: row.MilesRun,
				pace: CalculatePace(row.MilesRun, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
			});
		});

		return [null, runs];
	};
}

export default RunRepository;
