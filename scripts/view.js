import controller from "./controller.js";

/**
 * @typedef {import('./types.js').Item} Item
 * @typedef {import('./types.js').Data} Data
 * @typedef {import('./types.js').Callback} Callback
 */

/**
 * Creates a new element.
 * @param {string} tagName - Type of element
 * @param {object} [options] - The options object, if any
 * @param {string[]} [options.classList] - Class names to add to element, if any
 * @param {{ type: string, callback: Callback, options?: { [string]: * } }[]} [options.listeners] - Event listeners to attach to element, if any
 * @param {{ [string]: * }} [options.attributes] - Element attributes, if any
 * @returns {Element} The newly created HTML element
 */
function create(tagName, options) {
	const element = document.createElement(tagName);
	if (options.classList) {
		element.classList.add(...options.classList);
	}
	if (options.listeners) {
		options.listeners.forEach(listener => {
			element.addEventListener(listener.type, (event) => listener.callback(event, listener.options));
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
	 * INITIAL STAGE DONE
	 * @param {Data} data
	 * @param {string} key
	 * @param {string} selector
	 */
	updateView(data) {
		const app = document.querySelector('#app');
		if (data.state.stage === 'initial') {
			const header = create('header', { classList: ['alert', 'alert-primary', 'sticky-top', 'text-center'] });
			const heading = create('h1', { attributes: { textContent: 'Select Distributor' } });
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
		} else {
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
			const header = create('header', {
				classList: ['alert', components.header.class[data.state.stage], 'sticky-top', 'text-center']
			});
			const heading = create('h1', { attributes: { textContent: components.heading.textContent[data.state.stage] } });
			header.append(heading);
			app.append(header);
			const main = create('main', { classList: ['container'] });
			const color = components.header.class[data.state.stage];
			const form = create('form', {
				listeners: [
					{ type: 'focusin', callback: controller.handleFocusin, options: { color }},
					{ type: 'focusout', callback: controller.handleFocusout, options: { color }},
					{ type: 'submit', callback: controller.handleSubmit, }
				]
			});
			data.items.forEach((item, index) => {
				const division = create('div', {
					classList: ['input-group', 'input-group-lg', 'row'],
					listeners: [{ type: 'click', callback: controller.handleClick }],
					attributes: { style: { cursor: 'pointer' } } // dataset: { index } ???
				});
				const span = create('span', {
					classList: ['align-items-start', 'col-7', 'd-flex', 'flex-column', 'input-group-text']
				});
				const description = create('span', { attributes: { textContent: item.description } });
				span.append(description);
				const details = create('span', {
					classList: ['d-flex', 'fs-6', 'fw-light', 'justify-content-between', 'w-100']
				});
				const uom = create('span', { attributes: { textContent: `${item.uom}/cs` } });
				details.append(uom);
				const par = create('span', {
					attributes: {
						textContent: `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`
					}
				});
				details.append(par); 
				span.append(details);
				division.append(span);
				const itemValue = item[data.state.stage];
				const input = create('input', {
					classList: ['col', 'form-control'],
					attributes: {
						type: 'tel',
						value: itemValue !== null ? itemValue : '',
						disabled: data.state.stage === 'order',
						readOnly: data.state.stage === 'order'
					}
				});
				division.append(input);
				const units = create('span', {
					classList: ['col-2', 'fs-6', 'input-group-text'],
					attributes: { textContent: data.state.stage === 'boh' ? 'ea' : 'cs' }
				});
				division.append(units);
				form.append(division);
			});
			const button = create('button', {
				classList: ['btn', 'btn-lg', 'btn-primary', 'mb-5', 'mt-3'],
				attributes: {
					textContent: components.button.textContent[data.state.stage],
					type: 'submit'
				}
			});
			form.append(button);
			main.append(form);
			app.append(main);
		}
	},

	/**
	 * Updates single item to reflect current Data
	 * @param {number} index 
	 * @param {Data} data 
	 */
	updateItem(index, data) {
		const item = data.items[index];
		const form = document.querySelector('form');
		const divisions = form.children;
		const details = divisions[index].firstChild.lastChild;
		const par = details.lastChild
		par.textContent = `${item.boh >= 0 ? item.boh + 'ea / ' : ''}${item.enRoute >= 0 ? item.enRoute + 'cs / ' : ''}${item.par}par`;
		details.append(par);
	},
};

export default view;
