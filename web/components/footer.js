class Footer extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<footer>v1.0.0-alpha</footer>
		`;
	}
}

customElements.define('wags-fitness-footer', Footer);