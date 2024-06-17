import request, { IBaseRes } from "@/api/request";
import {getVerCode} from "@/api/usr/index";

export interface IUserInfo {
  uid: string;
  username: string;
  avatar: string;
  name: string;
  mail: string;
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