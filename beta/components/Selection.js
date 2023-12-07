import state from '../context/state.js';

const Selection = {
    data() {
        return {
            state: state
        };
    },
    methods: {
        onSelectorClick(event) {
            const distributor = event.currentTarget.dataset.distributor;
            state.selectDistributor(distributor);
        }
    },
    template: /*html*/ `
        <ul class="selection">
            <li
                v-for="distributor in state._distributors"
                :data-distributor="distributor.key"
                class="selector"
                @click="onSelectorClick"
            >
                {{ distributor.description }}
            </li>
        </ul>`
};

export default Selection;
