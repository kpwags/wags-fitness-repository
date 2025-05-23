export type RunOverview = {
	totals: RunTotals;
	years: YearlySummary[];
}

export type RunTotals = {
	runCount: number;
	distance: number;
	time: string;
	averagePace: string;
	averageDistance: number;
}

export type YearlySummary = {
	year: number;
	runCount: number;
	distance: number;
	time: string;
	averagePace: string;
	averageDistance: number;
	maxDistance: number;
}
