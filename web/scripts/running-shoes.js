let runningShoes = [];
let activeShoes = [];
let retiredShoes = [];

window.addEventListener('load', function () {
	loadRunningShoes();

	document.querySelector('#add-new-shoe')?.addEventListener('click', function () {
		document.querySelector('#shoe-form-dialog h3').textContent = 'Add Shoe';
		document.querySelector('dialog#shoe-form-dialog input#shoeId').value = '0';
		document.querySelector('dialog#shoe-form-dialog input#purchase-date').value = dayjs().format('YYYY-MM-DD');
		document.querySelector('dialog#shoe-form-dialog').showModal();
	});

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		closeShoeForm();
	});

	document.querySelector('form[name="shoe-form"]')?.addEventListener('submit', async function (e) {
		e.preventDefault();
		await saveShoe();
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-no').addEventListener('click', function () {
		cancelOutOfConfirmDialog('#delete-shoe-id');
	});

	document.querySelector('dialog.confirm-dialog button.confirm-dialog-yes').addEventListener('click', function () {
		deleteShoe();
	});
});

function setProcessing(isProcessing) {
	const btn = document.querySelector('submit-form-button');

	if (isProcessing) {
		btn.setAttribute('processing', 'true');
		btn.setAttribute('buttontext', 'Saving');
		document.querySelectorAll('form[name="shoe-form"] button').forEach((b) => b.setAttribute('disabled', 'true'));
	
	} else {
		btn.setAttribute('processing', 'false');
		btn.setAttribute('buttontext', 'Save');
		document.querySelectorAll('form[name="shoe-form"] button').forEach((b) => b.removeAttribute('disabled'));
	}
}

async function loadRunningShoes() {
	const [data, error] = await Api.Get('shoe');

	if (error) {
		showPageError(error);
		showNoDataForTable('#active-running-shoes-table-body');
		showNoDataForTable('#retired-running-shoes-table-body');
		return;
	}

	if (data.length === 0) {
		showNoDataForTable('#active-running-shoes-table-body');
		showNoDataForTable('#retired-running-shoes-table-body');
		return;
	}

	runningShoes = data;
	activeShoes = data.filter((d) => !d.isRetired);
	retiredShoes = data.filter((d) => d.isRetired);

	loadTable();
}

function loadTable() {
	clearTableRows('#active-running-shoes-table-body tr.data-row');
	clearTableRows('#retired-running-shoes-table-body tr.data-row');

	const activeShoesfragment = document.createDocumentFragment();
	const retiredShoesfragment = document.createDocumentFragment();

	if (runningShoes.length > 0) {
		runningShoes.forEach((shoe) => {
			if (shoe.isRetired) {
				retiredShoesfragment.appendChild(buildRetiredShoeRow(shoe));
			} else {
				activeShoesfragment.appendChild(buildActiveShoeRow(shoe));
			}
		});

		if (retiredShoes.length > 0) {
			document.querySelector('#retired-running-shoes-table-body tr.loading')?.classList.add('hidden');
			document.getElementById('retired-running-shoes-table-body').appendChild(retiredShoesfragment);
		} else {
			showNoDataForTable('#retired-running-shoes-table-body');
		}

		if (activeShoes.length > 0) {
			document.querySelector('#active-running-shoes-table-body tr.loading')?.classList.add('hidden');
			document.getElementById('active-running-shoes-table-body').appendChild(activeShoesfragment);
		} else {
			showNoDataForTable('#active-running-shoes-table-body');
		}
	} else {
		showNoDataForTable('#active-running-shoes-table-body');
		showNoDataForTable('#retired-running-shoes-table-body');
	}
}

function buildActiveShoeRow(shoe) {
	const template = document.querySelector('template#active-shoe-row');

	const tr = template.content.cloneNode(true);

	tr.querySelector('.name-col').textContent = shoe.name;
	tr.querySelector('.date-col').textContent = dayjs.tz(shoe.datePurchased, 'UTC').utc(true).format('YYYY');
	tr.querySelector('.runs-col').textContent = shoe.runCount;
	tr.querySelector('.miles-col').textContent = shoe.distance.toFixed(2);
	tr.querySelector('.lifespan-col progress-bar').setAttribute('progress', shoe.lifespan);

	tr.querySelector('.btn-edit').addEventListener('click', function () {
		editShoe(shoe.shoeId);
	});

	tr.querySelector('.btn-delete').addEventListener('click', function () {
		openDeleteConfirmation(shoe);
	});

	return tr;
}

