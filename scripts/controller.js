import model from './model.js';
import view from './view.js';

/**
 * @typedef {import('./types.js').Item} Item
 * @typedef {import('./types.js').Data} Data
 */

const controller = {
	currentSelection: '',

	/**
	 * Updates view to reflect current sessionStorage data, or loads initial view if data does not exist.
	 * @param {string} key - Target sessionStorage data key
	 * @returns {Data|null} Current sessionStorage data for target key, or null if key does not exist
	 */
	load(key) {
		const data = model.readData(key);
		return data ? (view.updateView(data), data) : (view.load('#app'), null);
	},

	handleFocusin(event, color) {
		const input = event.target;
		if (input.tagName === 'INPUT') {
			input.previousSibling.classList.add('alert', color, 'text-body', 'mb-0');
			input.nextSibling.classList.add('alert', color, 'text-body', 'mb-0');
			this.currentSelection = input.parentElement;
		}
	},
	
	handleFocusout(event, color) {
		const input = event.target;
		if (input.tagName === 'INPUT') {
			input.previousSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			input.nextSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			let data = model.readData();
			const distributor = data.state.distributor;
			const index = input.parentElement.dataset.index;
			const stage = data.state.stage;
			const newData = Number(input.value)
				? (input.value = Number(input.value), Number(input.value))
				: input.value === '0'
					? 0
					: input.value === ''
						? undefined
						: data[distributor][index][stage] === undefined
							? (input.value = '', undefined)
							: (input.value = data[distributor][index][stage], data[distributor][index][stage]);
			const path = `${distributor}.${index}.${stage}`;
			model.updateData(data, newData, path);
			view.updateItem(index, data);
		}
	},

	handleClick(event) {
		if (event.target.tagName !== 'INPUT') {
			const targetInput = event.currentTarget.children[1];
			if (this.currentSelection === event.currentTarget) {
				this.currentSelection = '';
			} else {
				targetInput.focus();
			}
		}
	},

	/**
	 * 
	 * @param {Event} event 
	 */
	async handleSubmit(event) {
		if (event.target.classList.contains('_distributor')) {
			event.preventDefault();
			const distributor = event.submitter.value;
			await model.fetchRemote(distributor)
				.then(data => model.createData(data));
			event.target.submit();
		} else {
			const data = model.readData()
			const distributor = data.state.distributor;
			const stage = data.state.stage;
			const newData = data[distributor].map(item => ( item[stage] === undefined ? { ...item, [stage]: 0 } : item ));
			const path = distributor;
			model.updateData(data, newData, path);
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

// import model from './model.js';
// import view from './view.js';

// const controller = {
// 	handleClick(event, alertColor) {
// 		const currentTarget = event.currentTarget;
// 		const target = event.target;
// 		if (target.tagName.toLowerCase() !== 'input') {
// 			const targetInput = currentTarget.children[1];
// 			if (this.currentLineSelected === currentTarget) {
// 				this.currentLineSelected = null;
// 				targetInput.blur();
// 			} else {
// 			targetInput.focus();
// 			}
// 		}
// 	},
// 	
// 	handleSubmit(event) {
// 		const distributor = model.database.state.distributor;
// 		const currentStage = model.database.state.stage;
// 		const nextStage = currentStage === 'boh' ? 'enRoute' : currentStage === 'enRoute' ? 'order' : 'boh';
		
// 		if (nextStage === 'boh') {
// 			model.removeRemoteDatabase();
// 		}

// 		if (nextStage === 'enRoute' || nextStage === 'order') {
// 			const newItemsData = model.database.data[distributor].map(item => {
// 				if (isNaN(parseInt(item[currentStage]))) {
// 					return { ...item, [currentStage]: 0 };
// 				} else {
// 					return item;
// 				}
// 			});
// 			const pathToItemsData = `data.${distributor}`;
// 			model.updateLocalDatabase(newItemsData, pathToItemsData);
// 		}

// 		if (nextStage === 'order') {
// 			model.calculateOrder();
// 		}
		
// 		const newStageData = nextStage;
// 		const pathToStageData = `state.stage`;
// 		model.updateLocalDatabase(newStageData, pathToStageData);
		
// 		if (nextStage !== 'boh') {
// 			model.updateRemoteDatabase();
// 		}
// 	},
// };

// export default controller;
