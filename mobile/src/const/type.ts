export interface IDefaultRes<T = any>{
  code?: number | string;
  success?: string | boolean;
  msg?: string;
  message?: string;
  data?: T;
}
