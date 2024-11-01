import { searchUser } from "@/api/usr/index";

export enum ESex {
  unknow = 1,
  male,
  female
}

export interface IBaseUserInfo {
  uid: string;
  avatar: string;
  nick: string;
  sex: ESex;
}

export interface IUserInfo extends IBaseUserInfo{
  username: string;
  mail: string;
  hasChangeNick: boolean;
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

export interface IChangeUsrInfo {
  nick: string;
  originPassword: string;
  password: string;
  avatar: string;
  sex: ESex;
}

export interface ISearchUser {
  phone?: string;
  email?: string;
}

export const SEX_MAP = {
  [ESex.unknow]: '未知',
  [ESex.female]: '女性',
  [ESex.male]: '男性',
}