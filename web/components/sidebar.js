class Sidebar extends HTMLElement {
	constructor() {
		super();
	}

	get activeLink() {
		if (!this.getAttribute('activeLink')) {
			return 'home';
		}

		return this.getAttribute('activeLink');
	}

	connectedCallback() {
		this.innerHTML = `
			<aside id="sidebar" ${window.innerWidth <= 500 ? 'data-collapsed' : ''}>
				<ul>
					<li class="${this.activeLink === 'home' ? 'active' : ''}">
						<a href="/">Home</a>
					</li>
					<li class="${this.activeLink === 'diet' ? 'active' : ''}"><a href="/diet/">Diet</a></li>
					<li class="${this.activeLink === 'activity' ? 'active' : ''}"><a href="/activty/">Activity</a></li>
					<li>
						<details ${this.activeLink.startsWith('runs') ? 'open' : ''}>
							<summary><span>Runs</span></summary>
							<ul class="sub-list">
								<li class="${this.activeLink === 'runs-overview' ? 'active' : ''}"><a href="/runs/index.html">Overview</a></li>
								<li class="${this.activeLink === 'runs-runs' ? 'active' : ''}"><a href="/runs/runs.html">Runs</a></li>
								<li class="${this.activeLink === 'runs-shoes' ? 'active' : ''}"><a href="/runs/shoes.html">Shoes</a></li>
							</ul>
						</details>
					</li>
					<li class="${this.activeLink === 'walks' ? 'active' : ''}"><a href="/walks/">Walks</a></li>
					<li>
						<details ${this.activeLink.startsWith('biking') ? 'open' : ''}>
							<summary><span>Biking</span></summary>
							<ul class="sub-list">
								<li class="${this.activeLink === 'biking-overview' ? 'active' : ''}"><a href="/biking/index.html">Overview</a></li>
								<li class="${this.activeLink === 'biking-rides' ? 'active' : ''}"><a href="/biking/bike-rides.html">Bike Rides</a></li>
								<li class="${this.activeLink === 'biking-bikes' ? 'active' : ''}"><a href="/biking/bikes.html">Bikes</a></li>
							</ul>
						</details>
					</li>
					<li class="${this.activeLink === 'system' ? 'active' : ''}"><a href="/system/">System</a></li>
				</ul>
			</aside>
		`;
	}
}

customElements.define('wags-fitness-sidebar', Sidebar);
