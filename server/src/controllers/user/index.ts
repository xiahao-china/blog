import md5 from "md5";
import fs from 'fs';
import xss from "xss";
import userModel, { ESex, getDefaultUserInfo, IUserInfo } from "@/models/user";
import emailVerificationCodeModel, { IEmailVerificationCode } from "@/models/emailVerificationCode";

import { logger } from "@/lib/log4js";
import { EReqStatus, sendResponse, TDefaultRouter, TNext } from "@/routes/api/const";
import { signToken } from "@/utils/token";
import { isMail, isPhone } from "@/utils/reg";
import {
  createVerificationCode,
  generateRandomUsername,
  LOGIN_RES_KEY_LIST,
  USER_TOKEN_EXPIRED_INTERVAL_MS,
  VERIFICATION_CODE_ACQUISITION_INTERVAL,
  VERIFICATION_CODE_VALIDITY_TIME
} from "@/controllers/user/const";
import { sendMail, sendPhoneVerificationCode } from "@/utils/verificationCode";
import { APP_NAME, padWithZeros, WHITELIST_HOST } from "@/utils/common";
import phoneVerificationCode, { IPhoneVerificationCodeSchema } from "@/models/phoneVerificationCode";
import { IObject } from "@/utils/const";
import verificationCodeTemplate from "@/static/verificationCodeTemplate";


export interface ILoginControllersReqParams {
  password: string;
  phone: number;
  email: string;
  phoneVerCode: number;
  emailVerCode: number;
}

export interface IChangeUsrControllers {
  nick: IUserInfo["nick"];
  originPassword: IUserInfo["password"];
  password: IUserInfo["password"];
  avatar: IUserInfo["avatar"];
  sex: IUserInfo["sex"];
}

export interface IGetVerCodeReqParams {
  phone: number;
  email: string;
}


export const loginControllers = async (ctx: TDefaultRouter<ILoginControllersReqParams>, next: TNext) => {
  let {
    password,
    phone,
    email,
    phoneVerCode,
    emailVerCode
  } = ctx.request.body || {};

  if (!phone && !email) return sendResponse.error(ctx, "手机号或邮箱不能为空");
  if (!phoneVerCode && !emailVerCode && !password) return sendResponse.error(ctx, "验证码或密码不能为空");

  let userInfo: IUserInfo | undefined;
  let verCodeCheckSuccess = false;

  const accountKey = (["phone", "email"] as (keyof ILoginControllersReqParams)[]).find((item) => ctx.request.body[item]);
  try {
    if (accountKey && ctx.request.body[accountKey]) {
      const filterObj = { [accountKey]: ctx.request.body[accountKey] };
      userInfo = await userModel.findOne(filterObj);
    }
  } catch (error) {
    logger.error("登录失败:" + error);
    return sendResponse.error(ctx, `登录失败:${error}`);
  }
  if (phoneVerCode) {
    const phoneVerCodeInfo: IPhoneVerificationCodeSchema | null = await phoneVerificationCode.findOne({ phone });
    if (!phoneVerCodeInfo || (phoneVerCodeInfo && phoneVerCodeInfo.expireTime < new Date().getTime()))
      return sendResponse.error(ctx, "验证码已过期，请重新获取!");
    if (phoneVerCodeInfo.code !== phoneVerCode) return sendResponse.error(ctx, "验证码错误!");
    verCodeCheckSuccess = true;
  }

  if (emailVerCode) {
    const mailVerCodeInfo: IEmailVerificationCode | null = await emailVerificationCodeModel.findOne({ email });
    if (!mailVerCodeInfo || (mailVerCodeInfo && mailVerCodeInfo.expireTime < new Date().getTime()))
      return sendResponse.error(ctx, "验证码已过期，请重新获取!");
    if (mailVerCodeInfo.code !== emailVerCode) return sendResponse.error(ctx, "验证码错误!");
    verCodeCheckSuccess = true;
  }

  if (userInfo) {
    if (!userInfo.password && !verCodeCheckSuccess) return sendResponse.error(ctx, "账号未设置密码，请通过其他方式登录后进行设置!");
    if (password && userInfo.password !== md5(password)) return sendResponse.error(ctx, "密码错误，请检查后重试!");
    const token = signToken(userInfo);
    ctx.cookies.set("uid", userInfo.uid);
    ctx.cookies.set("token", token);
    try {
      const nowMs = new Date().getTime();
      await userModel.findOneAndUpdate({ uid: userInfo.uid }, {
        token,
        lastLoginTime: nowMs,
        tokenExpiredTime: nowMs + USER_TOKEN_EXPIRED_INTERVAL_MS
      });
    } catch (error) {
      sendResponse.error(ctx, error);
      logger.error("登录失败:" + error);
    }
    return sendResponse.success(ctx);
  }


  if (!userInfo) {
    const userCount = await userModel.collection.count();
    const userInfo: IUserInfo = {
      ...getDefaultUserInfo(),
      uid: padWithZeros(userCount + 1),
      nick: generateRandomUsername(Math.max(4, userCount.toString().length)),
      phone: phone || 0,
      email: email || ""
    };
    const token = signToken(userInfo);
    userInfo.token = token;
    ctx.cookies.set("uid", userInfo.uid);
    ctx.cookies.set("token", token);
    await userModel.insertMany([userInfo]);
    return sendResponse.success(ctx);
  }
};

