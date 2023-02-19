const model = {
	seed: {
		id: 'data',
		state: {
			dist: 'cdc',
			stage: 'boh',
		},
		database: {
			cdc: [
				{
						"description": "Chai Concentrate",
						"uom": 12,
						"par": 60
				},
				{
						"description": "Whole Milk",
						"uom": 1,
						"par": 26
				},
				{
						"description": "2% Milk",
						"uom": 4,
						"par": 164
				},
				{
						"description": "Heavy Cream",
						"uom": 1,
						"par": 81
				},
				{
						"description": "Nonfat Milk",
						"uom": 4,
						"par": 14
				},
				{
						"description": "Half & Half",
						"uom": 1,
						"par": 23
				},
				{
						"description": "White Mocha",
						"uom": 4,
						"par": 19
				},
				{
						"description": "Strawberry Inc.",
						"uom": 10,
						"par": 30
				},
				{
						"description": "Caramel Sauce",
						"uom": 6,
						"par": 14
				},
				{
						"description": "Mocha",
						"uom": 6,
						"par": 12
				},
				{
						"description": "Sugar-Free Vanilla",
						"uom": 6,
						"par": 7
				},
				{
						"description": "Coconutmilk",
						"uom": 8,
						"par": 30
				},
				{
						"description": "Strawberry Puree",
						"uom": 6,
						"par": 5
				},
				{
						"description": "Butter",
						"uom": 1,
						"par": 2
				},
				{
						"description": "Almondmilk",
						"uom": 8,
						"par": 60
				},
				{
						"description": "Vanilla Syrup",
						"uom": 12,
						"par": 79
				},
				{
						"description": "Caramel Syrup",
						"uom": 6,
						"par": 7
				},
				{
						"description": "Classic Syrup",
						"uom": 6,
						"par": 7
				},
				{
						"description": "Soymilk",
						"uom": 8,
						"par": 21
				},
				{
						"description": "Strawberry Acai",
						"uom": 6,
						"par": 83
				},
				{
						"description": "Mango Dragonfruit",
						"uom": 6,
						"par": 17
				},
				{
						"description": "Oatmilk",
						"uom": 12,
						"par": 217
				},
				{
						"description": "Frappuccino Chip",
						"uom": 6,
						"par": 7
				},
				{
						"description": "Coffee Base",
						"uom": 4,
						"par": 14
				},
				{
						"description": "Creme Base",
						"uom": 4,
						"par": 5
				},
				{
						"description": "Lemonade",
						"uom": 6,
						"par": 37
				},
				{
						"description": "Cream Cheese",
						"uom": 1,
						"par": 3
				},
				{
						"description": "Avocado Spread",
						"uom": 1,
						"par": 4
				},
				{
						"description": "Blueberries",
						"uom": 1,
						"par": 2
				},
				{
						"description": "Ethos Water",
						"uom": 1,
						"par": 1
				},
				{
						"description": "5lb Espresso",
						"uom": 4,
						"par": 14
				},
				{
						"description": "5lb Pike Place",
						"uom": 4,
						"par": 7
				},
				{
						"description": "5lb Cold Brew",
						"uom": 4,
						"par": 21
				},
				{
						"description": "Tall Hot Cup",
						"uom": 24,
						"par": 10
				},
				{
						"description": "Grande Hot Cup",
						"uom": 20,
						"par": 30
				},
				{
						"description": "Venti Hot Cup",
						"uom": 15,
						"par": 30
				},
				{
						"description": "Tall Cold Cup",
						"uom": 20,
						"par": 7
				},
				{
						"description": "Grande Cold Cup",
						"uom": 20,
						"par": 50
				},
				{
						"description": "Venti Cold Cup",
						"uom": 15,
						"par": 60
				},
				{
						"description": "Trenta Cup",
						"uom": 10,
						"par": 20
				},
				{
						"description": "Tall Hot Lid",
						"uom": 12,
						"par": 3
				},
				{
						"description": "G/V Hot Lid",
						"uom": 12,
						"par": 25
				},
				{
						"description": "Tall Strawless Lid",
						"uom": 10,
						"par": 3
				},
				{
						"description": "G/V Strawless Lid",
						"uom": 10,
						"par": 30
				},
				{
						"description": "Trenta Lid",
						"uom": 6,
						"par": 10
				},
				{
						"description": "Tall Dome Lid",
						"uom": 10,
						"par": 3
				},
				{
						"description": "G/V Dome Lid",
						"uom": 10,
						"par": 10
				}
			],
			rdc: [],
		},
	},
	data: {},

	updateDatabase(newData) {
		return new Promise(resolve => {
			const request = window.indexedDB.open('database', 1);
			request.onupgradeneeded = event => {
				const database = event.target.result;
				const objectStore = database.createObjectStore('data', { keyPath: 'id' });
				const seed = this.seed;
				objectStore.add(seed);
			};
			request.onsuccess = event => {
				const database = event.target.result;
				const transaction = database.transaction('data', 'readwrite');
				const objectStore = transaction.objectStore('data');
				const request = objectStore.get('data');
				request.onsuccess = event => {
					let data = event.target.result;
					if (newData) {
						data = { ...data, ...newData };
						const request = objectStore.put(data);
						this.data = data;
						request.onsuccess = event => {
							resolve(this.data);
						};
					}
					this.data = data;
					resolve(this.data);
				};
			};
		});
		
	},
	calculateOrder() {
		const request = window.indexedDB.open('database', 1);
			request.onsuccess = event => {
				const database = event.target.result;
				const transaction = database.transaction('data', 'readwrite');
				const objectStore = transaction.objectStore('data');
				const request = objectStore.get('data');
				request.onsuccess = event => {
					let data = event.target.result;
					data.database.cdc.forEach(item => {
						item.order = Math.ceil((item.par - item.boh - (item.enRoute * item.uom)) / item.uom);
						item.order = item.order > 0 ? item.order : '0';
					});
					objectStore.put(data);
					this.data = data;
				};
			};
	},
	resetDatabase() {
		const request = window.indexedDB.deleteDatabase('database');
		request.onsuccess = function(event) {
			window.location.reload();
		};
	},
};

export default model;
