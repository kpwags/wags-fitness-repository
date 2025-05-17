const apiUrl = 'http://localhost:3020';
// const apiUrl = 'http://192.168.1.232:3020';

window.addEventListener('load', () => {
	const mainMenu = document.querySelector('header button.menu-button');

	mainMenu?.addEventListener('click', toggleSidebar);
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