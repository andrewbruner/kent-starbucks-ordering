import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import App from './components/App.js';
import Banner from './components/Banner.js';
import Selection from './components/Selection.js';
import List from './components/List.js';
import Panel from './components/Panel.js';

const app = createApp(App);
app.component('Banner', Banner);
app.component('Selection', Selection);
app.component('List', List);
app.component('Panel', Panel);
app.mount('#app');
