import state from '../context/state.js';

const Header = {
    data() {
        return {
            state: state
        };
    },
    template: /*html*/ `
        <div
            class="banner"
            :class="{
                initial: state.stages.initial.isActive,
                'on-hand': state.stages.onHand.isActive,
                'en-route': state.stages.enRoute.isActive,
                order: state.stages.order.isActive,
            }"
        >
            {{ state.activeStage.description }}
        </div>`
};

export default Header;
