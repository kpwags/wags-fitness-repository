class RunForm extends HTMLElement {
	connectedCallback() {

		const style = document.createElement('style');

		style.textContent = `
			.distance-pace {
				display: flex;
				gap: 24px;
			}

			.distance-pace label {
				display: block;
				width: 100%;
			}

			.distance-pace div {
				width: 50%;
			}

			.run-time-controls {
				display: flex;
				gap: 16px;
			}

			@media (max-width: 500px) {
				.distance-pace {
					flex-direction: column;
					gap: 16px;
				}

				.distance-pace div {
					width: 100%;
				}

				.temp-hr-elev {
					flex-direction: column;
					gap: 16px;
				}
			}
		`;

		document.head.appendChild(style);

		this.innerHTML = `
			<dialog class="form-dialog" id="run-form-dialog">
				<h3>Add Run</h3>

				<div id="modal-error" class="alert error hidden"></div>

				<form name="run-form">
					<fieldset>
						<legend hidden>Add Run</legend>
						<input type="hidden" id="runId" name="runId" value="0" />

						<div class="form-field">
							<label for="date-run">
								<span class="required">*</span>Date
								<input type="date" name="date-run" id="date-run" />
							</label>
						</div>

						<div class="form-field distance-pace">
							<div>
								<label for="distance">
									<span class="required">*</span>Distance
									<input type="text" name="distance" id="distance" required />
								</label>
							</div>
							<div class="run-time-controls">
								<label for="hours">
									<span class="required">*</span>Hours
									<input type="text" name="hours" id="hours" required />
								</label>
								<label for="minutes">
									<span class="required">*</span>Minutes
									<input type="text" name="minutes" id="minutes" required />
								</label>
								<label for="seconds">
									<span class="required">*</span>Seconds
									<input type="text" name="seconds" id="seconds" required />
								</label>
							</div>
						</div>

						<div class="form-field dual temp-hr-elev">
							<label for="temperature">
								<span class="required">*</span>Temperature
								<input type="text" name="temperature" id="temperature" required />
							</label>
							<label for="heart-rate">
								<span class="required">*</span>Heart Rate
								<input type="text" name="heart-rate" id="heart-rate" required />
							</label>
							<label for="elevation">
								<span class="required">*</span>Elevation
								<input type="text" name="elevation" id="elevation" required />
							</label>
						</div>

						<div class="form-field">
							<label for="shoe-id">
								Shoe
								<select name="shoe-id" id="shoe-id">
									<option value="0">Not Specified</option>
								</select>
							</label>
						</div>

						<div class="actions">
		                    <button type="button" class="btn-ghost" id="form-dialog-cancel">Cancel</button>
							<submit-form-button class="save-run-submit">
								<button type="submit" class="btn-primary">
									<span class="btn-processing-content">
										<span class="loader" style="display:none"></span>
										<span class="button-text">Save</span>
									</span>
								</button>
							</submit-form-button>
		                </div>
		            </fieldset>
				</form>
			</dialog>
		`;
	}
}

customElements.define('run-form', RunForm);