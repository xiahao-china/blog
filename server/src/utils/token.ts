import {sign, verify} from 'jsonwebtoken';
import {TDefaultRouter} from "@/routes/api/const";
import {IUserInfo} from "@/models/user";

export const SECRET_KEY = "xia-hao-blog";

// 获取token
export const getToken = (ctx: TDefaultRouter) => {
  return ctx.request.headers.Authorization || '';
}

// 加密token
export const signToken = (userInfo: IUserInfo) => {
  const tokenPayload = {uid: userInfo.uid, password: userInfo.password};
  // 定义 secret 密钥
  const token = sign(tokenPayload, SECRET_KEY, {expiresIn: '30d'});
  return token;
};

// 验证token
export const verifyToken = (token: string) => {
  return verify(token, SECRET_KEY);
}

