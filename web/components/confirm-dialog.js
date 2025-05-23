class ConfirmDialog extends HTMLElement {
	static observedAttributes = ['dialogtype'];

	constructor() {
		super();

		this.dialogtype = 'confirm-delete';
	}

	attributeChangedCallback(property, oldValue, newValue) {
		if (oldValue !== newValue && property === 'dialogtype') {
			if (this.querySelector('.confirm-dialog')) {
				this.querySelector('.confirm-dialog').setAttribute('dialog-type', newValue);
			}
		}

		this[property] = newValue;
	}

	connectedCallback() {
		this.innerHTML = `
			<dialog class="confirm-dialog" dialog-type="${this.dialogtype === '' ? 'confirm-delete' : this.dialogtype}">
				<div class="confirm-content">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
	  					<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
					</svg>
					<div class="text"></div>
				</div>
				<div class="confirm-actions">
					<submit-form-button class="confirm-dialog-yes-button">
						<button type="button" class="btn-danger confirm-dialog-yes">
							<span class="btn-processing-content">
								<span class="loader" style="display:none"></span>
								<span class="button-text">Yes</span>
							</span>
						</button>
					</submit-form-button>
					<button type="button" class="btn-danger-ghost confirm-dialog-no">No</button>
				</div>
			</dialog>
		`;
	}
}

customElements.define('confirm-dialog', ConfirmDialog);