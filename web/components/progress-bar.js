class ProgressBar extends HTMLElement {
	static observedAttributes = ['progress'];

	constructor() {
        super();

        this.progress = 0;
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue !== newValue && property === 'progress') {
        	if (this.querySelector('.progress-bar')) {
	            this.querySelector('.progress-bar').setAttribute('title', `${newValue}% Complete`);
	            this.querySelector('.inner-bar').style.width = `${newValue}%`;
	        }
        }

        this[property] = newValue;
    }

	connectedCallback() {
		this.innerHTML = `
			<div class="progress-bar" title="${this.progress}% Complete">
				<div class="bar">
					<div class="inner-bar" style="width: ${this.progress}%;">${this.progress}%</div>
				</div>
			</div>
		`;
	}
}

customElements.define('progress-bar', ProgressBar);