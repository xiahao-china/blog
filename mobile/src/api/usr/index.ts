import request, {IBaseRes} from "@/api/request";
import { IChangeUsrInfo, IGetVerCode, ILoginReqParams, IUserInfo } from "@/api/usr/const";

export const loginReq = async (params: Partial<ILoginReqParams>) => {
    const res = await request.post<IBaseRes<IUserInfo>>('/api/usr/login', params);
    return res;
}

export const getVerCode = async (params: Partial<IGetVerCode>) => {
    const res = await request.post<IBaseRes<IUserInfo>>('/api/usr/getVerCode', params);
    return res;
}

export const checkLoginStatusReq = async () => {
    return request.get<IBaseRes<IUserInfo>>("/api/usr/checkLoginStatus", {});
}

export const logOutReq = async () => {
    return request.get<IBaseRes<IUserInfo>>("/api/usr/logOut", {});
}

export const changeUsrInfo = async (params: Partial<IChangeUsrInfo>) => {
    const res = await request.post<IBaseRes>('/api/usr/changeUsrInfo', params);
    return res;
}