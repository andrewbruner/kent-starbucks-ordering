const model = {
	database: {
		state: {
			distributor: 'cdc',
			stage: 'boh',
		},
		data: {
			cdc: [],
			rdc: [],
		},
	},

	updateRemoteDatabase() {
		const localDatabase = this.database;
		const localDatabaseString = JSON.stringify(localDatabase);
		window.sessionStorage.setItem('database', localDatabaseString);
	},
	removeRemoteDatabase() {
		window.sessionStorage.removeItem('database');
	},
	getRemoteDatabase() {
		const remoteDatabaseString = window.sessionStorage.getItem('database');
		if (remoteDatabaseString) {
			const remoteDatabase = JSON.parse(remoteDatabaseString);
			this.database = remoteDatabase;
			return true;
		}
		return false;
	},
	updateLocalDatabase(newData, pathToData) {
		let localDatabaseReference = this.database;
		pathToData = pathToData.split('.');
		let i = 0
		for (i = 0; i < pathToData.length - 1; i++) {
			localDatabaseReference = localDatabaseReference[pathToData[i]];
		}
		localDatabaseReference[pathToData[i]] = newData;
	},
	calculateOrder() {
		const localDatabase = this.database;
		const distributor = localDatabase.state.distributor;
		const newData = localDatabase.data[distributor].map(item => {
			let order = Math.ceil((item.par - item.boh - (item.enRoute * item.uom)) / item.uom);
			order = order > 0 ? order : 0;
			item = { ...item, order };
			return item;
		});
		this.updateLocalDatabase(newData, `data.${distributor}`);
	},
	processData(data) {
		const dataArray = data.values;
		const items = [];
		dataArray.forEach(data => {
			if (data.length === 3) {
				const item = {};
				item.description = data[0];
				item.uom = parseInt(data[1].split('/')[0]);
				item.par = parseInt(data[2]);
				items.push(item);
			}
		});
		return items;
	},
};

export default model;
