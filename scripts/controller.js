import model from './model.js';
import view from './view.js';

/**
 * @typedef {import('./types.js').Data} Data
 * @typedef {import('./types.js').Callback} Callback
 */

const controller = {
	currentSelection: null,

	load() {
		let data = model.readData();
		data
			? view.updateView(data)
			: (model.createData(),
				data = model.readData(),
				view.updateView(data));
	},

	/**
	 * @param {Event} event
	 * @param {{ color: string }} options
	 */
	handleFocusin(event, { color }) {
		const input = event.target;
		if (input.tagName === 'INPUT') {
			input.previousSibling.classList.add('alert', color, 'text-body', 'mb-0');
			input.nextSibling.classList.add('alert', color, 'text-body', 'mb-0');
			this.currentSelection = input.parentElement;
		}
	},
	
	/**
	 * @param {Event} event
	 * @param {{ color: string }} options
	 */
	handleFocusout(event, { color }) {
		const input = event.target;
		if (input.tagName === 'INPUT') {
			input.previousSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			input.nextSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			let data = model.readData();
			const index = Number(input.parentElement.dataset.index);
			const stage = data.state.stage;
			const newData = Number(input.value)
				? (input.value = Number(input.value), Number(input.value))
				: input.value === '0'
					? 0
					: input.value === ''
						? null
						: data.items[index][stage] === null
							? (input.value = '', null)
							: (input.value = data.items[index][stage], data.items[index][stage]);
			const path = `items.${index}.${stage}`;
			model.updateData(data, newData, path);
			view.updateItem(index, data);
		}
	},

	/**
	 * @param {Event} event
	 */
	handleClick(event) {
		if (event.target.tagName !== 'INPUT') {
			const targetInput = event.currentTarget.children[1];
			if (this.currentSelection === event.currentTarget) {
				this.currentSelection = null;
			} else {
				targetInput.focus();
			}
		}
	},

	/**
	 * @param {Event} event
	 */
	async handleSubmit(event) {
		if (event.target.classList.contains('_distributor')) {
			event.preventDefault();
			const data = model.readData('data');
			model.updateData(data, 'boh', 'state.stage');
			const distributor = event.submitter.value;
			model.updateData(data, distributor, 'state.distributor');
			await model.fetchRemote(distributor)
				.then(items => {
					model.updateData(data, items, 'items');
					event.target.submit();
				});
		} else {
			let data = model.readData()
			const stage = data.state.stage;
			let newData = data.items.map(item => item[stage] === null ? { ...item, [stage]: 0 } : item );
			model.updateData(data, newData, 'items');
			if (stage === 'enRoute') {
				data = model.readData();
				const items = model.calculateOrder();
				newData = data.items.map((item, index) => ({ ...item, 'order': items[index].order }));
				model.updateData(data, newData, 'items');
			}
			const newState = stage === 'boh'
				? 'enRoute'
				: data.state.stage === 'enRoute'
					? 'order'
					: null;
			if (newState) {
				const statePath = 'state.stage';
				model.updateData(data, newState, statePath);
			} else {
				model.deleteData();
			}
		}
	},
};

export default controller;