export const getVerCode = async (ctx: TDefaultRouter<IGetVerCodeReqParams>, next: TNext) => {
  let {
    phone,
    email
  } = ctx.request.body;

  if (!phone && !email) return sendResponse.error(ctx, "手机号或邮箱不能为空");
  const phoneCheckRes = isPhone(phone);
  const emailCheckRes = isMail(email);
  if (phone && !phoneCheckRes.isRight) return sendResponse.error(ctx, phoneCheckRes.msg);
  if (email && !emailCheckRes.isRight) return sendResponse.error(ctx, emailCheckRes.msg);

  const verificationCode = createVerificationCode();

  try {
    if (email) {
      const mailVerCodeInfo: IEmailVerificationCode | null = await emailVerificationCodeModel.findOne({ email });
      if (mailVerCodeInfo && ((mailVerCodeInfo.sendTime + VERIFICATION_CODE_ACQUISITION_INTERVAL) > new Date().getTime()))
        return sendResponse.error(ctx, "验证码获取太频繁啦，请稍后再试~");
      await sendMail({
        senAimEmail: email,
        subject: `${APP_NAME}-邮箱验证码`,
        text: '',
        html: verificationCodeTemplate.toString().replace('<---var-mailVerCode--->', verificationCode)
      });
      await emailVerificationCodeModel.deleteOne({ email });
      const timeMs = new Date().getTime();
      await emailVerificationCodeModel.insertMany([{
        email,
        code: verificationCode,
        sendTime: timeMs,
        expireTime: timeMs + VERIFICATION_CODE_VALIDITY_TIME
      }]);
    }
    if (phone) {
      const phoneVerCodeInfo: IPhoneVerificationCodeSchema | null = await phoneVerificationCode.findOne({ phone });
      if (phoneVerCodeInfo && ((phoneVerCodeInfo.sendTime + VERIFICATION_CODE_ACQUISITION_INTERVAL) > new Date().getTime()))
        return sendResponse.error(ctx, "验证码获取太频繁啦，请稍后再试~");
      await sendPhoneVerificationCode(phone, verificationCode);
      await phoneVerificationCode.deleteOne({ phone });
      const timeMs = new Date().getTime();
      await phoneVerificationCode.insertMany([{
        phone,
        code: verificationCode,
        sendTime: timeMs,
        expireTime: timeMs + VERIFICATION_CODE_VALIDITY_TIME
      }]);
    }
  } catch (err) {
    return sendResponse.error(ctx, `获取验证码失败: ${JSON.stringify(err)}`);
  }
  sendResponse.success(ctx);
};

