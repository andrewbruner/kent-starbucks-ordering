const app = document.querySelector('#app');

let state = {};
document.state = state;

function load() {
	// Load State
	const localState = JSON.parse(localStorage.getItem('state'));
	if (localState) {
		state = localState;
	}

	// Reset View
	reset();

	// Inital Stage
	if (state.stage === undefined) {
		const div = create({
			tagName: 'div',
			classList: ['distributor'],
		});
		const h1 = create({
			tagName: 'h1',
			textContent: 'Select Distributor',
		});
		const button1 = create({
			tagName: 'div',
			textContent: 'CDC-Penske',
			classList: ['button'],
			dataset: [['distributor', 'cdc']],
			onclick: selectDistributor,
		});
		const button2 = create({
			tagName: 'div',
			textContent: 'RDC-York',
			classList: ['button'],
			dataset: [['distributor', 'rdc']],
			onclick: selectDistributor,
		});
		const button3 = create({
			tagName: 'div',
			textContent: 'Staples',
			classList: ['button'],
			dataset: [['distributor', 'staples']],
			onclick: selectDistributor,
		});
		div.append(h1, button1, button2, button3);
		app.append(div);
	}

	// On-Hand and En-Route Stages
	else if (state.stage === 'onHand' || state.stage === 'enRoute') {
		const div = create({ tagName: 'div', classList: [state.stage] });
		const h1 = create({ tagName: 'h1', textContent: state.stage === 'onHand' ? 'On Hand' : 'En Route' });
		const ul = create({ tagName: 'ul' });
		const lis = state.items.map((item, index) => {
			const li = create({
				tagName: 'li',
				dataset: [['index', index]],
				onclick: selectItem,
			});
			const description = create({
				tagName: 'span',
				textContent: item.description,
			});
			const checkmark = create({
				tagName: 'span',
				textContent: '✓',
				classList: [
					state.items[index][state.stage].eaches !== '' || state.items[index][state.stage].cases !== ''
						? 'checkmark'
						: 'hidden',
				],
			});
			const total = create({
				tagName: 'span',
				textContent: getTotal(item),
			});
			li.append(description, checkmark, total);
			return li;
		});
		ul.append(...lis);
		const button = create({
			tagName: 'div',
			textContent: 'Complete',
			classList: ['button'],
			onclick: selectComplete,
		});
		div.append(h1, ul, button);
		app.append(div);

		// Modal Active
		if (state.index) {
			const modal = create({ tagName: 'div', classList: ['modal'] });
			const display = create({ tagName: 'div', classList: ['display'] });
			const header = create({ tagName: 'div', classList: ['header'] });
			const description = create({
				tagName: 'div',
				textContent: state.items[state.index].description,
				classList: ['description'],
			});
			const total = create({ tagName: 'div', textContent: getTotal(state.items[state.index]), classList: ['total'] });
			header.append(description, total);
			const stages = create({
				tagName: 'div',
				textContent: `On Hand ${getTotal(state.items[state.index], 'onHand')} / En Route ${getTotal(
					state.items[state.index],
					'enRoute'
				)}`,
				classList: ['stages'],
			});
			const details = create({
				tagName: 'div',
				textContent: `${state.items[state.index].uom}/cs / Par ${state.items[state.index].par}`,
				classList: ['details'],
			});
			display.append(header, stages, details);
			const controls = create({ tagName: 'div', classList: ['controls'] });
			const tabs = create({ tagName: 'div', classList: ['tabs'] });
			const tab1 = create({
				tagName: 'div',
				classList: state.uom === 'eaches' ? ['tab', 'active'] : ['tab'],
				dataset: [['uom', 'eaches']],
				onclick: selectUom,
			});
			const uom1 = create({
				tagName: 'div',
				textContent: 'Eaches',
				classList: ['uom'],
			});
			const subtotal1 = create({
				tagName: 'div',
				textContent: getTotal(state.items[state.index], state.stage, 'eaches'),
				classList: ['subtotal'],
			});
			tab1.append(uom1, subtotal1);
			const tab2 = create({
				tagName: 'div',
				classList: state.uom === 'cases' ? ['tab', 'active'] : ['tab'],
				dataset: [['uom', 'cases']],
				onclick: selectUom,
			});
			const uom2 = create({
				tagName: 'div',
				textContent: 'Cases',
				classList: ['uom'],
			});
			const subtotal2 = create({
				tagName: 'div',
				textContent: getTotal(state.items[state.index], state.stage, 'cases'),
				classList: ['subtotal'],
			});
			tab2.append(uom2, subtotal2);
			tabs.append(tab1, tab2);
			const accumulator = create({ tagName: 'div', classList: ['accumulator'] });
			const decrementor = create({ tagName: 'div', textContent: '−', classList: ['decrementor'], onclick: decrement });
			const subtotal = create({
				tagName: 'div',
				textContent: getTotal(state.items[state.index], [state.stage], [state.uom]),
				classList: ['subtotal'],
			});
			const incrementor = create({ tagName: 'div', textContent: '+', classList: ['incrementor'], onclick: increment });
			accumulator.append(decrementor, subtotal, incrementor);
			const keypad = create({ tagName: 'div', classList: ['keypad'] });
			let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '<', '0', 'OK'];
			keys = keys.map((key) =>
				create({
					tagName: 'div',
					textContent: key,
					classList: ['key'],
					dataset: [['key', key]],
					onclick: selectKey,
				})
			);
			keypad.append(...keys);
			controls.append(tabs, accumulator, keypad);
			modal.append(display, controls);
			app.append(modal);
		}
	}

	// Order Stage
	else if (state.stage === 'order') {
		const div = create({ tagName: 'div', classList: ['order'] });
		const h1 = create({
			tagName: 'h1',
			textContent: 'Order',
		});
		const ul = create({ tagName: 'ul' });
		const lis = state.items.map((item, index) => {
			const li = create({
				tagName: 'li',
				dataset: [['index', index]],
			});
			const description = create({
				tagName: 'span',
				textContent: item.description,
			});
			const space = create({tagname: 'div'});
			const total = create({
				tagName: 'span',
				textContent: getTotal(item),
			});
			li.append(description, space, total);
			return li;
		});
		ul.append(...lis);
		const button = create({
			tagName: 'div',
			textContent: 'Complete',
			classList: ['button'],
			onclick: selectComplete,
		});
		div.append(h1, ul, button);
		app.append(div);
	}
}

