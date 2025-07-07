window.addEventListener('load', function () {
	loadRunningShoes();

	document.querySelector('#add-new-run')?.addEventListener('click', function () {
		openAddRunForm();
	});

	document.querySelector('#form-dialog-cancel')?.addEventListener('click', function () {
		closeRunForm();
	});

	document.querySelector('form[name="run-form"]')?.addEventListener('submit', async function (e) {
		e.preventDefault();
		await saveRun();
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

function setProcessing(isProcessing) {
	const btn = document.querySelector('submit-form-button.save-run-submit');

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

function closeRunForm() {
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

	if (typeof loadRuns === 'function') {
		await loadRuns();
	}

	if (typeof loadOverview === 'function') {
		if (monthsChart) {
			monthsChart.destroy();
		}

		if (yearsChart) {
			yearsChart.destroy();
		}

		await loadOverview();
	}

	if (typeof loadRecentRuns === 'function') {
		await loadRecentRuns();
	}

	if (typeof loadRecentRunTrends === 'function') {
		await loadRecentRunTrends();
	}

	closeRunForm();
}

function breakOutTime(totalTime) {
	const { hours, minutes, seconds } = totalTime;

	const days = Math.floor(hours / 24);
	const hoursRemaining = hours % 24;

	return {
		days,
		hours: hoursRemaining,
		minutes,
		seconds
	};
}