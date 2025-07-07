let runs = [];
let shoes = [];

window.addEventListener('load', function () {
	loadRuns();

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-run-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function () {
		deleteRun();
	});
});

async function loadRuns() {
	const [data, error] = await Api.Get('run');

	if (error) {
		showPageError(error);
		showNoDataForTable('#runs-table-body');
		return;
	}

	if (data.length === 0) {
		showNoDataForTable('#runs-table-body');
		return;
	}

	runs = data;

	loadTable();
}

function loadTable() {
	clearTableRows();

	const tableFragment = document.createDocumentFragment();

	let previousDateRun = dayjs.tz(runs[0].dateRan, 'UTC').utc(true);

	runs.forEach((run) => {
		const dateRun = dayjs.tz(run.dateRan, 'UTC').utc(true);

		if (dateRun.format('MMYYYY') !== previousDateRun.format('MMYYYY')) {
			const summaryRow = buildMonthlySummaryRow(runs.filter((r) => dayjs.tz(r.dateRan, 'UTC').utc(true).format('YYYYMM') === previousDateRun.format('YYYYMM')));

			tableFragment.appendChild(summaryRow);
		}

		const template = document.querySelector('template#run-row');

		const tr = template.content.cloneNode(true);

		tr.querySelector('.date-col').textContent = dateRun.format('M/D/YYYY');
		tr.querySelector('.temperature-col').textContent = run.temperature ? `${run.temperature}ºF` : '';
		tr.querySelector('.time-col').textContent = run.runTime;
		tr.querySelector('.distance-col').textContent = run.distance.toFixed(2);
		tr.querySelector('.pace-col').textContent = `${run.pace}/mi.`;
		tr.querySelector('.elevation-col').textContent = run.elevation ? run.elevation : '';
		tr.querySelector('.hr-col').textContent = run.heartRate ? run.heartRate : '';
		tr.querySelector('.shoes-col').textContent = run.shoeName ? run.shoeName : '';

		tr.querySelector('.btn-edit').addEventListener('click', function () {
			editRun(run);
		});

		tr.querySelector('.btn-delete').addEventListener('click', function () {
			openDeleteConfirmation(run);
		});

		tableFragment.appendChild(tr);

		previousDateRun = dateRun;
	});

	document.querySelector('#runs-table-body tr.loading')?.classList.add('hidden');
	document.getElementById('runs-table-body').appendChild(tableFragment);
}

function buildMonthlySummaryRow(rows) {
	const template = document.querySelector('template#monthly-summary-row');

	const tr = template.content.cloneNode(true);

	const month = dayjs.tz(rows[0].dateRan, 'UTC').utc(true);

	tr.querySelector('.month-cell').textContent = month.format('MMMM YYYY');
	tr.querySelector('.runs-cell').textContent = rows.length;
	tr.querySelector('.distance-cell').textContent = sumValues(rows.map((r) => r.distance)).toFixed(2);
	tr.querySelector('.pace-cell').textContent = `${calculateAveragePaceForRuns(rows)}/mi.`;
	tr.querySelector('.avg-distance-cell').textContent = calculateAverage(rows.map((r) => r.distance)).toFixed(2);

	const rowsWithTemp = rows.filter((r) => r.temperature);
	const rowsWithHeartRate = rows.filter((r) => r.heartRate);

	if (rowsWithHeartRate.length > 0) {
		const averageHeartRate = Math.round(calculateAverage(rowsWithHeartRate.map((r) => r.heartRate)));
		
		if (averageHeartRate > 0) {
			tr.querySelector('.hr-cell').textContent = averageHeartRate;
		}
	}

	if (rowsWithTemp.length > 0) {
		const averageTemperature = Math.round(calculateAverage(rowsWithTemp.map((r) => r.temperature)));
		
		if (averageTemperature > 0) {
			tr.querySelector('.temp-cell').textContent = `${averageTemperature}ºF`;
		}
	}

	return tr;
}

function editRun(run) {
	if (run) {
		document.querySelector('#run-form-dialog h3').textContent = 'Edit Run';
		document.querySelector('dialog#run-form-dialog input#runId').value = run.runId;
		document.querySelector('input#date-run').value = dayjs.tz(run.dateRan, 'UTC').utc(true).format('YYYY-MM-DD');
		document.querySelector('input#distance').value = run.distance;
		document.querySelector('input#hours').value = run.hours;
		document.querySelector('input#minutes').value = run.minutes;
		document.querySelector('input#seconds').value = run.seconds;
		document.querySelector('input#temperature').value = run.temperature;
		document.querySelector('input#heart-rate').value = run.heartRate;
		document.querySelector('input#elevation').value = run.elevation;
		document.querySelector('select#shoe-id').value = run.shoeId;

		document.querySelector('dialog#run-form-dialog').showModal();
	}
}

function openDeleteConfirmation(run) {
	document.getElementById('delete-run-id').value = run.runId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the run on ${dayjs.tz(run.dateRan, 'UTC').utc(true).format('MM/DD/YYYY')}?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

function setDeleteConfirmationProcessing(isProcessing) {
	const btn = document.querySelector('submit-form-button.confirm-dialog-yes-button');

	if (isProcessing) {
		btn.setAttribute('processing', 'true');
		btn.setAttribute('buttontext', 'Deleting');
		document.querySelectorAll('.confirm-dialog button').forEach((b) => b.setAttribute('disabled', 'true'));
	} else {
		btn.setAttribute('processing', 'false');
		btn.setAttribute('buttontext', 'Yes');
		document.querySelectorAll('.confirm-dialog button').forEach((b) => b.removeAttribute('disabled'));
	}
}

async function deleteRun() {
	setDeleteConfirmationProcessing(true);

	const runId = document.getElementById('delete-run-id').value;

	const [, error] = await Api.Delete(`run/${runId}`);

	if (error) {
		showPageError(error);
		setDeleteConfirmationProcessing(false);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadRuns();

	setDeleteConfirmationProcessing(false);
	document.querySelector('dialog.confirm-dialog').close();
}
