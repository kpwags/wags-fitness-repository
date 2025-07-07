import { Run } from "@models/Run";
import { YearlySummary } from "@models/RunOverview";
import { RunTime } from "@models/RunTime";

export const calculatePace = (distance: number, hours: number, minutes: number, seconds: number): string => {
	const totalMinutes = hours * 60 + minutes + seconds / 60;

	const pace = totalMinutes / distance;

	const paceMinutes = Math.floor(pace);
	const paceSeconds = Math.round((pace - paceMinutes) * 60);

	return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
}

export const addRunTimes = (runTimes: RunTime[]): RunTime => {
	let totalSeconds = 0;

	runTimes.forEach((r) => {
		totalSeconds += (r.hours * 3600) + (r.minutes * 60) + r.seconds;
	});

	const hours = Math.floor(totalSeconds / 3600);

	let remainingSeconds = totalSeconds % 3600;

	const minutes = Math.floor(remainingSeconds / 60);

	const seconds = remainingSeconds % 60;

	return {
		hours,
		minutes,
		seconds,
	};
}

export const getTotalDistance = (runs: Run[]): number => runs.reduce((a, { distance }) => a + distance, 0);

export const displayRunTime = (runTime: RunTime): string => `${runTime.hours}:${String(runTime.minutes).padStart(2, '0')}:${String(runTime.seconds).padStart(2, '0')}`;

export const buildYearlySummary = (runs: Run[], year: number): YearlySummary => {
	const totalDistance = getTotalDistance(runs);
	const totalTime = addRunTimes(runs.map((r) => ({ hours: r.hours, minutes: r.minutes, seconds: r.seconds })));

	return {
		year,
		runCount: runs.length,
		distance: parseFloat(totalDistance.toFixed(2)),
		time: displayRunTime(totalTime),
		averagePace: calculatePace(totalDistance, totalTime.hours, totalTime.minutes, totalTime.seconds),
		averageDistance: parseFloat((totalDistance / runs.length).toFixed(2)),
		maxDistance: Math.max.apply(null, runs.map((r) => r.distance)),
	}
}