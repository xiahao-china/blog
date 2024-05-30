import Router from "koa-router";
import userRouter from "./user";

export default (router: Router) => {
  // 注入用户层级相关路由
  userRouter(router);
}