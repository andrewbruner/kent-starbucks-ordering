import model from './model.js';
import view from './view.js';

const controller = {
	handleFocusout(event) {
		const input = event.target;
		if ((input.value > 0 && input.value < 1000) || input.value === '0') {
			const value = input.value;
			const index = parseInt(input.dataset.index);
			const dist = model.data.state.dist;
			const stage = model.data.state.stage;
			const newData = { ...model.data };
			newData.database[dist][index][stage] = parseInt(value);
			model.updateDatabase(newData);
		}
	},
	handleSubmit(event) {
		const currentStage = model.data.state.stage;
		const newStage = currentStage === 'boh' ? 'enRoute' : currentStage === 'enRoute' ? 'order' : 'boh';
		const newData = { ...model.data };
		newData.state.stage = newStage;
		newData.database.cdc.forEach(item => {
			if (isNaN(parseInt(item[currentStage]))) {
				item[currentStage] = 0;
			}
		});
		model.updateDatabase(newData).then(data => {
			if (data.state.stage === 'order') {
				model.calculateOrder();
			}
			if (data.state.stage === 'boh') {
				model.resetDatabase();
			}
		});
	},
};

model.updateDatabase()
	.then((data) => view.updateView(data));

export default controller;
