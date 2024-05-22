import request, {IBaseRes} from "@/api/request";
import {ILoginReqParams, IUserInfo} from "@/api/usr/const";

export const loginReq = async (params: ILoginReqParams) => {
    const res = await request.post<IBaseRes<IUserInfo>>('/api/usr/login', params);
    return res;
}

export const checkLoginStatusReq = async () => {
    return request.post<IBaseRes<IUserInfo>>("/api/usr/checkLoginStatus", {});
}

export const logOutReq = async () => {
    return request.post<IBaseRes<IUserInfo>>("/api/usr/logOut", {});

}