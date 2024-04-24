import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { IObject } from "@/util";

const routes: Array<RouteRecordRaw & IObject> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/Home",
    name: "Home",
    meta: {
      pageName: "首页",
    },
    component: () =>
      import(/* webpackChunkName: "Home" */ "src/views/Home/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = (to.meta as IObject)?.pageName.toString() || "";
  next();
});
export default router;
