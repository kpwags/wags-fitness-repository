import RunTime from "../models/RunTime"

export default (runTimes: RunTime[]): RunTime => {
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