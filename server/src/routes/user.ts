import Router from "koa-router";
import {getVerCode, loginControllers} from "@/controllers/user";
import emailVerificationCodeModel from "@/models/emailVerificationCode";

export default (router: Router) => {
  router.get('/usr/checkLoginStatus', async (ctx, next) => {
    await emailVerificationCodeModel.insertMany([{
      email: '471087639@qq.com',
      code: 'aaa',
      sendTime: 123,
      expireTime: 123
    }]);
    ctx.body = 'success checkLoginStatus';
  });
  router.get('/usr/logOutReq', async (ctx, next) => {});
  router.post('/usr/loginReq', loginControllers);
  router.post('/usr/register', async (ctx, next) => {
    // @ts-ignore
    console.log('ctx',ctx.request.body);
    ctx.body = 'success checkLoginStatus';
  });
  router.post('/usr/getVerCode', getVerCode);
}