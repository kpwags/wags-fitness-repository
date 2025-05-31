let overviewData = {
	totals: {
		runCount: 0,
		distance: 0,
		time: '',
		totalTime: { hours: 0, minutes: 0, seconds: 0 },
		averagePace: '',
		averageDistance: 0,
	},
	years: []
};
let recentRuns = [];

let monthsChart;
let yearsChart;

window.addEventListener('load', function () {
	loadOverview();
	loadRecentRuns();
	loadRecentRunTrends();
});

async function loadOverview() {
	const [data, error] = await Api.Get('run/overview');

	if (error) {
		showPageError(error);
		showNoDataForTable('#yearly-summary-table-body');
		return;
	}

	if (data.years.length === 0) {
		showNoDataForTable('#yearly-summary-table-body');
		return;
	}

	overviewData = data;

	loadTotals();
	loadYearlySummary();
}

function loadTotals() {
	document.querySelector('.running-totals-table .runs-cell').textContent = numberWithCommas(overviewData.totals.runCount);
	document.querySelector('.running-totals-table .distance-cell').textContent = numberWithCommas(overviewData.totals.distance);
	document.querySelector('.running-totals-table .pace-cell').textContent = `${overviewData.totals.averagePace}/mi.`;
	document.querySelector('.running-totals-table .avg-distance-cell').textContent = overviewData.totals.averageDistance;

	const results = breakOutTime(overviewData.totals.totalTime);

	const template = document.querySelector('template#total-time-list');

	const timeDiv = template.content.cloneNode(true);

	timeDiv.querySelector('.days-line').textContent = results.days;
	timeDiv.querySelector('.hours-line').textContent = results.hours;
	timeDiv.querySelector('.minutes-line').textContent = results.minutes;
	timeDiv.querySelector('.seconds-line').textContent = results.seconds;

	document.querySelector('.running-totals-table .time-cell').appendChild(timeDiv);
}

function loadYearlySummary() {
	const tableFragment = document.createDocumentFragment();

	overviewData.years.forEach((year) => {
		const template = document.querySelector('template#year-summary-row');

		const tr = template.content.cloneNode(true);

		tr.querySelector('.year-col').textContent = year.year;
		tr.querySelector('.runs-col').textContent = year.runCount;
		tr.querySelector('.distance-col').textContent = year.distance.toFixed(2);
		tr.querySelector('.time-col').textContent = year.time;
		tr.querySelector('.pace-col').textContent = `${year.averagePace}/mi.`;
		tr.querySelector('.avg-distance-col').textContent = year.averageDistance.toFixed(2)
		tr.querySelector('.max-distance-col').textContent = year.maxDistance.toFixed(2)
			;
		tableFragment.appendChild(tr);
	});

	document.querySelector('#yearly-summary-table-body tr.loading')?.classList.add('hidden');
	document.getElementById('yearly-summary-table-body').appendChild(tableFragment);

	buildYearlyChart();
}

async function loadRecentRuns() {
	const [data, error] = await Api.Get('run/recent/10');

	if (error) {
		showPageError(error);
		showNoDataForTable('#runs-table-body');
		return;
	}

	if (data.length === 0) {
		showNoDataForTable('#runs-table-body');
		return;
	}

	recentRuns = data;

	const tableFragment = document.createDocumentFragment();

	recentRuns.forEach((run) => {
		const dateRun = dayjs.tz(run.dateRan, 'UTC').utc(true);

		const template = document.querySelector('template#run-row');

		const tr = template.content.cloneNode(true);

		tr.querySelector('.date-col').textContent = dateRun.format('M/D/YYYY');
		tr.querySelector('.time-col').textContent = run.runTime;
		tr.querySelector('.distance-col').textContent = run.distance.toFixed(2);
		tr.querySelector('.pace-col').textContent = `${run.pace}/mi.`;
		tr.querySelector('.elevation-col').textContent = run.elevation ? run.elevation : '';
		tr.querySelector('.hr-col').textContent = run.heartRate ? run.heartRate : '';

		tableFragment.appendChild(tr);
	});

	document.querySelector('#runs-table-body tr.loading')?.classList.add('hidden');
	document.getElementById('runs-table-body').appendChild(tableFragment);
}

async function loadRecentRunTrends() {
	const [data, error] = await Api.Get('run/month/12');

	if (error) {
		showPageError(error);
		return;
	}

	if (data.length === 0) {
		return;
	}

	const chartData = data.reverse().map((d) => ({
		label: d.month,
		value: d.runs.reduce((a, { distance }) => a + distance, 0),
	}));

	monthsChart = new Chart(
		document.getElementById('recent-run-trends'),
		{
			type: 'bar',
			data: {
				labels: chartData.map((c) => c.label),
				datasets: [
					{
						label: 'Running Distance by Month',
						data: chartData.map((c) => c.value),
						backgroundColor: theme.green3,
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false,
					},
				}
			}
		}
	);
}

function buildYearlyChart() {
	const yearData = structuredClone(overviewData.years);

	const chartData = yearData
		.reverse()
		.slice(0, 10)
		.reverse()
		.map((d) => ({
			label: d.year,
			value: d.distance,
		}));

	yearsChart = new Chart(
		document.getElementById('yearly-run-trends'),
		{
			type: 'bar',
			data: {
				labels: chartData.map((c) => c.label),
				datasets: [
					{
						label: 'Running Distance by Year',
						data: chartData.map((c) => c.value),
						backgroundColor: theme.green5,
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false,
					},
				}
			}
		}
	);
}
