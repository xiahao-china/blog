import { createApp } from "vue";
import "amfe-flexible";
import 'vant/es/toast/style'; // 手动引入函数式调用的toast样式
import 'vant/es/dialog/style'; // 手动引入函数式调用的toast样式
import '@vant/touch-emulator';

import App from "./App.vue";
import router from "./router";
import store from "./store";


const app = createApp(App);

app.use(store).use(router).mount("#app");


