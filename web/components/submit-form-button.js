class SubmitFormButton extends HTMLElement {
	static observedAttributes = ['processing', 'buttontext'];

	constructor() {
		super();

		this.buttontext = 'Submit';
		this.processing = false;
	}

	attributeChangedCallback(property, oldValue, newValue) {
		const loadingSpinner = document.querySelector('button[type="submit"] .loader');
		const buttonText = document.querySelector('button[type="submit"] .button-text');


        if (oldValue !== newValue && property === 'processing') {
            if (newValue === 'false') {
				loadingSpinner.style.display = 'none';
			} else {
				loadingSpinner.style.display = 'inline-block';
			}
        }

		if (oldValue !== newValue && property === 'buttontext') {
			buttonText.textContent = newValue;
		}

        this[property] = newValue;
    }
}

customElements.define('submit-form-button', SubmitFormButton);
