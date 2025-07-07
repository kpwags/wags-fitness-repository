import { db } from '../lib/db';
import dayjs from 'dayjs';

import Run from '../models/Run';
import { RunOverview, RunTotals, YearlySummary } from '../models/RunOverview';

import {
	addRun,
	deleteRun,
	getAllRuns,
	getRunsByShoe,
	updateRun,
} from '../queries/runs';
import {
	addRunTimes,
	buildYearlySummary,
	calculatePace,
	displayRunTime,
	getTotalDistance,
} from '../lib/runFunctions';

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
				pace: calculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
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
				pace: calculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
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

	static async GetOverview(): Promise<[error: string | null, overview: RunOverview | null]> {
		const [runsError, runs] = await this.GetAllRuns();

		if (runsError) {
			return [runsError, null];
		}

		const totalDistance = getTotalDistance(runs);
		const totalTime = addRunTimes(runs.map((r) => ({ hours: r.hours, minutes: r.minutes, seconds: r.seconds })));

		const totals: RunTotals = {
			runCount: runs.length,
			distance: parseFloat(totalDistance.toFixed(2)),
			totalTime,
			time: displayRunTime(totalTime),
			averagePace: calculatePace(totalDistance, totalTime.hours, totalTime.minutes, totalTime.seconds),
			averageDistance: parseFloat((totalDistance / runs.length).toFixed(2)),
		};

		const years = [...new Set(runs.map((r) => parseInt(dayjs(r.dateRan).format('YYYY'))))];
		years.sort();

		const yearData: YearlySummary[] = [];

		years.forEach((y) => {
			const runsForYear = runs.filter((r) => parseInt(dayjs(r.dateRan).format('YYYY')) === y);

			yearData.push(buildYearlySummary(runsForYear, y));
		});

		return [
			null,
			{
				totals,
				years: yearData,
			},
		]
	}

	static async GetRecentRuns(limit = 10): Promise<[error: string | null, runs: Run[]]> {
		const [error, data] = await db.Query<RunQueryReturn>(getAllRuns);

		if (error) {
			return [error, []];
		}

		const runs: Run[] = [];

		data.slice(0, limit).forEach((row) => {
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
				pace: calculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
				shoeName: row.ShoeName,
			});
		});

		return [null, runs];
	}

	static async GetRunsForLastMonths(limit = 6): Promise<[error: string | null, runs: { month: string; runs: Run[] }[]]> {
		const [error, data] = await db.Query<RunQueryReturn>(getAllRuns);

		if (error) {
			return [error, []];
		}

		const months: { month: string; runs: Run[] }[] = [];

		let currentMonth = 'START';
		let currentRuns: Run[] = [];

		data.forEach((row) => {
			const month = dayjs(row.DateRan).format('MMM YYYY');

			if (month !== currentMonth) {
				if (currentMonth !== 'START') {
					months.push({ month: currentMonth, runs: currentRuns });
				}

				currentRuns = [];
				currentMonth = month;
			}

			currentRuns.push({
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
				pace: calculatePace(row.Distance, row.Hours, row.Minutes, row.Seconds),
				elevation: row.Elevation,
				heartRate: row.HeartRate,
				shoeId: row.ShoeId,
				shoeName: row.ShoeName,
			});
		});

		return [null, months.slice(0, limit)];
	}
}

export default RunRepository;
