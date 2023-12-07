import state from '../context/state.js';

const Panel = {
    data() {
        return {
            state: state,
            keys: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '<', '0', 'OK']
        };
    },
    methods: {
        onTabClick(event) {
            // prevent activation of eaches tab during enRoute or order stages
            const uom = state.activeStage.key === 'onHand'
                ? event.currentTarget.dataset.uom
                : 'cases';
            state.activateUom(uom);
        },
        onAccumulatorClick(event) {
            const accumulator = event.currentTarget.dataset.accumulator
            state.selectAccumulator(accumulator);
        },
        onKeyClick(event) {
            const key = event.currentTarget.textContent;
            state.selectKey(key);
        }
    },
    template: /*html*/ `
        <div
            class="panel"
            :class="{ hidden: !state.activeItem }"
        >
            <div class="display"> 
                <div class="row"> 
                    <div class="description">
                        {{ state.activeItem?.description }}
                    </div>
                    <div class="total">
                        {{
                            state.activeItem?.onHand.isUpdated || (state.activeItem && state.activeStage.key === 'enRoute')
                                ? state.activeItem.total
                                : '- -'
                        }}
                    </div>
                </div>
                <div class="row">
                    <template v-for="(stage, index) in state.computationalStages">
                        {{
                            stage.description
                        }} {{
                            state.activeItem?.[stage.key].isUpdated || (state.activeItem && state.activeStage.key === 'enRoute')
                                ? state.activeItem[stage.key].total
                                : '- -'
                        }}
                        <template v-if="index < state.computationalStages.length - 1">
                            {{ ' / ' }}
                        </template>
                    </template>
                </div>
                <div class="row">
                    {{ state.activeItem?.uom || '- -'}}/cs / Par {{ state.activeItem?.par || '- -' }}
                </div>
            </div>
            <div v-if="state.activeStage.key !== 'order'" class="controls">
                <div class="tabs">
                    <div v-for="uom in state.uoms" class="tab" :class="{ active: state.activeUom?.key === uom.key }" :data-uom="uom.key" @click="onTabClick">
                        <div class="description">
                            {{ uom.description}}
                        </div>
                        <div class="total">
                            {{ state.activeItem?.[state.activeStage.key][uom.key]?.isUpdated ? state.activeItem[state.activeStage.key][uom.key].total : '- -' }}
                        </div>
                    </div>
                </div>
                <div class="accumulator">
                    <div class="decrementer" data-accumulator="decrementer" @click="onAccumulatorClick">
                        \u2212
                    </div>
                    <div class="total">
                        {{
                            state.activeItem?.[state.activeStage.key][state.activeUom.key].isUpdated
                                ? state.activeItem[state.activeStage.key][state.activeUom.key].total
                                : '- -'
                        }}
                    </div>
                    <div class="incrementer" data-accumulator="incrementer" @click="onAccumulatorClick">
                        \u002b
                    </div>
                </div>
                <div class="keypad">
                    <div v-for="key in keys" class="key" @click="onKeyClick">
                        {{ key }}
                    </div>
                </div>
            </div>
            <div v-else>
                Par calculation visualization coming soon... 
            </div>
        </div>`
};

export default Panel;
