let bikes = [];
let activeBikes = [];
let retiredBikes = [];

window.addEventListener('load', function () {
	loadBikes();

	document.querySelector('#add-new-bike')?.addEventListener('click', function () {
		document.querySelector('#bike-form-dialog h3').textContent = 'Add Bike';
		document.querySelector('dialog#bike-form-dialog input#bike-id').value = '0';
		document.querySelector('dialog#bike-form-dialog').showModal();
	});

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		closeBikeForm();
	});

	document.querySelector('form[name="bike-form"]')?.addEventListener('submit', async function (e) {
		e.preventDefault();
		await saveBike();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-bike-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function () {
		deleteBike();
	});
});

function setProcessing(isProcessing) {
	const btn = document.querySelector('submit-form-button');

	if (isProcessing) {
		btn.setAttribute('processing', 'true');
		btn.setAttribute('buttontext', 'Saving');
		document.querySelectorAll('form[name="bike-form"] button').forEach((b) => b.setAttribute('disabled', 'true'));
	
	} else {
		btn.setAttribute('processing', 'false');
		btn.setAttribute('buttontext', 'Save');
		document.querySelectorAll('form[name="bike-form"] button').forEach((b) => b.removeAttribute('disabled'));
	}
}

async function loadBikes() {
	const [data, error] = await Api.Get('bike');

	if (error) {
		showPageError(error);
		showNoDataForTable('#active-bikes-table-body');
		showNoDataForTable('#retired-bikes-table-body');
		return;
	}

	if (data.length === 0) {
		showNoDataForTable('#active-bikes-table-body');
		showNoDataForTable('#retired-bikes-table-body');
		return;
	}

	bikes = data;
	activeBikes = data.filter((d) => !d.isRetired);
	retiredBikes = data.filter((d) => d.isRetired);

	loadTable();
}

function loadTable() {
	clearTableRows('#active-bikes-table-body tr.data-row');
	clearTableRows('#retired-bikes-table-body tr.data-row');

	const activeBikesfragment = document.createDocumentFragment();
	const retiredBikesfragment = document.createDocumentFragment();

	if (bikes.length > 0) {
		bikes.forEach((bike) => {
			if (bike.isRetired) {
				retiredBikesfragment.appendChild(buildRetiredBikeRow(bike));
			} else {
				activeBikesfragment.appendChild(buildActiveBikeRow(bike));
			}
		});

		if (retiredBikes.length > 0) {
			document.querySelector('#retired-bikes-table-body tr.loading')?.classList.add('hidden');
			document.getElementById('retired-bikes-table-body').appendChild(retiredBikesfragment);
		} else {
			showNoDataForTable('#retired-bikes-table-body');
		}

		if (activeBikes.length > 0) {
			document.querySelector('#active-bikes-table-body tr.loading')?.classList.add('hidden');
			document.getElementById('active-bikes-table-body').appendChild(activeBikesfragment);
		} else {
			showNoDataForTable('#active-bikes-table-body');
		}
	} else {
		showNoDataForTable('#active-bikes-table-body');
		showNoDataForTable('#retired-bikes-table-body');
	}
}

function buildActiveBikeRow(bike) {
	const template = document.querySelector('template#active-bike-row');

	const tr = template.content.cloneNode(true);

	tr.querySelector('.name-col').textContent = bike.name;
	// TODO Add Distance & Count
	// tr.querySelector('.runs-col').textContent = bike.rideCount;
	// tr.querySelector('.miles-col').textContent = bike.distance.toFixed(2);

	tr.querySelector('.btn-edit').addEventListener('click', function () {
		editBike(bike);
	});

	tr.querySelector('.btn-delete').addEventListener('click', function () {
		openDeleteConfirmation(bike);
	});

	return tr;
}

function buildRetiredBikeRow(bike) {
	const template = document.querySelector('template#retired-bike-row');

	const tr = template.content.cloneNode(true);

	tr.querySelector('.name-col').textContent = bike.name;

	// TODO: Add Distance & Count
	// tr.querySelector('.runs-col').textContent = bike.rideCount;
	// tr.querySelector('.miles-col').textContent = bike.distance.toFixed(2);
	
	if (bike.dateFirstRode && bike.dateLastRode) {
		const firstYearRun = dayjs.tz(bike.dateFirstRode, 'UTC').utc(true).format('YYYY');
		const lastYearRun = dayjs.tz(bike.dateLastRode, 'UTC').utc(true).format('YYYY');

		tr.querySelector('.years-col').textContent = firstYearRun === lastYearRun ? firstYearRun : `${firstYearRun} - ${lastYearRun}`;
	} else {
		tr.querySelector('.years-col').textContent = 'Unknown';
	}

	tr.querySelector('.btn-edit').addEventListener('click', function () {
		editBike(bike);
	});

	tr.querySelector('.btn-delete').addEventListener('click', function () {
		openDeleteConfirmation(bike);
	});

	return tr;
}

function closeBikeForm() {
	document.querySelector('form[name="bike-form"]').reset();
	document.querySelector('dialog#bike-form-dialog').close();
	setProcessing(false);
}

function editBike(bike) {
	if (bike) {
		document.querySelector('#bike-form-dialog h3').textContent = 'Edit Bike';
		document.querySelector('input#bike-id').value = bike.bikeId;
		document.querySelector('input#name').value = bike.name;
		document.querySelector('input#is-retired').checked = bike.isRetired;

		document.querySelector('dialog#bike-form-dialog').showModal();
	}
}

function buildBikeData() {
	return {
		bikeId: parseInt(document.querySelector('input#bike-id').value),
		name: document.querySelector('input#name').value,
		isRetired: document.querySelector('input#is-retired').checked,
	}
}

async function addBike(values) {
	const [, error] = await Api.Post('bike', {
		data: values,
	});

	return error;
}

async function updateBike(values) {
	const [, error] = await Api.Put(`bike/${values.bikeId}`, {
		data: values,
	});

	return error;
}

async function saveBike() {
	hideModalError('modal-error');
	setProcessing(true);

	const values = buildBikeData();

	const error = values.bikeId > 0
		? await updateBike(values)
		: await addBike(values);

	if (error) {
		showModalError(error, 'modal-error');
		setProcessing(false);
		return;
	}

	await loadBikes();

	closeBikeForm();
}

function openDeleteConfirmation(bike) {
	document.getElementById('delete-bike-id').value = bike.bikeId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the bike "${bike.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteBike() {
	const bikeId = document.getElementById('delete-bike-id').value;

	const [, error] = await Api.Delete(`bike/${bikeId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadBikes();

	document.querySelector('dialog.confirm-dialog').close();
}