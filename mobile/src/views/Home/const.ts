import request, { IBaseRes } from "@/api/request";

export interface ISimpleItem {
  id: string;
  title: string;
  view: number;
  tag: string[];
  desc: string;
}

export const getBlogListInfo = async (page: number) => {
  return request.post<IBaseRes<ISimpleItem[]>>("/blog/list", { page });
};
