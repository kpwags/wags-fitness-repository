export const CalculatePace = (distance: number, hours: number, minutes: number, seconds: number): string => {
	const totalMinutes = hours * 60 + minutes + seconds / 60;

	const pace = totalMinutes / distance;

	const paceMinutes = Math.floor(pace);
	const paceSeconds = Math.round((pace - paceMinutes) * 60);

	return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
}