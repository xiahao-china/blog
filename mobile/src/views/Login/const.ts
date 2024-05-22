import request, { IBaseRes } from "@/api/request";

export interface ILoginReq {
  id: string;
  title: string;
  view: number;
  tag: string[];
  desc: string;
}

