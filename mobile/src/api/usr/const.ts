import request, { IBaseRes } from "@/api/request";

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
  username?: string;
  mail?: string;
  password: string;
}
