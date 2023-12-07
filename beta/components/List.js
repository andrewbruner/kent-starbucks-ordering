import state from '../context/state.js';

const List = {
    data() {
        return {
            state: state
        };
    },
    methods: {
        total(item) {
            const activeStage = state.activeStage.key;
            let total = '- -';
            if (activeStage === 'onHand') {
                if (state.items[item].isUpdated) {
                    total = state.items[item].total;
                }
            } else if (activeStage === 'enRoute') {
                total = state.items[item].total;
            } else if (activeStage === 'order') {
                total = state.items[item].order.total;
            }
            return total;
        },
        onItemClick(event) {
            // prevent item activation if on order stage
            if (state.activeStage.key !== 'order') {
                const id = event.currentTarget.dataset.item;
                state.selectItem(id);
            }
        },
        onSubmitClick() {
            state.selectSubmit();
        }
    },
    template: /*html*/ `
        <ul
            class="list"
        >
            <li
                v-for="item in state._items"
                :data-item="item.id"
                class="item"
                @click="onItemClick"
            >
                <div
                    class="description"
                >
                    {{ item.description }}
                </div>
                <div
                    class="checkmark"
                    :class="{ hidden: !item[state.activeStage.key].isUpdated }"
                >
                    \u2713
                </div>
                <div
                    class="total"
                >
                    {{ total(item.id) }}
                </div>
            </li>
        </ul>
        <!-- v-if/wait to render until item data is fetched -->
        <div
            v-if="state._items.length"
            class="submit"
            @click="onSubmitClick"
        >
            Complete
        </div>
        <div
            v-else
            class="loading"
        >
            Loading...
        </div>`
};

export default List;
