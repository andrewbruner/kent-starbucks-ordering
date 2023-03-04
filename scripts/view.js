import controller from "./controller.js";

const view = {
	load() {
		const app = document.querySelector('#app');
			const header = document.createElement('header');
			header.classList.add('alert', 'alert-primary', 'sticky-top', 'text-center');
				const heading = document.createElement('h1');
				heading.textContent = 'Select Distributor';
			header.append(heading);
		app.append(header);
			const main = document.createElement('main');
			main.classList.add('container');
				const form = document.createElement('form');
				form.addEventListener('submit', event => controller.handleSubmit(event));
				form.classList.add('distributor');
				form.classList.add('d-flex', 'flex-column');
					const cdcButton = document.createElement('button');
					cdcButton.classList.add('btn', 'btn-lg', 'btn-primary', 'mb-3');
					cdcButton.textContent = 'CDC';
					cdcButton.type = 'submit';
					cdcButton.value = 'cdc';
				form.append(cdcButton);
					const rdcButton = document.createElement('button');
					rdcButton.classList.add('btn', 'btn-lg', 'btn-primary');
					rdcButton.textContent = 'RDC';
					rdcButton.type = 'submit';
					rdcButton.value = 'rdc';
				form.append(rdcButton);
			main.append(form);
		app.append(main);
	},

	updateView(data) {
		const stage = data.state.stage;
		const distributor = data.state.distributor;
		data = data[distributor];
		const components = {
			header: {
				class: {
					boh: 'alert-primary',
					enRoute: 'alert-warning',
					order: 'alert-success',
				},
			},
			heading: {
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
			},
		};
		
		const app = document.querySelector('#app');
			const header = document.createElement('header');
			header.classList.add('alert', components.header.class[stage], 'sticky-top', 'text-center');
				const heading = document.createElement('h1');
				heading.textContent = components.heading.textContent[stage];
			header.append(heading);
		app.append(header);
			const main = document.createElement('main');
			main.classList.add('container');
				const form = document.createElement('form');
				const color = components.header.class[stage];
				form.addEventListener('focusin', event => controller.handleFocusin(event, color));
				form.addEventListener('focusout', event => controller.handleFocusout(event, color));
				form.addEventListener('submit', event => controller.handleSubmit(event));
					data.forEach((item, index) => {
						const division = document.createElement('div');
						division.addEventListener('click', event => controller.handleClick(event, alertColor));
						division.classList.add('input-group', 'input-group-lg');
						division.style.cursor = 'pointer';
							const span = document.createElement('span');
							span.classList.add('align-items-start', 'col-7', 'flex-column', 'input-group-text');
								const description = document.createElement('span');
								description.textContent = item.description;
							span.append(description);
								const details = document.createElement('span');
								details.classList.add('d-flex', 'fs-6', 'fw-l', 'justify-content-between', 'w-100');
									const uom = document.createElement('span');
									uom.textContent = `${item.uom}/cs`;
								details.append(uom);
									const par = document.createElement('span');
									par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
								details.append(par); 
							span.append(details);
						division.append(span);
							const input = document.createElement('input');
							input.classList.add('col-2', 'form-control');
							input.dataset.index = index;
							input.type = 'tel';
							const itemValue = data[index][stage];
							input.value = itemValue !== undefined ? itemValue : '';
							input.disabled = stage === 'order';
							input.readOnly = stage === 'order';
						division.append(input);
							const amount = document.createElement('span');
							amount.classList.add('col-2', 'fs-6', 'input-group-text');
							amount.textContent = stage === 'boh' ? 'ea' : 'cs';
						division.append(amount);
						form.append(division);
					});
					const button = document.createElement('button');
					button.classList.add('btn', 'btn-lg', 'btn-primary', 'mb-5', 'mt-3');
					button.textContent = components.button.textContent[stage];
					button.type = 'submit';
				form.append(button);
			main.append(form);
		app.append(main);
	},

	updateItem(index, data) {
		const distributor = data.state.distributor;
		const item = data[distributor][index];
		const form = document.querySelector('form');
		const divisions = form.children;
		const details = divisions[index].firstChild.lastChild;
		details.lastChild.remove();
		const par = document.createElement('span');
		par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
		details.append(par);
	},
};

export default view;
