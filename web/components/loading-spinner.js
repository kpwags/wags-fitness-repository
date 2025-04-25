class LoadingSpinner extends HTMLElement {
	constructor() {
        super();
    }

    get tip() {
        if (!this.getAttribute('tip')) {
            return 'Loading...';
        }

        return this.getAttribute('tip');
    }

	connectedCallback() {
		this.innerHTML = `
			<div class="loading-spinner">
				<div class="lds-dual-ring"></div>
				<div class="tip">${this.tip}</div>
			</div>
		`;
	}
}

customElements.define('loading-spinner', LoadingSpinner);