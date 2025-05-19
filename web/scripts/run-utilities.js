function calculateAveragePaceForRuns(runs) {
	const runCount = runs.length;

	const totalDistance = runs.reduce((a, { distance }) => a + distance, 0);
	let totalMinutes = 0;

	runs.forEach((run) => {
		totalMinutes += (run.hours * 60 + run.minutes + run.seconds / 60);
	});

	const pace = totalMinutes / totalDistance;

	const paceMinutes = Math.floor(pace);
	const paceSeconds = Math.round((pace - paceMinutes) * 60);

	return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
}
