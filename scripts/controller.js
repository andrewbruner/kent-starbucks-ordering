import model from './model.js';
import view from './view.js';

const controller = {
	currentLineSelected: null,
	handleClick(event, alertColor) {
		const currentTarget = event.currentTarget;
		const target = event.target;
		if (target.tagName.toLowerCase() !== 'input') {
			const targetInput = currentTarget.children[1];
			if (this.currentLineSelected === currentTarget) {
				this.currentLineSelected = null;
				targetInput.blur();
			} else {
			targetInput.focus();
			}
		}
	},
	handleFocusin(event, alertColor) {
		const input = event.target;
		if (input.tagName.toLowerCase() === 'input') {
			const previousSibling = input.previousSibling;
			const nextSibling = input.nextSibling;
			previousSibling.classList.add('alert', alertColor, 'text-body', 'mb-0');
			nextSibling.classList.add('alert', alertColor, 'text-body', 'mb-0');
			this.currentLineSelected = input.parentElement;
		}
	},
	handleFocusout(event, alertColor) {
		const input = event.target;
		if (input.tagName.toLowerCase() === 'input') {
			const previousSibling = input.previousSibling;
			const nextSibling = input.nextSibling;
			previousSibling.classList.remove('alert', alertColor, 'text-body', 'mb-0');
			nextSibling.classList.remove('alert', alertColor, 'text-body', 'mb-0');
			if ((input.value > 0 && input.value < 1000) || input.value === '0') {
				const value = input.value;
				const index = parseInt(input.dataset.index);
				const distributor = model.database.state.distributor;
				const stage = model.database.state.stage;
				const newData = parseInt(value);
				const pathToData = `data.${distributor}.${index}.${stage}`;
				model.updateLocalDatabase(newData, pathToData);
				model.updateRemoteDatabase();
			}
		}
	},
	handleSubmit(event) {
		const distributor = model.database.state.distributor;
		const currentStage = model.database.state.stage;
		const nextStage = currentStage === 'boh' ? 'enRoute' : currentStage === 'enRoute' ? 'order' : 'boh';
		
		if (nextStage === 'boh') {
			model.removeRemoteDatabase();
		}

		if (nextStage === 'enRoute' || nextStage === 'order') {
			const newItemsData = model.database.data[distributor].map(item => {
				if (isNaN(parseInt(item[currentStage]))) {
					return { ...item, [currentStage]: 0 };
				} else {
					return item;
				}
			});
			const pathToItemsData = `data.${distributor}`;
			model.updateLocalDatabase(newItemsData, pathToItemsData);
		}

		if (nextStage === 'order') {
			model.calculateOrder();
		}
		
		const newStageData = nextStage;
		const pathToStageData = `state.stage`;
		model.updateLocalDatabase(newStageData, pathToStageData);
		
		if (nextStage !== 'boh') {
			model.updateRemoteDatabase();
		}
	},
};

export default controller;
