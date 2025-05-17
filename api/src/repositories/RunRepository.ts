import { db } from '../lib/db';
import cleanSqliteError from '../lib/cleanSqliteError';

import Run from '../models/Run';

import {
	getRunsByShoe,
} from '../queries/runs';
import displayRunTime from '../lib/displayRunTime';

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
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
			});
		});

		return [null, runs];
	};
}

export default RunRepository;
