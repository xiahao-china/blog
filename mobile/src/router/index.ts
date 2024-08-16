import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { IObject } from "@/util";

export const routes: Array<RouteRecordRaw & IObject> = [
  {
    path: "/",
    redirect: "/HomePage",
  },
  {
    path: "/HomePage",
    name: "HomePage",
    needNavBar: true,
    meta: {
      pageName: "首页",
    },
    component: () =>
      import(/* webpackChunkName: "HomePage" */ "src/views/HomePage/index.vue"),
  },
  {
    path: "/Login",
    name: "Login",
    meta: {
      pageName: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "Login" */ "src/views/Login/index.vue"),
  },
  {
    path: "/ArticleDetail",
    name: "ArticleDetail",
    needNavBar: true,
    meta: {
      pageName: "文章详情",
    },
    component: () =>
      import(
        /* webpackChunkName: "ArticleDetail" */ "src/views/ArticleDetail/index.vue"
      ),
  },
  {
    path: "/CreateAndEditArticleByPc",
    name: "CreateAndEditArticleByPc",
    meta: {
      pageName: "写文章",
    },
    component: () =>
      import(
        /* webpackChunkName: "CreateAndEditArticleByPc" */ "src/views/CreateAndEditArticleByPc/index.vue"
      ),
  },
  {
    path: "/Gadget",
    name: "Gadget",
    needNavBar: true,
    meta: {
      pageName: "小工具",
    },
    component: () =>
      import(/* webpackChunkName: "Gadget" */ "src/views/Gadget/index.vue"),
  },
  {
    path: "/ChangeUserInfo",
    name: "ChangeUserInfo",
    needNavBar: true,
    meta: {
      pageName: "修改个人信息",
    },
    component: () =>
      import(/* webpackChunkName: "ChangeUserInfo" */ "src/views/ChangeUserInfo/index.vue"),
  },
  {
    path: "/CreateAndEditArticle",
    name: "CreateAndEditArticle",
    meta: {
      pageName: "写文章",
    },
    component: () =>
      import(/* webpackChunkName: "CreateAndEditArticle" */ "src/views/CreateAndEditArticle/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/HomePage",
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${(to.meta as IObject)?.pageName?.toString() || ""}-即刻`;
  next();
});
export default router;