// Helper Functions
// ================

// View Helpers
// ------------

function reload() {
	load();
}

function reset() {
	const app = document.querySelector('#app');
	if (app.children) {
		[...app.children].forEach((child) => child.remove());
	}
}

function create({ tagName, textContent, classList, dataset, onclick }) {
	const element = document.createElement(tagName);
	element.textContent = textContent;
	if (classList) {
		element.classList.add(...classList);
	}
	if (dataset) {
		dataset.forEach((datum) => {
			const [key, value] = datum;
			element.dataset[key] = value;
		});
	}
	element.onclick = onclick;
	return element;
}

// State Helpers
// -------------

async function fetchData() {
	const spreadsheetId = '1DDYliKZaRh0reUxmcLrQ-QS_2lf_qmeIuiM0nRWN_gk';
	const range = state.distributor;
	// key usage restricted to reading publicly shared website
	const key = 'AIzaSyADnkNWzw5wme2wHe2PQzpjm-Kv77Hsl_s';
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`;
	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			const values = data.values.slice(1);
			state.items = values.map((value) => {
				const [description, uom, par] = value;
				const item = {
					description,
					uom,
					par,
					onHand: {
						eaches: '',
						cases: '',
					},
					enRoute: {
						eaches: '',
						cases: '',
					},
				};
				return item;
			});
		});
}

function update() {
	localStorage.setItem('state', JSON.stringify(state));
}

function selectDistributor(event) {
	const distributor = event.currentTarget.dataset.distributor;
	state.distributor = distributor;
	state.stage = 'onHand';
	fetchData().then(() => {
		update();
		reload();
	});
}

function selectItem(event) {
	state.index = event.currentTarget.dataset.index;
	state.uom = 'eaches';
	update();
	reload();
}

function selectUom(event) {
	state.uom = event.currentTarget.dataset.uom;
	update();
	reload();
}

function selectKey(event) {
	const key = event.currentTarget.dataset.key;
	if (key === 'OK') {
		delete state.index;
		delete state.modal;
		delete state.uom;
	} else {
		if (key === '<') {
			state.items[state.index][state.stage][state.uom] =
				state.items[state.index][state.stage][state.uom].slice(0, -1) || '0';
		} else {
			if (state.items[state.index][state.stage][state.uom] === '0') {
				state.items[state.index][state.stage][state.uom] = key;
			} else {
				state.items[state.index][state.stage][state.uom] = state.items[state.index][state.stage][state.uom] += key;
			}
		}
	}
	update();
	reload();
}

function increment() {
	state.items[state.index][state.stage][state.uom] = `${+state.items[state.index][state.stage][state.uom] + 1}`;
	update();
	reload();
}
function decrement() {
	if (state.items[state.index][state.stage][state.uom] > 0) {
		state.items[state.index][state.stage][state.uom] = `${state.items[state.index][state.stage][state.uom] - 1}`;
	} else {
		state.items[state.index][state.stage][state.uom] = '0';
	}
	update();
	reload();
}

function selectComplete() {
	if (state.stage !== 'order') {
		if (state.stage === 'onHand') {
			state.items.forEach((item) => {
				if (item.onHand.eaches === '') {
					item.onHand.eaches = '0';
				}
			});
			state.stage = 'enRoute';
		} else if (state.stage === 'enRoute') {
			state.stage = 'order';
		}
		document.querySelector('body').scrollTo(0, 0);
		update();
		reload();
	} else {
		delete state.stage;
		delete state.distributor;
		delete state.items;
		localStorage.clear();
		reload();
	}
}

// Getter Helper
// -------------

function getTotal(item, stage, uom) {
	if (stage) {
		if (uom) {
			if (item[stage][uom] !== '') {
				return item[stage][uom];
			} else {
				return '- -';
			}
		} else if (item[stage].eaches !== '' || item[stage].cases !== '') {
			return `${+item[stage].eaches + +item[stage].cases * +item.uom}`;
		} else {
			return '- -';
		}
	} else {
		if (state.stage === 'onHand') {
			return getTotal(item, 'onHand');
		} else if (state.stage === 'enRoute') {
			if (item.enRoute.eaches !== '' || item.enRoute.cases !== '') {
				return `${+getTotal(item, 'onHand') + +getTotal(item, 'enRoute')}`;
			} else {
				return getTotal(item, 'onHand');
			}
		} else {
			let totalOnHand = getTotal(item, 'onHand');
			if (totalOnHand === '- -') {
				totalOnHand = '0';
			}
			let totalEnRoute = getTotal(item, 'enRoute');
			if (totalEnRoute === '- -') {
				totalEnRoute = '0';
			}
			let order = Math.ceil((+item.par - +totalOnHand - +totalEnRoute) / item.uom);
			if (order < 0) {
				order = 0;
			}
			return order;
		}
	}
}

load();
