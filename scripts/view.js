import controller from "./controller.js";

/**
 * Creates a new element.
 * @param {string} tagName - Type of element
 * @param {object} [options] - The options object, if any
 * @param {string[]} [options.classList] - Class names to add to element, if any
 * @param {{ type: string, callback: function }[]} [options.listeners] - Event listeners to attach to element, if any
 * @param {object<string, string>} [options.attributes] - Element attributes, if any
 * @returns {Element} The newly created HTML element
 */
function create(tagName, options) {
	const element = document.createElement(tagName);
	if (options.classList) {
		element.classList.add(...options.classList);
	}
	if (options.listeners) {
		options.listeners.forEach(listener => {
			element.addEventListener(listener.type, (event) => listener.callback(event));
		});
	}
	if (options.attributes) {
		for (const attribute in options.attributes) {
			element[attribute] = options.attributes[attribute];
		}
	}
	return element;
}

const view = {
	/**
	 * Loads initial view.
	 * @param {string} selector - CSS selector of app container element
	 */
	load(selector) {
		const app = document.querySelector(selector);
			const header = create('header', { classList: ['alert', 'alert-primary', 'sticky-top', 'text-center'] });
				const heading = create('h1', { attributes: { textContent: 'Select Distributor' }});
			header.append(heading);
		app.append(header);
			const main = create('main', { classList: ['container'] });
				const form = create('form', {
					classList: ['_distributor', 'd-flex', 'flex-column'],
					listeners: [{ type: 'submit', callback: controller.handleSubmit }]
				});
					const cdcButton = create('button', {
						classList: ['btn', 'btn-lg', 'btn-primary', 'mb-3'],
						attributes: { textContent: 'CDC', type: 'submit', value: 'cdc' }
					});
				form.append(cdcButton);
					const rdcButton = create('button', {
						classList: ['btn', 'btn-lg', 'btn-primary'],
						attributes: { textContent: 'RDC', type: 'submit', value: 'rdc' }
					});
				form.append(rdcButton);
			main.append(form);
		app.append(main);
	},

	updateView(_data) {
		const stage = _data.state.stage;
		const distributor = _data.state.distributor;
		const data = _data[distributor];
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
						division.addEventListener('click', event => controller.handleClick(event));
						division.classList.add('input-group', 'input-group-lg', 'row');
						division.dataset.index = index;
						division.style.cursor = 'pointer';
							const span = document.createElement('span');
							span.classList.add('align-items-start', 'col-7', 'd-flex', 'flex-column', 'input-group-text');
								const description = document.createElement('span');
								description.textContent = item.description;
							span.append(description);
								const details = document.createElement('span');
								details.classList.add('d-flex', 'fs-6', 'fw-light', 'justify-content-between', 'w-100');
									const uom = document.createElement('span');
									uom.textContent = `${item.uom}/cs`;
								details.append(uom);
									const par = document.createElement('span');
									par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
								details.append(par); 
							span.append(details);
						division.append(span);
							const input = document.createElement('input');
							input.classList.add('col', 'form-control');
							input.type = 'tel';
							const itemValue = data[index][stage];
							input.value = itemValue !== undefined ? itemValue : '';
							input.disabled = stage === 'order';
							input.readOnly = stage === 'order';
						division.append(input);
							const units = document.createElement('span');
							units.classList.add('col-2', 'fs-6', 'input-group-text');
							units.textContent = stage === 'boh' ? 'ea' : 'cs';
						division.append(units);
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
		const par = details.lastChild
		par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
		details.append(par);
	},
};

export default view;