export const checkLogin = async (ctx: TDefaultRouter<{}>, next: TNext) => {
  const uid = ctx.cookies.get("uid");
  const token = ctx.cookies.get("token");
  if (!uid || !token) return false;
  let userInfo: IUserInfo = await userModel.collection.findOne({ uid });
  if (!userInfo || userInfo.token !== token) return false;
  if (userInfo.tokenExpiredTime < new Date().getTime()) return false;
  return userInfo;
};

export const checkLoginControllers = async (ctx: TDefaultRouter<{}>, next: TNext) => {
  const checkRes = await checkLogin(ctx, next);
  if (!checkRes) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const userInfo: IObject = {};
  LOGIN_RES_KEY_LIST.forEach((item) => userInfo[item] = checkRes[item]);
  userInfo.likesNum = checkRes.likeArticleId?.length;
  userInfo.followNum = checkRes.followUid?.length;
  userInfo.collectNum = checkRes.collectArticleId?.length;
  return sendResponse.success(ctx, userInfo);
};

export const logOutControllers = async (ctx: TDefaultRouter<{}>, next: TNext) => {
  ctx.cookies.set("uid", "");
  ctx.cookies.set("token", "");
  return sendResponse.success(ctx);
};

// nick 限制10字以下
// password 限制大写小写英文数字起码两种 长度6-24字符
// avatar 限制上传的头像
export const changeUsrControllers = async (ctx: TDefaultRouter<IChangeUsrControllers>, next: TNext) => {
  let {
    nick,
    password,
    originPassword,
    avatar,
    sex
  } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  if (password) {
    if (!originPassword) return sendResponse.error(ctx, "参数缺失，请检查原密码！");
    if (md5(originPassword) !== userInfo.password) return sendResponse.error(ctx, "原密码错误，请检查！");
    const testPassword = /^[a-zA-Z\d\,\.\@\$\!\%\*\?\&\#\%\^\-\+\=\<\>\`\'\"]{8,20}$/.test(password);
    let regNum = 0;
    [
      /[a-z]/,
      /[A-Z]/,
      /\d/,
      /[\,\.\@\$\!\%\*\?\&\#\%\^\-\+\=\<\>\`\'\"]/
    ].forEach((item) => {
      if (item.test(password)) ++regNum;
    });
    if (!testPassword || regNum < 2) return sendResponse.error(ctx, "密码需满足6-24位，且包含大写英文，小写英文，数字，特殊符号起码两种组成，请检查！");
  }
  if (nick && xss(nick) !== userInfo.nick) {
    if (userInfo.hasChangeNick) return sendResponse.error(ctx, "您已经修改过昵称！");
    const testNick = nick.length > 0 && nick.length <= 10;
    if (!testNick) return sendResponse.error(ctx, "您的用户昵称长度超出10个字符，请检查！");
  }
  if (sex) {
    if (!Object.keys(ESex).map((item)=>parseInt(item)).filter((item)=>!isNaN(item)).includes(parseInt(sex)))
      return sendResponse.error(ctx, "您的性别填写错误，请检查！");
  }
  if (avatar) {
    try {
      const decodeUrl = decodeURI(avatar);
      const urlcheck = new URL(decodeUrl);
      if (urlcheck.search) return sendResponse.error(ctx, "头像url非法，请检查！");
      let checkRes = false;
      WHITELIST_HOST.forEach((item) => {
        checkRes = checkRes || new RegExp(`^${item}`).test(avatar);
      });
      if (!checkRes) return sendResponse.error(ctx, "头像url非法，请检查！");
    } catch (err) {
      return sendResponse.error(ctx, "头像url错误，请检查！");
    }
  }

  await userModel.updateOne({ uid: userInfo.uid }, {
    $set: {
      nick: xss(nick) || userInfo.nick,
      password: md5(password) || userInfo.password,
      avatar: avatar || userInfo.avatar,
      hasChangeNick: userInfo.hasChangeNick || (Boolean(nick) && xss(nick) !== userInfo.nick),
      sex: sex || userInfo.sex
    }
  });
  return sendResponse.success(ctx);
};
