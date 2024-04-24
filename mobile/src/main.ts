import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "amfe-flexible";
// 手动引入函数式调用的toast样式
import 'vant/es/toast/style'

const app = createApp(App);
app.use(store).use(router).mount("#app");

