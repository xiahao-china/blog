import Application from "koa";
import Router from "koa-router";
import {IObject} from "@/utils/const";

export type TDefaultRouter<T = any> = Application.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any> & {
  request: {
    body?: T,
    query?: T,
  }
}
export type TNext = Application.Next;

export interface IPageReqBase {
  pageSize: number;
  pageNumber: number;
}

export enum EReqStatus {
  success = 200,
  generalError = 500,
  noLogin = 501,
}

export const REQ_STATUS_MAP: { [key in EReqStatus]: string } = {
  [EReqStatus.success]: '成功',
  [EReqStatus.generalError]: '服务出现错误',
  [EReqStatus.noLogin]: '您还未登录'
}

export const sendResponse = {
  success: (ctx: TDefaultRouter, data?: IObject) => {
    ctx.body = {
      code: EReqStatus.success,
      message: REQ_STATUS_MAP[EReqStatus.success],
      data,
    }
  },
  error: (ctx: TDefaultRouter, msg?: any, code?: EReqStatus, data?: IObject) => {
    ctx.body = {
      code: code || EReqStatus.generalError,
      message: msg || REQ_STATUS_MAP[code ? code : EReqStatus.generalError],
      data: data,
    }
  }
}