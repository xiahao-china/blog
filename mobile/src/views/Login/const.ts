import request, { IDefaultRes } from "@/api/request";

export interface ILoginReq {
  id: string;
  title: string;
  view: number;
  tag: string[];
  desc: string;
}

export const loginReq = async (page: number) => {
  return request.post<IBaseRes<ISimpleItem[]>>("/blog/list", { page });
};
