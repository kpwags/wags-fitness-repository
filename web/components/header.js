class Header extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<header>
				<button class="menu-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
					</svg>
				</button>
				<a href="/">Wags Fitness Repository</a>
			</header>
		`;
	}
}

customElements.define('wags-fitness-header', Header);