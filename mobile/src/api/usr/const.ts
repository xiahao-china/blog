export interface IUserInfo {
  uid: string;
  username: string;
  avatar: string;
  nick: string;
  mail: string;
  lastLoginTime: number;
  followNum: number;
  likesNum: number;
  collectNum: number;
}

export interface ILoginReqParams {
  password: string;
  phone: string;
  email: string;
  phoneVerCode: string;
  emailVerCode: string;
}

export interface IGetVerCode {
  phone: string;
  email: string;
}