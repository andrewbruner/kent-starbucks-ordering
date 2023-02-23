import controller from './controller.js';

const view = {
	components: {
		header: {
			class: {
				boh: 'alert-primary',
				enRoute: 'alert-warning',
				order: 'alert-success',
			},
			textContent: {
				boh: 'Back of House',
				enRoute: 'En Route',
				order: 'Order',
			},
		},
		button: {
			textContent: {
				boh: 'BoH Done',
				enRoute: 'En Route Done',
				order: 'Complete Order',
			},
		}
	},
	updateView(database) {
		const distributor = database.state.distributor;
		const stage = database.state.stage;
		const data = database.data[distributor];
		// #app
		const app = document.querySelector('#app');
		// header
		const header = document.createElement('header');
		header.classList.add('alert', this.components.header.class[stage], 'sticky-top', 'text-center');
			// heading
			const heading = document.createElement('h1');
			heading.textContent = this.components.header.textContent[stage];
			header.appendChild(heading);
		app.appendChild(header);

		// main
		const main = document.createElement('main');
		main.classList.add('container', 'mb-5');
			// form
			const form = document.createElement('form');
			const alertColor = this.components.header.class[stage];
			form.addEventListener('focusin', event => controller.handleFocusin(event, alertColor));
			form.addEventListener('focusout', event => controller.handleFocusout(event, alertColor));
			form.addEventListener('submit', event => controller.handleSubmit(event));
				// divisions...
				data.forEach((item, index) => {
					// division
					const division = document.createElement('div');
					division.addEventListener('click', event => controller.handleClick(event, alertColor));
					division.classList.add('input-group', 'input-group-lg');
					division.style.cursor = 'pointer';
						// span
						const span = document.createElement('span');
						span.classList.add('align-items-start', 'col-7', 'flex-column', 'input-group-text');
							// description
							const description = document.createElement('span');
							description.textContent = item.description;
							span.appendChild(description);
							// details
							const details = document.createElement('span');
							details.classList.add('d-flex', 'fs-6', 'fw-l', 'justify-content-between', 'w-100');
								// uom
								const uom = document.createElement('span');
								uom.textContent = `${item.uom}/cs`;
								details.appendChild(uom);
								// par
								const par = document.createElement('span');
								par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
								details.appendChild(par); 
							span.appendChild(details);
							// enRoute
						division.appendChild(span);

						// input
						const input = document.createElement('input');
						input.classList.add('col-2', 'form-control');
						input.dataset.index = index;
						input.type = 'tel';
						const itemValue = data[index][stage];
						input.value = itemValue !== undefined ? itemValue : '';
						input.disabled = stage === 'order';
						input.readOnly = stage === 'order';
						division.appendChild(input);

						// amount
						const amount = document.createElement('span');
						amount.classList.add('col-2', 'fs-6', 'input-group-text');
						amount.textContent = stage === 'boh' ? 'ea' : 'cs';
						division.appendChild(amount);
					form.appendChild(division);
				});

				// button
				const button = document.createElement('button');
				button.classList.add('btn', 'btn-primary', 'mt-3');
				button.textContent = this.components.button.textContent[stage];
				button.type = 'submit';
				form.appendChild(button);
			main.append(form);
		app.appendChild(main);
	},
};

export default view;
