let runs = [];

window.addEventListener('load', function () {
	loadRuns();
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

	runs.forEach((run) => {
		const tr = document.createElement('tr');
		tr.classList.add('data-row');

		const dateCell = document.createElement('td');
		dateCell.textContent = dayjs.tz(run.dateRan, 'UTC').utc(true).format('M/D/YYYY');

		tr.appendChild(dateCell);

		const tempCell = document.createElement('td');
		tempCell.textContent = run.temperature ? `${run.temperature}ºF` : '';

		tr.appendChild(tempCell);

		const timeCell = document.createElement('td');
		timeCell.textContent = run.runTime;

		tr.appendChild(timeCell);

		const distanceCell = document.createElement('td');
		distanceCell.textContent = run.milesRun;

		tr.appendChild(distanceCell);

		const paceCell = document.createElement('td');
		paceCell.textContent = run.pace;

		tr.appendChild(paceCell);

		const elevationCell = document.createElement('td');
		elevationCell.textContent = run.elevation ? run.elevation : '';

		tr.appendChild(elevationCell);

		const heartRateCell = document.createElement('td');
		heartRateCell.textContent = run.heartRate ? run.heartRate : '';

		tr.appendChild(heartRateCell);

		const shoeCell = document.createElement('td');
		heartRateCell.textContent = run.shoe ? run.shoe : '';

		tr.appendChild(shoeCell);

		const actionsCell = document.createElement('td');

		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.classList.add('btn-link');
		editButton.addEventListener('click', function () {
			console.log(shoe.shoeId);
		})

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn-link');
		deleteButton.addEventListener('click', function () {
			console.log(shoe);
		});

		actionsCell.appendChild(editButton);
		actionsCell.appendChild(deleteButton);

		tr.appendChild(actionsCell);

		tableFragment.appendChild(tr);
	});

	document.querySelector('#runs-table-body tr.loading')?.classList.add('hidden');
	document.getElementById('runs-table-body').appendChild(tableFragment);
}