function buildRetiredShoeRow(shoe) {
	const template = document.querySelector('template#retired-shoe-row');

	const tr = template.content.cloneNode(true);

	tr.querySelector('.name-col').textContent = shoe.name;
	tr.querySelector('.date-col').textContent = dayjs.tz(shoe.datePurchased, 'UTC').utc(true).format('YYYY');
	tr.querySelector('.runs-col').textContent = shoe.runCount;
	tr.querySelector('.miles-col').textContent = shoe.distance.toFixed(2);
	
	if (shoe.dateFirstRun && shoe.dateLastRun) {
		const firstYearRun = dayjs.tz(shoe.dateFirstRun, 'UTC').utc(true).format('YYYY');
		const lastYearRun = dayjs.tz(shoe.dateLastRun, 'UTC').utc(true).format('YYYY');

		tr.querySelector('.years-col').textContent = firstYearRun === lastYearRun ? firstYearRun : `${firstYearRun} - ${lastYearRun}`;
	} else {
		tr.querySelector('.years-col').textContent = 'Unknown';
	}

	tr.querySelector('.btn-edit').addEventListener('click', function () {
		editShoe(shoe.shoeId);
	});

	tr.querySelector('.btn-delete').addEventListener('click', function () {
		openDeleteConfirmation(shoe);
	});

	return tr;
}

function closeShoeForm() {
	document.querySelector('form[name="shoe-form"]').reset();
	document.querySelector('dialog#shoe-form-dialog').close();
	setProcessing(false);
}

function editShoe(shoeId) {
	const shoe = runningShoes.find((s) => s.shoeId === shoeId);

	if (shoe) {
		document.querySelector('#shoe-form-dialog h3').textContent = 'Edit Shoe';
		document.querySelector('input#shoeId').value = shoe.shoeId;
		document.querySelector('input#name').value = shoe.name;
		document.querySelector('input#purchase-date').value = dayjs.tz(shoe.datePurchased, 'UTC').utc(true).format('YYYY-MM-DD');
		document.querySelector('input#is-retired').checked = shoe.isRetired;

		document.querySelector('dialog#shoe-form-dialog').showModal();
	}
}

function buildShoeData() {
	return {
		shoeId: parseInt(document.querySelector('input#shoeId').value),
		name: document.querySelector('input#name').value,
		datePurchased: document.querySelector('input#purchase-date').value,
		isRetired: document.querySelector('input#is-retired').checked,
	}
}

async function addShoe(values) {
	const [, error] = await Api.Post('shoe', {
		data: values,
	});

	return error;
}

async function updateShoe(values) {
	const [, error] = await Api.Put(`shoe/${values.shoeId}`, {
		data: values,
	});

	return error;
}

async function saveShoe() {
	hideModalError('modal-error');
	setProcessing(true);

	const values = buildShoeData();

	const error = values.shoeId > 0
		? await updateShoe(values)
		: await addShoe(values);

	if (error) {
		showModalError(error, 'modal-error');
		setProcessing(false);
		return;
	}

	await loadRunningShoes();

	closeShoeForm();
}

function openDeleteConfirmation(shoe) {
	document.getElementById('delete-shoe-id').value = shoe.shoeId;

	document.querySelector('dialog.confirm-dialog .text').textContent = `Are you sure you want to delete the shoe "${shoe.name}"?`;
	document.querySelector('dialog.confirm-dialog').showModal();
}

async function deleteShoe() {
	const shoeId = document.getElementById('delete-shoe-id').value;

	const [, error] = await Api.Delete(`shoe/${shoeId}`);

	if (error) {
		showPageError(error);
		document.querySelector('dialog.confirm-dialog').close();
		return;
	}

	await loadRunningShoes();

	document.querySelector('dialog.confirm-dialog').close();
}