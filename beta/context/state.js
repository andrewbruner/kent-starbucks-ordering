import { reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const spreadsheetId = '1zx7TGo9KbCaaZYzrFheBvNNjMopc6_Caxy8_xwKd3xI';
const key = 'AIzaSyDRXTKMo8MartEfaghhASgsTGdvaaOzCHw';

const state = reactive({
    // Items
    _items: [],
    get items() {
        const items = { };
        this._items.forEach(item => items[item.id] = item);
        return items;
    },
    async fetchItems(distributor) {
        const range = distributor;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`;
        const items = await fetch(url)
            .then(response => response.json())
            .then(result => {
                const items = result.values
                    // Filter out non-item data
                    .filter(array => array.length === 3)
                    .map((array, index) => {
                        const description = array[0];
                        // UoM cell format is different based on which Google Sheet is fetched
                        const uom = (
                            distributor === 'cdc'
                            ? +array[1].slice(-array[1].length, -3)
                            // distributor === 'rdc'
                            : +array[1]
                        );
                        const par = +array[2];
                        const item = {
                            id: index.toString(),
                            description: description,
                            uom: uom.toString(),
                            onHand: {
                                eaches: {
                                    total: '0',
                                    isUpdated: false,
                                },
                                cases: {
                                    total: '0',
                                    isUpdated: false,
                                },
                                get total() {
                                    return (+this.eaches.total + (+this.cases.total * +item.uom)).toString();
                                },
                                get isUpdated() {
                                    return this.eaches.isUpdated || this.cases.isUpdated;
                                },
                            },
                            enRoute: {
                                cases: {
                                    total: '0',
                                    isUpdated: false,
                                },
                                get total() {
                                    return (+this.cases.total * +item.uom).toString();
                                },
                                get isUpdated() {
                                    return this.cases.isUpdated;
                                },
                            },
                            order: {
                                cases: {
                                    get total() {
                                        let total = Math.ceil((+item.par
                                            - (+item.onHand.total + +item.enRoute.total))
                                            / +item.uom);
                                        if (total > 0) {
                                            return total.toString();
                                        } else {
                                            return '0';
                                        }
                                    },
                                },
                                get total() {
                                    return this.cases.total;
                                },
                            },
                            get total() {
                                return (+this.onHand.total + +this.enRoute.total).toString();
                            },
                            par: par.toString(),
                            isActive: false,
                            get isUpdated() {
                                return this.onHand.isUpdated;
                            },
                        };
                        return item;
                    });
                return items;
            });
        this._items = items;
        return items;
    },
    clearItems() {
        this._items = [];
    },
    activateItem(id) {
        this.deactivateItem();
        this.items[id].isActive = true;
        return this.activeItem;
    },
    deactivateItem() {
        if (this.activeItem) {
            this.activeItem.isActive = false;
        }
    },
    get activeItem() {
        return this._items.filter(item => item.isActive)[0];
    },

    // Distributors
    _distributors: [
        {
            key: 'cdc',
            description: 'CDC',
            isActive: false
        },
        {
            key: 'rdc',
            description: 'RDC',
            isActive: false
        }
    ],
    get distributors() {
        const distributors = { };
        this._distributors.forEach(distributor => distributors[distributor.key] = distributor);
        return distributors;
    },
    activateDistributor(distributor) {
        this.deactivateDistributor();
        this.distributors[distributor].isActive = true;
        return this.activateDistributor;
    },
    deactivateDistributor() {
        if (this.activeDistributor) {
            this.activeDistributor.isActive = false;
        }
    },
    get activeDistributor() {
        return this._distributors.filter(distributor => distributor.isActive)[0];
    },
    
    // Stages
    _stages: [
        {
            key: 'initial',
            description: 'Select Distributor',
            isActive: true,
            isComputational: false,
        },
        {
            key: 'onHand',
            description: 'On Hand',
            uom: 'eaches',
            isActive: false,
            isComputational: true,
        },
        {
            key: 'enRoute',
            description: 'En Route',
            uom: 'cases',
            isActive: false,
            isComputational: true,
        },
        {
            key: 'order',
            description: 'Order',
            isActive: false,
            isComputational: false,
        },
    ],
    get stages() {
        const stages = { };
        this._stages.forEach(stage => stages[stage.key] = stage);
        return stages;
    },
    get computationalStages() {
        const stages = this._stages.filter(stage => stage.isComputational);
        return stages;
    },
    activateStage(stage) {
        this.deactivateStage();
        this.stages[stage].isActive = true;
    },
    deactivateStage() {
        if (this.activeStage) {
            this.activeStage.isActive = false;
        }
    },
    get activeStage() {
        return this._stages.filter(stage => stage.isActive)[0];
    },

    // UoMs
    _uoms: [
        {
            key: 'eaches',
            description: 'Eaches',
            isActive: false,
        },
        {
            key: 'cases',
            description: 'Cases',
            isActive: false,
        }
    ],
    get uoms() {
        const uoms = {};
        this._uoms.forEach(uom => uoms[uom.key] = uom);
        return uoms;
    },
    activateUom(uom) {
        this.deactivateUom()
        this.uoms[uom].isActive = true;
    },
    deactivateUom() {
        if (this.activeUom) {
            this.activeUom.isActive = false;
        }
    },
    get activeUom() {
        return this._uoms.filter(uom => uom.isActive)[0];
    },

    // App
    selectDistributor(distributor) {
        this.fetchItems(distributor);
        this.activateDistributor(distributor);
        this.activateStage('onHand');
    },
    selectItem(id) {
        this.activateItem(id);
        if (this.activeStage.key === 'onHand') {
            this.activateUom('eaches');
        } else if (this.activeStage.key === 'enRoute') {
            this.activateUom('cases');
        }
    },
    selectUom(uom) {
        if (uom === 'eaches') {
            if (this.currentStage.key === 'onHand') {
                this.activateUom('eaches');
            }
        } else if (uom === 'cases') {
            this.activateUom('cases');
        }
    },
    selectAccumulator(accumulator) {
        const activeItem = this.activeItem;
        const activeStage = this.activeStage.key;
        const activeUom = this.activeUom.key;
        const target = activeItem[activeStage][activeUom];
        let total = target.total;
        let isUpdated = target.isUpdated;
        if (accumulator === 'incrementer') {
            target.total = (+total + 1).toString();
        } else if (accumulator === 'decrementer') {
            if (+total > 0) {
                target.total = (+total - 1).toString();
            }
        }
        target.isUpdated = true;
    },
    selectKey(key) {
        const activeItem = this.activeItem;
        const activeStage = this.activeStage.key;
        const activeUom = this.activeUom.key;
        const target = activeItem[activeStage][activeUom];
        let total = target.total;
        if (key === 'OK') {
            this.deactivateUom()
            this.deactivateItem();
        } else if (key === '<') {
            if (+total < 10) {
                target.total = '0';
            } else {
                target.total = total.slice(0, total.length - 1);
            }
            target.isUpdated = true;
        } else if (key === '0') {
            if (+total > 0) {
                target.total = total + '0';
            }
            target.isUpdated = true;
        } else {
            if (total > 0) {
                target.total = total + key;
            } else {
                target.total = key;
            }
            target.isUpdated = true;
        }
    },
    selectSubmit() {
        const activeStage = this.activeStage.key;
        if (activeStage === 'onHand') {
            this.activateStage('enRoute');
        } else if (activeStage === 'enRoute') {
            this.activateStage('order');
        } else if (activeStage === 'order') {
            this.deactivateDistributor();
            this.clearItems();
            this.activateStage('initial');
        }
        window.scrollTo(0, 0);
    },

});

document.state = state;

export default state;
