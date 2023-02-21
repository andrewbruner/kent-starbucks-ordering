import model from './model.js';
import view from './view.js';

const controller = {
	handleFocusout(event) {
		const input = event.target;
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
