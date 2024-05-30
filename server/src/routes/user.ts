import Router from "koa-router";
import {loginControllers} from "@/controllers/user";

export default (router: Router) => {
  router.get('/usr/checkLoginStatus', async (ctx, next) => {
    console.log('ctx',ctx);
    ctx.body = 'success checkLoginStatus';
  });
  router.get('/usr/logOutReq', async (ctx, next) => {});
  router.post('/usr/loginReq', loginControllers);
  router.post('/usr/register', async (ctx, next) => {
    // @ts-ignore
    console.log('ctx',ctx.req);
    ctx.body = 'success checkLoginStatus';
  });
}