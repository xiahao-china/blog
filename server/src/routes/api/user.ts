import Router from "koa-router";
import {
  changeUsrControllers,
  checkLoginControllers,
  getVerCode,
  loginControllers,
  logOutControllers, searchUserControllers
} from "@/controllers/user";

export default (router: Router) => {
  router.get('/usr/checkLoginStatus', checkLoginControllers);
  router.get('/usr/logOut', logOutControllers);
  router.get('/usr/search', searchUserControllers);
  router.post('/usr/login', loginControllers);
  router.post('/usr/getVerCode', getVerCode);
  router.post('/usr/changeUsrInfo', changeUsrControllers)
}