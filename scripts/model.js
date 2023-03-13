/**
 * @typedef {import('./types.js').Item} Item
 * @typedef {import('./types.js').Data} Data
 */

const model = {
	/**
	 * @param {string} distributor
	 * @returns {Promise<Item[]>}
	 */
	async fetchRemote(distributor) {
		const spreadsheetId = String('1zx7TGo9KbCaaZYzrFheBvNNjMopc6_Caxy8_xwKd3xI');
		const range = distributor;
		// key usage restricted to specified website
		const key = String('AIzaSyADnkNWzw5wme2wHe2PQzpjm-Kv77Hsl_s');
		const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`);
		return await fetch(url)
			.then(response => response.json())
			.then(data => data.values.filter(data => data.length === 3)
				.map(data => ({
					description: String(data[0]),
					uom: Number(data[1].split('/')[0]),
					par: Number(data[2]),
					boh: null,
					enRoute: null,
					order: null,
				})),
			);
	},

	/**
	 * @param {Data} data
	 */
	createData(data = { state: { stage: 'initial', distributor: null }, items: null }) {
		window.sessionStorage.setItem('data', JSON.stringify(data));
	},

	/**
	 * @returns {Data}
	 */
	readData() {
		return JSON.parse(window.sessionStorage.getItem('data'));
	},

	/**
	 * @param {Data} data 
	 * @param {*} newData 
	 * @param {string} path
	 */
	updateData(data, newData, path) {
		let _data = data;
		path = path.split('.');
		let i = 0;
		for (i = 0; i < path.length - 1; i++) {
			_data = _data[path[i]];
		}
		_data[path[i]] = newData;
		window.sessionStorage.setItem('data', JSON.stringify(data));
	},

	deleteData() {
		window.sessionStorage.removeItem('data');
	},

	/**
	 * @returns {Item[]}
	 */
	calculateOrder() {
		return this.readData().items.map(item => {
			let order = Math.ceil((item.par - item.boh - (item.enRoute * item.uom)) / item.uom);
			order = order > 0 ? order : 0;
			item = { ...item, order };
			return item
		});
	},
};

export default model;
