/**
 * @typedef {import('./types.js').Item} Item
 * @typedef {import('./types.js').Data} Data
 */

const model = {

	async fetchRemote(distributor) {
		const spreadsheetId = String('1zx7TGo9KbCaaZYzrFheBvNNjMopc6_Caxy8_xwKd3xI');
		const range = String(distributor);
		// key usage restricted to specified website
		const key = String('AIzaSyADnkNWzw5wme2wHe2PQzpjm-Kv77Hsl_s');
		const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`);
		return await fetch(url)
			.then(response => response.json())
			.then(data => ({
				distributor,
				[distributor]: data.values.filter(data => data.length === 3)
					.map(data => ({
						description: String(data[0]),
						uom: Number(data[1].split('/')[0]),
						par: Number(data[2]),
					})),
			}));
	},

	createData(data) {
		window.sessionStorage.setItem('data', JSON.stringify({
			state: { stage: 'boh', distributor: data.distributor, },
			[data.distributor]: data[data.distributor],
		}));
	},

	/**
	 * Gets sessionStorage data.
	 * @param {string} key - Target sessionStorage data key
	 * @returns {Data|null} Current sessionStorage data for target key, or null if key does not exist
	 */
	readData(key) {
		return JSON.parse(window.sessionStorage.getItem(key));
	},

	/**
	 * @param {Data} _data 
	 * @param {string} newData 
	 * @param {string} path 
	 */
	updateData(_data, newData, path) {
		let data = _data;
		path = path.split('.');
		let i = 0;
		for (i = 0; i < path.length - 1; i++) {
			data = data[path[i]];
		}
		data[path[i]] = newData;
		window.sessionStorage.setItem('data', JSON.stringify(_data));
	},

	deleteData() {
		window.sessionStorage.removeItem('data');
	},

	calculateOrder() {
		const data = this.readData();
		const distributor = data.state.distributor;
		const newData = data[distributor].map(item => {
			let order = Math.ceil((item.par - item.boh - (item.enRoute * item.uom)) / item.uom);
			order = order > 0 ? order : 0;
			item = { ...item, order };
			return item
		});
		return { distributor: newData, };
	},
};

export default model;
