// Global Database
let database;

// App
const $app = document.querySelector('#app');

// Load App
function loadApp() {
	// Clear DOM
	$app.replaceChildren();

	// Access Local Storage
	database = localStorage.getItem('database');
	if (database) {
		database = JSON.parse(database);
	} else {
		database = {
			data: null,
			state: {
				index: null,
				distributors: ['cdc', 'rdc', 'staples', 'createOrder'],
				distributorsText: ['CDC-Penske', 'RDC-York', 'Staples', 'Create Order'],
				stage: 'distributor',
				stages: ['distributor', 'onHand', 'enRoute', 'order'],
				stagesText: ['Select Distributor', 'On Hand', 'En Route', 'Order'],
				uom: 'eaches',
				uoms: ['eaches', 'cases'],
				uomsText: ['Eaches', 'Cases'],
			},
		};
		localStorage.setItem('database', JSON.stringify(database));
	}

	// Local Variables
	const data = database.data;
	const state = database.state;
	const index = state.index;
	const distributors = state.distributors;
	const distributorsText = state.distributorsText;
	const stage = state.stage;
	const stages = state.stages;
	const stagesText = state.stagesText;
	const uom = state.uom;
	const uoms = state.uoms;
	const uomsText = state.uomsText;

	// App > Heading
	const $heading = document.createElement('h1');
	$heading.classList.add('heading');
	$heading.textContent = stagesText[stages.indexOf(stage)];
	$app.append($heading);

	// Distributor Stage
	if (stage === 'distributor') {
		// App > Distributors
		const $distributors = document.createElement('div');
		$distributors.classList.add('distributors');

		// App > Distributors > Distributor...
		distributors.map((distributor, index) => {
			const $distributor = document.createElement('div');
			$distributor.classList.add('distributor');
			$distributor.textContent = distributorsText[index];

			// Distributor Click Event
			$distributor.onclick = () => {
				// Loading Screen
				const $loading = document.createElement('div');
				$loading.classList.add('loading');
				$loading.textContent = 'Loading...';
				$app.replaceChildren($loading);

				// Update State
				state.distributor = distributor;
				state.stage = 'onHand';

				// Fetch Data
				const spreadsheetId = '1DDYliKZaRh0reUxmcLrQ-QS_2lf_qmeIuiM0nRWN_gk';
				const range = distributor;
				const key = 'AIzaSyADnkNWzw5wme2wHe2PQzpjm-Kv77Hsl_s';
				const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`;
				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						data = data.values.slice(1);
						data = data.map((datum) => {
							const [description, uom, par] = datum;
							datum = {
								description,
								uom: +uom,
								par: +par,
								onHand: {
									eaches: {
										value: 0,
										updated: false,
									},
									cases: {
										value: 0,
										updated: false,
									},
									updated: false,
								},
								enRoute: {
									eaches: {
										value: 0,
										updated: false,
									},
									cases: {
										value: 0,
										updated: false,
									},
									updated: false,
								},
							};
							return datum;
						});

						// Update Data
						database.data = data;

						// Reload App
						localStorage.setItem('database', JSON.stringify(database));
						loadApp();
					});
			};

			$distributors.append($distributor);
		});

		$app.append($distributors);
	}

	// All Other Stages
	else {
		// App > Form
		const $form = document.createElement('div');
		$form.classList.add('form');

		// App > Form > Items
		const $items = document.createElement('ul');
		$items.classList.add('items');

		// App > Form > Items > Item...
		data.forEach((datum, index) => {
			const $item = document.createElement('li');
			$item.classList.add('item');
			if (datum.par === 0) {
				$item.classList.add('disabled');
			}

			// Item Click Event
			$item.onclick = () => {
				state.index = index;

				// Reload App
				localStorage.setItem('database', JSON.stringify(database));
				loadApp();
			};

			// App > Form > Items > Item > Description
			const $description = document.createElement('div');
			$description.classList.add('description');
			$description.textContent = datum.description;
			$item.append($description);

			// App > Form > Items > Item > Details
			const $details = document.createElement('div');
			$details.classList.add('details');

			// App > Form > Items > Item > Details > Checkmark
			const $checkmark = document.createElement('div');
			$checkmark.classList.add('checkmark');
			$checkmark.textContent = '✓';
			if (stage === 'order' || datum[stage].updated === false) {
				$checkmark.classList.add('hidden');
			}
			$details.append($checkmark);

			// App > Form > Items > Item > Details > Total
			const $total = document.createElement('div');
			$total.classList.add('total');
			if (stage !== 'order') {
				if (datum.onHand.updated) {
					$total.textContent = datum.onHand.eaches.value + datum.onHand.cases.value * datum.uom;
					if (datum.enRoute.updated) {
						$total.textContent =
							+$total.textContent + datum.enRoute.eaches.value + datum.enRoute.cases.value * datum.uom;
					}
				} else {
					$total.textContent = '- -';
				}
			} else {
				const total = Math.ceil(
					(datum.par -
						(datum.onHand.eaches.value +
							datum.onHand.cases.value * datum.uom +
							datum.enRoute.eaches.value +
							datum.enRoute.cases.value * datum.uom)) /
						datum.uom,
				);
				if (total >= 0) {
					$total.textContent = total;
				} else {
					$total.textContent = 0;
				}
			}
			$details.append($total);

			$item.append($details);

			$items.append($item);
		});

		$form.append($items);

		// App > Submit
		const $submit = document.createElement('div');
		$submit.classList.add('submit');
		$submit.textContent = 'Complete';

		// Submit Click Event
		$submit.onclick = () => {
			if (stage !== 'order') {
				database.data = database.data.map((datum) => {
					datum[stage].updated = true;
					return datum;
				});
			}
			state.stage = stages[stages.indexOf(stage) + 1];
			state.uom = 'eaches';

			// Reload App
			if (state.stage === undefined) {
				localStorage.clear();
			} else {
				localStorage.setItem('database', JSON.stringify(database));
			}
			$app.scrollTop = 0;
			loadApp();
		};

		$form.append($submit);

		$app.append($form);

		// App > Modal
		if (index !== null) {
			const $modal = document.createElement('div');
			$modal.classList.add('modal');

			// App > Modal > Display
			const $display = document.createElement('div');
			$display.classList.add('display');

			// App> Modal > Display > Header
			const $header = document.createElement('div');
			$header.classList.add('header');

			// App > Modal > Display > Header > Description
			const $description = document.createElement('div');
			$description.classList.add('description');
			$description.textContent = data[index].description;
			$header.append($description);

			// App > Modal > Display > Header > Total
			const $total = document.createElement('div');
			$total.classList.add('total');
			if (stage !== 'order') {
				if (data[index].onHand.updated) {
					$total.textContent = data[index].onHand.eaches.value + data[index].onHand.cases.value * data[index].uom;

					if (data[index].enRoute.updated) {
						$total.textContent =
							+$total.textContent +
							data[index].enRoute.eaches.value +
							data[index].enRoute.cases.value * data[index].uom;
					}
				} else {
					$total.textContent = '- -';
				}
			} else {
				const ceiling = Math.ceil(
					(data[index].par -
						(data[index].onHand.eaches.value +
							data[index].onHand.cases.value * data[index].uom +
							data[index].enRoute.eaches.value +
							data[index].enRoute.cases.value * data[index].uom)) /
						data[index].uom,
				);
				if (ceiling < 0) {
					$total.textContent = 0;
				} else {
					$total.textContent = ceiling;
				}
			}
			$header.append($total);

			$display.append($header);

			if (stage !== 'order') {
				// App > Modal > Display > Inventory
				const $inventory = document.createElement('div');
				$inventory.classList.add('inventory');

				const $onHand = document.createElement('span');
				$onHand.classList.add('onHand');

				const $span = document.createElement('span');
				$span.textContent = ' / ';

				const $enRoute = document.createElement('span');
				$enRoute.classList.add('enRoute');

				if (data[index].onHand.updated) {
					$onHand.textContent = `On Hand ${
						data[index].onHand.eaches.value + data[index].onHand.cases.value * data[index].uom
					}`;
					if (data[index].enRoute.updated) {
						$enRoute.textContent = `En Route ${
							data[index].enRoute.eaches.value + data[index].enRoute.cases.value * data[index].uom
						}`;
					} else {
						$enRoute.textContent = `En Route - -`;
					}
				} else {
					$onHand.textContent = 'On Hand - -';
					$enRoute.textContent = 'En Route - -';
				}

				$inventory.append($onHand, $span, $enRoute);

				$display.append($inventory);

				// App > Modal > Display > Details
				const $details = document.createElement('div');
				$details.classList.add('details');
				$details.textContent = `${data[index].uom}/cs / Par ${data[index].par}`;
				$display.append($details);

				$modal.append($display);

				// App > Modal > Controls
				const $controls = document.createElement('div');
				$controls.classList.add('controls');

				// App > Modal > Controls > Tabulature
				const $tabulature = document.createElement('div');
				$tabulature.classList.add('tabulature');

				// App > Modal > Controls > Tabulature > Tabs;
				const $tabs = document.createElement('div');
				$tabs.classList.add('tabs');

				// App > Modal > Controls > Tabulature > Tabs > Tab...
				uoms.map((_uom, _index) => {
					const $tab = document.createElement('div');
					$tab.classList.add('tab');
					if (_uom === uom) {
						$tab.classList.add('active');
					}

					// Tab Click Event
					$tab.onclick = () => {
						if (_uom !== uom) {
							state.uom = _uom;

							// Reload App
							localStorage.setItem('database', JSON.stringify(database));
							loadApp();
						}
					};

					// App > Modal > Controls > Tabulature > Tabs > Tab... > UOM
					const $uom = document.createElement('div');
					$uom.classList.add('uom');
					$uom.textContent = uomsText[_index];
					$tab.append($uom);

					// App > Modal > Controls > Tabulature > Tabs > Tab... > Subtotal
					const $subtotal = document.createElement('div');
					$subtotal.classList.add('subtotal');
					if (data[index][stage][_uom].updated) {
						$subtotal.textContent = data[index][stage][_uom].value;
					} else {
						$subtotal.textContent = '- -';
					}
					$tab.append($subtotal);

					$tabs.append($tab);
				});

				$tabulature.append($tabs);

				// App > Modal > Controls > Tabulature > Accumulator
				const $accumulator = document.createElement('div');
				$accumulator.classList.add('accumulator');

				// App > Modal > Controls > Tabulature > Accumulator > Decrementor
				const $decrementor = document.createElement('div');
				$decrementor.classList.add('decrementor');
				$decrementor.textContent = '−';

				// Decrementor Click Event
				$decrementor.onclick = () => {
					if (data[index][stage][uom].value > 0) {
						data[index][stage][uom].value--;
					}
					if (data[index][stage][uom].updated === false) {
						data[index][stage][uom].updated = true;
					}
					if (data[index][stage].updated === false) {
						data[index][stage].updated = true;
					}

					// Reload App
					localStorage.setItem('database', JSON.stringify(database));
					loadApp();
				};

				$accumulator.append($decrementor);

				// App > Modal > Controls > Tabulature > Accumulator > Subtotal
				const $subtotal = document.createElement('div');
				$subtotal.classList.add('subtotal');
				if (data[index][stage][uom].updated) {
					$subtotal.textContent = data[index][stage][uom].value;
				} else {
					$subtotal.textContent = '- -';
				}
				$accumulator.append($subtotal);

				// App > Modal > Controls > Tabulature > Accumulator > Incrementor
				const $incrementor = document.createElement('div');
				$incrementor.classList.add('incrementor');
				$incrementor.textContent = '+';

				// Incrementor Click Event
				$incrementor.onclick = () => {
					if (data[index][stage][uom].value < 500) {
						data[index][stage][uom].value++;
						if (data[index][stage][uom].updated === false) {
							data[index][stage][uom].updated = true;
						}
						if (data[index][stage].updated === false) {
							data[index][stage].updated = true;
						}

						// Reload App
						localStorage.setItem('database', JSON.stringify(database));
						loadApp();
					}
				};

				$accumulator.append($incrementor);

				$tabulature.append($accumulator);

				$controls.append($tabulature);

				// App > Modal > Controls > Keypad
				const $keypad = document.createElement('div');
				$keypad.classList.add('keypad');

				// App > Modal > Controls > Keypad > Key...
				const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '<', '0', 'OK'];
				keys.map((key) => {
					const $key = document.createElement('div');
					$key.classList.add('key');
					$key.textContent = key;

					// Key Click Event
					$key.onclick = () => {
						const _datum = data[index];
						const _stage = _datum[stage];
						const _uom = _stage[uom];
						const _value = _uom.value;

						if (key === 'OK') {
							state.index = null;
							state.uom = 'eaches';
						} else {
							if (key === '<') {
								if (_value > 9) {
									_uom.value = +`${_value}`.slice(0, `${_value}`.length - 1);
								} else {
									_uom.value = 0;
								}
							} else if (key === '0') {
								if (_value > 0) {
									_uom.value = +`${_uom.value}0`;
								}
							} else {
								if (_value > 0) {
									_uom.value = +`${_uom.value}${key}`;
								} else {
									_uom.value = +key;
								}
							}
							_uom.updated = true;
							_stage.updated = true;
						}

						// Reload App
						localStorage.setItem('database', JSON.stringify(database));
						loadApp();
					};

					$keypad.append($key);
				});

				$controls.append($keypad);

				$modal.append($controls);
			} else if (stage === 'order') {
				// App > Modal > Display > Details
				const $details = document.createElement('div');
				$details.classList.add('details', 'order');

				// LaTex Formula
				let generator = new window.latexjs.HtmlGenerator();
				let formula = `$$\\max\\left(0, \\left\\lceil\\frac{Par - (On Hand + En Route)}{UoM}\\right\\rceil\\right)=Order$$`;
				formula = window.latexjs.parse(formula, { generator }).domFragment();
				formula = formula.querySelector('.katex-mathml');
				$details.append(formula);

				// LaTeX Text
				generator = new window.latexjs.HtmlGenerator();
				const par = data[index].par;
				const onHand = data[index].onHand.eaches.value + data[index].onHand.cases.value * data[index].uom;
				const enRoute = data[index].enRoute.eaches.value + data[index].enRoute.cases.value * data[index].uom;
				const uom = data[index].uom;
				const ceiling = Math.ceil((par - (onHand + enRoute)) / uom);
				let text;
				if (ceiling < 1) {
					text = `$$\\max\\left(0, \\left\\lceil\\frac{${par}\\ ea - (${onHand}\\ ea + ${enRoute}\\ ea)}{${uom}\\ /cs}\\right\\rceil=${ceiling}\\ cs\\right)=0\\ cs$$`;
				} else {
					text = `$$\\max\\left(0, \\left\\lceil\\frac{${par}\\ ea - (${onHand}\\ ea + ${enRoute}\\ ea)}{${uom}\\ /cs}\\right\\rceil\\right)=${ceiling}\\ cs$$`;
				}
				text = window.latexjs.parse(text, { generator }).domFragment();
				text = text.querySelector('.katex-mathml');
				$details.append(text);

				$display.append($details);

				$modal.append($display);

				// App > Modal > OK
				const $ok = document.createElement('div');
				$ok.classList = 'ok';
				$ok.textContent = 'OK';

				$ok.onclick = () => {
					state.index = null;

					// Reload App
					localStorage.setItem('database', JSON.stringify(database));
					loadApp();
				};

				$modal.append($ok);
			}

			$app.append($modal);
		}
	}
}

loadApp();
