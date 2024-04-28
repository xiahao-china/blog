import request, { IBaseRes } from "@/api/request";
import { EUserRole } from "@/const/type";

export interface IGetUserInfoReqRes {
  uid: string;
  username: string;
  userRole: EUserRole;
}

export const getUserInfoReq = async () => {
  return request.get<IBaseRes<IGetUserInfoReqRes>>("/user/getUserInfo", {});
};
