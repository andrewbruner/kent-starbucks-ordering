import model from "./model.js";
import view from "./view.js";

const controller = {
	currentLineSelected: null,

	load() {
		const data = model.readData();
		data ? view.updateView(data) : view.load();
	},

	// handleFocusin(event, alertColor) {
	// 	const input = event.target;
	// 	if (input.tagName.toLowerCase() === 'input') {
	// 		input.previousSibling.classList.add('alert', alertColor, 'text-body', 'mb-0');
	// 		input.nextSibling.classList.add('alert', alertColor, 'text-body', 'mb-0');
	// 		this.currentLineSelected = input.parentElement;
	// 	}
	// },
	
	handleFocusout(event, color) {
		const input = event.target;
		if (input.tagName === 'INPUT') {
			input.previousSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			input.nextSibling.classList.remove('alert', color, 'text-body', 'mb-0');
			
				let data = model.readData();
				const distributor = data.state.distributor;
				const index = input.dataset.index;
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

	// handleClick(event, alertColor) {
	// 	const currentTarget = event.currentTarget;
	// 	const target = event.target;
	// 	if (target.tagName.toLowerCase() !== 'input') {
	// 		const targetInput = currentTarget.children[1];
	// 		if (this.currentLineSelected === currentTarget) {
	// 			this.currentLineSelected = null;
	// 			targetInput.blur();
	// 		} else {
	// 	 		targetInput.focus();
	// 		}
	// 	}
	// },

	async handleSubmit(event) {
		if (event.target.classList.contains('distributor')) {
			event.preventDefault();
			const distributor = event.submitter.value;
			await model.fetchRemote(distributor)
				.then(data => model.createData(data));
			event.target.submit();
		} else {
			// model.updateData(model.readData(), newData, path);
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
