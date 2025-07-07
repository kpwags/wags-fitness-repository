const apiUrl = 'http://localhost:3020';
// const apiUrl = 'http://192.168.1.232:3020';

const theme = {
	borderColor: 'oklch(75.7% 0 0)',
	green1: 'oklch(0.38 0.0962 150.88)',
	green2: 'oklch(0.45 0.1085 150.88)',
	green3: 'oklch(0.5 0.1209 150.88)',
	green4: 'oklch(0.57 0.1381 150.88)',
	green5: 'oklch(0.67 0.1307 150.88)',
	green6: 'oklch(0.86 0.1233 150.88)',
	grey1: 'oklch(100% 0 0)',
	grey2: 'oklch(92.16% 0 0)',
	grey3: 'oklch(94.12% 0.005 302)',
	grey4: 'oklch(75.7% 0 0)',
	grey5: 'oklch(50.13% 0 0)',
	black1: 'oklch(0% 0 256.24)',
	black2: 'oklch(16.91% 0 256.24)',
	black3: 'oklch(21.96% 0 256.24)',
	black4: 'oklch(24% 0 173.65)',
	danger1: 'oklch(56.68% 0.22 22.76)',
	danger2: 'oklch(61.87% 0.22 22.76)',
	danger3: 'oklch(87.05% 0.0715 3.71)',
}

window.addEventListener('load', () => {
	const mainMenu = document.querySelector('header button.menu-button');

	mainMenu?.addEventListener('click', toggleSidebar);

	if (window.innerWidth < 768) {
		sidebar.setAttribute('data-collapsed', true);
	}
});

function toggleSidebar() {
	const sidebar = document.querySelector('aside#sidebar');

	if (sidebar.hasAttribute('data-collapsed')) {
		sidebar.removeAttribute('data-collapsed');
	} else {
		sidebar.setAttribute('data-collapsed', true);
	}
}

function clearTableRows(rowSelector = 'tr.data-row') {
	const rows = document.querySelectorAll(rowSelector);
	rows.forEach((row) => row.remove());
}

function createLinkElement(title, url, openInNewWindow = false) {
	const linkAnchor = document.createElement('a');
	linkAnchor.textContent = title;
	linkAnchor.setAttribute('href', url);

	if (openInNewWindow) {
		linkAnchor.setAttribute('target', '_blank');
		linkAnchor.setAttribute('rel', 'noreferrer nofollow');
	}

	return linkAnchor;
}

function showPageError(error) {
	const pageError = document.getElementById('page-error');

	if (pageError) {
		pageError.textContent = error;
		pageError.classList.remove('hidden');
	}
}

function hidePageError() {
	const pageError = document.getElementById('page-error');

	if (pageError) {
		pageError.classList.add('hidden');
	}
}

function showModalError(error, elementId = 'modal-error') {
	const modalError = document.getElementById(elementId);

	if (modalError) {
		modalError.textContent = error;
		modalError.classList.remove('hidden');
	}
}

function hideModalError(elementId = 'modal-error') {
	const modalError = document.getElementById(elementId);

	if (modalError) {
		modalError.classList.add('hidden');
	}
}

function disableFieldset() {
	document.querySelector('fieldset')?.setAttribute('disabled', true);
}

function enableFieldset() {
	document.querySelector('fieldset')?.removeAttribute('disabled');
}

function showNoDataForTable(prefix = '') {
	document.querySelector(`${prefix} tr.loading`)?.classList.add('hidden');
	document.querySelector(`${prefix} tr.no-content`)?.classList.remove('hidden');
}

function cancelOutOfConfirmDialog(keyFieldSelector = undefined) {
	if (keyFieldSelector) {
		document.querySelector(keyFieldSelector).value = 0;
	}

	document.querySelector('dialog.confirm-dialog').close();
}

function calculateAverage(values) {
	return values.reduce((a, b) => a + b) / values.length;
}

function sumValues(values) {
	return values.reduce((a, b) => a + b, 0)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buildSelectList(data, valueKey, textKey) {
	const fragment = document.createDocumentFragment();

	data.forEach((d) => {
		const opt = document.createElement('option');
		opt.setAttribute('value', d[valueKey]);
		opt.textContent = d[textKey];

		fragment.appendChild(opt);
	});

	return fragment;
}