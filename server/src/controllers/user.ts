import md5 from 'md5';
import userModel, {IUserInfo} from '@/models/user';
import {logger} from "@/lib/log4js";
import {sendResponse, TDefaultRouter, TNext} from "@/routes/const";
import {signToken} from "@/utils/token";

export interface ILoginControllersReqParams {
  userName: string;
  password: string;
  phone: number;
  email: string;
  phoneVerCode: number;
  emailVerCode: number;
}

const loginResKeyList: (keyof IUserInfo)[] = ['userName', 'uid', 'phone', 'avatar', 'email', 'lastLoginTime'];

export const loginControllers = async (ctx: TDefaultRouter<ILoginControllersReqParams>, next: TNext) => {
  let {
    userName,
    password,
    phone,
    email,
    phoneVerCode,
    emailVerCode,
  } = ctx.body;

  if (!userName && !phone && !email) return sendResponse.error(ctx, '用户名，手机号或邮箱不能为空');
  if (!phoneVerCode && !emailVerCode && !password) return sendResponse.error(ctx, '验证码或密码不能为空');

  let userInfo: IUserInfo | undefined;
  const accountKey = (['userName', 'phone', 'email'] as (keyof ILoginControllersReqParams)[]).find((item) => ctx.body[item]);
  try {
    if (accountKey && ctx.body[accountKey]) {
      userInfo = await userModel.findOne({
        [accountKey]: ctx.body[accountKey],
      })
    }
  } catch (error) {
    sendResponse.error(ctx, error);
    logger.error("登录失败:" + error);
  }
  if (userInfo) {
    if (phoneVerCode) {
      if (userInfo.phoneVerCode !== phoneVerCode) return sendResponse.error(ctx, '验证码错误!');
      if (userInfo.phoneVerCodeExpireTime < new Date().getTime()) return sendResponse.error(ctx, '验证码已过期，请重新获取!');
    }
    if (emailVerCode) {
      if (userInfo.emailVerCode !== emailVerCode) return sendResponse.error(ctx, '验证码错误!');
      if (userInfo.emailVerCodeExpireTime < new Date().getTime()) return sendResponse.error(ctx, '验证码已过期，请重新获取!');
    }
    if (password) {
      if (userInfo.password !== md5(password)) return sendResponse.error(ctx, '密码错误，请检查后重试!');
    }

    const token = signToken(userInfo);
    ctx.header.token = token;
    try {
      await userModel.findOneAndUpdate({uid: userInfo.uid}, {token, lastLoginTime: new Date().getTime()})
    } catch (error) {
      sendResponse.error(ctx, error);
      logger.error("登录失败:" + error);
    }
    sendResponse.success(ctx);
  }

  //
  // if (!userInfo) {
  //   if (userName)
  // }

  // 查询数据库用户名是否存在，通过md5对用户密码进行md5()加密和和数据库进行查询
  // try {
  //   // 后面是要查询的字段
  //   let loginUser = await userModel.findOne({
  //     userName,
  //     userPwd: md5(password)
  //   }, 'userId userName userEmail job mobile deptId state role roleList')
  //   console.log(loginUser._doc, "loginUser");
  //   if (loginUser) {
  //     //报错： TypeError: Converting circular structure to JSON，starting at object with constructor 'MongoClient'
  //     // 解决： mongoose不能直接返回loginUser，需要返回res._doc
  //     // 设置token： 使用用户名和密码设置token
  //     const data = loginUser._doc;
  //     let token = signToken({userName, userPwd});
  //
  //     data.token = "Bearer " + token
  //     sendResponse.success(ctx);
  //     logger.info(userName + "登录成功");
  //   }
  //
  // } catch (error) {
  //   sendResponse.error(ctx, error);
  //   logger.error(userName + "尝试登录失败:" + error);
  // }
}

