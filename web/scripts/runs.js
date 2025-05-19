let runs = [];
let shoes = [];

window.addEventListener('load', function () {
	loadRuns();
	loadRunningShoes();

	document.querySelector('#add-new-run')?.addEventListener('click', function () {
		openAddRunForm();
	});

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		closeShoeForm();
	});

	document.querySelector('form[name="run-form"]')?.addEventListener('submit', async function (e) {
		e.preventDefault();
		await saveRun();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-run-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function () {
		deleteRun();
	});
});

async function loadRunningShoes() {
	const [data, error] = await Api.Get('shoe');

	if (error) {
		showPageError(error);
		return;
	}

	if (data.length === 0) {
		shoes = [];
		return;
	}

	shoes = data.map((d) => {
		if (d.isRetired) {
			return {
				...d,
				name: `${d.name} (Retired)`,
			};
		}

		return d;
	});

	document.getElementById('shoe-id').appendChild(buildSelectList(shoes, 'shoeId', 'name'));
}

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

		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const dateCell = document.createElement('td');
		dateCell.textContent = dateRun.format('M/D/YYYY');

		tr.appendChild(dateCell);

		const tempCell = document.createElement('td');
		tempCell.classList.add('center-align');
		tempCell.textContent = run.temperature ? `${run.temperature}ºF` : '';

		tr.appendChild(tempCell);

		const timeCell = document.createElement('td');
		timeCell.classList.add('center-align');
		timeCell.textContent = run.runTime;

		tr.appendChild(timeCell);

		const distanceCell = document.createElement('td');
		distanceCell.classList.add('center-align');
		distanceCell.textContent = run.distance;

		tr.appendChild(distanceCell);

		const paceCell = document.createElement('td');
		paceCell.classList.add('center-align');
		paceCell.textContent = `${run.pace}/mi.`;

		tr.appendChild(paceCell);

		const elevationCell = document.createElement('td');
		elevationCell.classList.add('center-align');
		elevationCell.textContent = run.elevation ? run.elevation : '';

		tr.appendChild(elevationCell);

		const heartRateCell = document.createElement('td');
		heartRateCell.classList.add('center-align');
		heartRateCell.textContent = run.heartRate ? run.heartRate : '';

		tr.appendChild(heartRateCell);

		const shoeCell = document.createElement('td');
		shoeCell.textContent = run.shoeName ? run.shoeName : '';

		tr.appendChild(shoeCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			editRun(run);
		})

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			openDeleteConfirmation(run);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		tableFragment.appendChild(tr);

		previousDateRun = dateRun;
	});

	document.querySelector('#runs-table-body tr.loading')?.classList.add('hidden');
	document.getElementById('runs-table-body').appendChild(tableFragment);
}

function buildMonthlySummaryRow(rows) {
	const tr = document.createElement('tr');
	tr.classList.add('data-row');
	tr.classList.add('summary-row');

	const month = dayjs.tz(rows[0].dateRan, 'UTC').utc(true);

	const summaryCell = document.createElement('td');
	summaryCell.colSpan = 9;

	const contentSpan = document.createElement('span');
	contentSpan.classList.add('content');

	const monthYearSpan = document.createElement('span');
	monthYearSpan.classList.add('bolded');
	monthYearSpan.textContent = month.format('MMMM YYYY');

	contentSpan.appendChild(monthYearSpan);

	contentSpan.appendChild(titledSpan('Runs', rows.length));

	const rowsWithTemp = rows.filter((r) => r.temperature);

	contentSpan.appendChild(titledSpan('Distance', sumValues(rows.map((r) => r.distance)).toFixed(2)));

	contentSpan.appendChild(titledSpan('Average Pace', `${calculateAveragePaceForRuns(rows)}/mi.`))
	
	contentSpan.appendChild(titledSpan('Average Distance', calculateAverage(rows.map((r) => r.distance)).toFixed(2)));

	const rowsWithHeartRate = rows.filter((r) => r.heartRate);

	if (rowsWithHeartRate.length > 0) {
		const averageHeartRate = Math.round(calculateAverage(rowsWithHeartRate.map((r) => r.heartRate)));
		
		if (averageHeartRate > 0) {
			contentSpan.appendChild(titledSpan('Average Heart Rate', averageHeartRate));
		}
	}

	if (rowsWithTemp.length > 0) {
		const averageTemperature = Math.round(calculateAverage(rowsWithTemp.map((r) => r.temperature)));
		
		if (averageTemperature > 0) {
			contentSpan.appendChild(titledSpan('Average Temperature', `${averageTemperature}ºF`));
		}
	}
	
	summaryCell.appendChild(contentSpan);
	
	tr.appendChild(summaryCell);

	return tr;
}

function setProcessing(isProcessing) {
	const btn = document.querySelector('submit-form-button');

	if (isProcessing) {
		btn.setAttribute('processing', 'true');
		btn.setAttribute('buttontext', 'Saving');
		document.querySelectorAll('form[name="run-form"] button').forEach((b) => b.setAttribute('disabled', 'true'));
	
	} else {
		btn.setAttribute('processing', 'false');
		btn.setAttribute('buttontext', 'Save');
		document.querySelectorAll('form[name="run-form"] button').forEach((b) => b.removeAttribute('disabled'));
	}
}

function openAddRunForm() {
	document.querySelector('#run-form-dialog h3').textContent = 'Add Run';
	document.querySelector('dialog#run-form-dialog input#runId').value = '0';
	document.querySelector('dialog#run-form-dialog input#date-run').value = dayjs().format('YYYY-MM-DD');

	const activeShoes = shoes.filter((s) => !s.isRetired);

	if (activeShoes.length === 1) {
		document.querySelector('select#shoe-id').value = activeShoes[0].shoeId;
	}

	document.querySelector('dialog#run-form-dialog').showModal();
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

function closeShoeForm() {
	document.querySelector('form[name="run-form"]').reset();
	document.querySelector('dialog#run-form-dialog').close();
	setProcessing(false);
}

function buildRunData() {
	return {
		runId: parseInt(document.querySelector('input#runId').value),
		dateRan: document.querySelector('input#date-run').value,
		distance: parseFloat(document.querySelector('input#distance').value),
		hours: parseInt(document.querySelector('input#hours').value),
		minutes: parseInt(document.querySelector('input#minutes').value),
		seconds: parseInt(document.querySelector('input#seconds').value),
		temperature: parseInt(document.querySelector('input#temperature').value),
		heartRate: parseInt(document.querySelector('input#heart-rate').value),
		elevation: parseInt(document.querySelector('input#elevation').value),
		shoeId: parseInt(document.querySelector('select#shoe-id').value),
	}
}

async function addRun(values) {
	const [, error] = await Api.Post('run', {
		data: values,
	});

	return error;
}

async function updateRun(values) {
	const [, error] = await Api.Put(`run/${values.runId}`, {
		data: values,
	});

	return error;
}

async function saveRun() {
	hideModalError('modal-error');
	setProcessing(true);

	const values = buildRunData();

	const error = values.runId > 0
		? await updateRun(values)
		: await addRun(values);

	if (error) {
		showModalError(error, 'modal-error');
		setProcessing(false);
		return;
	}

	await loadRuns();

	closeShoeForm();
}

function openDeleteConfirmation(run) {
	document.getElementById('delete-run-id').value = run.runId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the run on ${dayjs.tz(run.dateRan, 'UTC').utc(true).format('MM/DD/YYYY')}?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteRun() {
	const runId = document.getElementById('delete-run-id').value;

	const [, error] = await Api.Delete(`run/${runId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadRuns();

	document.querySelector('dialog.confirm-dialog').close();
}
