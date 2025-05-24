function buildVerticalLineChart(element, data) {
	const maxValue = Math.max.apply(null, data.map((d) => d.value));
	let start = 8;

	data.forEach((d) => {
		const bar = document.createElement('div');
		bar.classList.add('bar');

		if (d.value === maxValue) {

			bar.setAttribute('style', `height: 200px;left:${start}px;`);

			element.appendChild(bar);
		} else {
			const height = (d.value / maxValue) * 100;

			bar.setAttribute('style', `height: ${height}px;left:${start}px;`);

			element.appendChild(bar);
		}

		start += 32;
	});

	const chartWidth = (data.length * 16) + ((data.length - 1) * 16) + 16;

	element.style.width = `${chartWidth}px`;
}
