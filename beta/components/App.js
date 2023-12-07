import state from '../context/state.js';

const App = {
    data() {
        return {
            state: state
        };
    },
    template: /*html*/ `
        <Banner />
        <Selection v-if="state.stages.initial.isActive" />
        <List v-else />
        <Panel />`
};

export default App;
