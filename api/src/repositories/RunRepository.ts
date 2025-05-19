import { db } from '../lib/db';

import Run from '../models/Run';

import {
	addRun,
	deleteRun,
	getAllRuns,
	getRunsByShoe,
	updateRun,
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
	Distance: number;
	Elevation: number;
	HeartRate: number;
	ShoeId: number;
	ShoeName: string | null;
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
				distance: row.Distance,
				pace: CalculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
				shoeName: row.ShoeName,
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
				distance: row.Distance,
				pace: CalculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
				shoeName: row.ShoeName,
			});
		});

		return [null, runs];
	};

	static async AddRun(run: Run): Promise<string | null> {
		const error = await db.Execute(addRun, [
			run.dateRan,
			run.distance,
			run.hours,
			run.minutes,
			run.seconds,
			run.elevation,
			run.heartRate,
			run.temperature,
			run.shoeId,
		]);

		if (error) {
			return error;
		}

		return null;
	}

	static async UpdateRun(run: Run): Promise<string | null> {
		const error = await db.Execute(updateRun, [
			run.dateRan,
			run.distance,
			run.hours,
			run.minutes,
			run.seconds,
			run.elevation,
			run.heartRate,
			run.temperature,
			run.shoeId,
			run.runId,
		]);

		if (error) {
			return error;
		}

		return null;
	};

	static async DeleteRun(runId: number): Promise<string | null> {
		const error = await db.Execute(deleteRun, [runId]);

		return error;
	};
}

export default RunRepository;
