import sqlite3 from 'sqlite3';
import config from '../config';
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
	private static GetDatabase = () => new sqlite3.Database(config.db);

	static readonly GetRunsForShoe = (shoeId: number, callback: (error: string | null, runs: Run[]) => void) => {
		const db = this.GetDatabase();

		const runs: Run[] = [];

		db.all(getRunsByShoe, [shoeId], (err: any, rows: RunQueryReturn[]) => {
			db.close();

			if (err) {
				return callback(cleanSqliteError(err), []);
			}

			rows.forEach((row) => {
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

			return callback(null, runs);
		});
	};
}

export default RunRepository;
