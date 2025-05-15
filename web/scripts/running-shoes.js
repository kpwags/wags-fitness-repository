let runningShoes = [];
let activeShoes = [];
let retiredShoes = [];

window.addEventListener('load', function () {
	loadRunningShoes();

	document.querySelector('#add-new-shoe')?.addEventListener('click', function () {
		document.querySelector('dialog#shoe-form-dialog input#shoeId').value = '0';
		document.querySelector('dialog#shoe-form-dialog input#purchase-date').value = dayjs().format('YYYY-MM-DD');
		document.querySelector('dialog#shoe-form-dialog').showModal();
	});

	document.querySelector('#form-dialog-cancel').addEventListener('click', function () {
		closeShoeForm();
	});
});

async function loadRunningShoes() {
	const [data, error] = await Api.Get('shoe');

	if (error) {
		showPageError(error);
		document.querySelector('#active-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#active-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		document.querySelector('#retired-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#retired-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		return;
	}

	if (data.length === 0) {
		document.querySelector('#active-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#active-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		document.querySelector('#retired-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#retired-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		return;
	}

	runningShoes = data;
	activeShoes = data.filter((d) => !d.isRetired);
	retiredShoes = data.filter((d) => d.isRetired);

	loadTable();
}

function loadTable() {
	clearTableRows();

	const activeShoesfragment = document.createDocumentFragment();
	const retiredShoesfragment = document.createDocumentFragment();

	if (runningShoes.length > 0) {
		runningShoes.forEach((shoe) => {
			const tr = document.createElement('tr');
			tr.classList.add('data-row');

			const nameCell = document.createElement('td');
			nameCell.textContent = shoe.name;

			tr.appendChild(nameCell);

			const dateCell = document.createElement('td');
			dateCell.classList.add('center-align');
			dateCell.textContent = dayjs.tz(shoe.datePurchased, 'UTC').utc(true).format('YYYY');

			tr.appendChild(dateCell);

			const runsCell = document.createElement('td');
			runsCell.classList.add('center-align');
			runsCell.textContent = shoe.runCount;

			tr.appendChild(runsCell);

			const milesCell = document.createElement('td');
			milesCell.classList.add('center-align');
			milesCell.textContent = shoe.milesRun;

			tr.appendChild(milesCell);

			if (shoe.isRetired) {
				const yearsRunCell = document.createElement('td');
				yearsRunCell.classList.add('center-align');

				if (shoe.dateFirstRun && shoe.dateLastRun) {
					const firstYearRun = dayjs.tz(shoe.dateFirstRun, 'UTC').utc(true).format('YYYY');
					const lastYearRun = dayjs.tz(shoe.dateLastRun, 'UTC').utc(true).format('YYYY');

					yearsRunCell.textContent = firstYearRun === lastYearRun ? firstYearRun : `${firstYearRun} - ${lastYearRun}`;
				} else {
					yearsRunCell.textContent = 'Unknown';
				}

				tr.appendChild(yearsRunCell);
			} else {
				const progressCell = document.createElement('td');

				const progressBar = document.createElement('progress-bar');
				progressBar.setAttribute('progress', shoe.lifespan);

				progressCell.appendChild(progressBar);

				tr.appendChild(progressCell);
			}

			const actionsCell = document.createElement('td');

			const editButton = document.createElement('button');
			editButton.textContent = 'Edit';
			editButton.classList.add('btn-link');
			editButton.addEventListener('click', function () {
				editShoe(shoe.shoeId);
			})

			const deleteButton = document.createElement('button');
			deleteButton.textContent = 'Delete';
			deleteButton.classList.add('btn-link');
			deleteButton.addEventListener('click', function () {
				console.log(shoe.shoeId);
			});

			actionsCell.appendChild(editButton);
			actionsCell.appendChild(deleteButton);

			tr.appendChild(actionsCell);

			if (shoe.isRetired) {
				retiredShoesfragment.appendChild(tr);
			} else {
				activeShoesfragment.appendChild(tr);
			}
		});

		document.querySelector('#retired-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#active-running-shoes-table-body tr.loading')?.classList.add('hidden');

		if (retiredShoes.length > 0) {
			document.getElementById('retired-running-shoes-table-body').appendChild(retiredShoesfragment);
		} else {
			document.querySelector('#retired-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		}

		if (activeShoes.length > 0) {
			document.getElementById('active-running-shoes-table-body').appendChild(activeShoesfragment);
		} else {
			document.querySelector('#active-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
		}
	} else {
		document.querySelector('#active-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#active-running-shoes-table-body tr.no-content')?.classList.remove('hidden');

		document.querySelector('#retired-running-shoes-table-body tr.loading')?.classList.add('hidden');
		document.querySelector('#retired-running-shoes-table-body tr.no-content')?.classList.remove('hidden');
	}
}

function closeShoeForm() {
	document.querySelector('form[name="shoe-form"]').reset();
	document.querySelector('dialog#shoe-form-dialog').close();
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