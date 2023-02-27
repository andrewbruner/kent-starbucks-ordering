import model from "./model.js";
import view from "./view.js";

const remoteDatabaseDoesExist = model.getRemoteDatabase();
if (remoteDatabaseDoesExist) {
	view.updateView(model.database);
} else {
	const url = 'https://sheets.googleapis.com/v4/spreadsheets/1zx7TGo9KbCaaZYzrFheBvNNjMopc6_Caxy8_xwKd3xI/values/cdc?alt=json&key=AIzaSyADnkNWzw5wme2wHe2PQzpjm-Kv77Hsl_s';
	fetch(url)
		.then(response => response.json())
		.then(data => {
			const newData = model.processData(data);
			const pathToData = 'data.cdc';
			model.updateLocalDatabase(newData, pathToData);
			model.updateRemoteDatabase();
			view.updateView(model.database);
		});
}
