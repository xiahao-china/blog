import {checkMail, checkPhone} from "@/util";
import {cloneDeep} from "lodash";

export enum ELoginMethod {
  password = "password",
  verificationCode = 'verificationCode'
}

export enum ELoginAccountType {
  null,
  account,
  phone,
  mail,
}

export interface ILoginInputInfo {
  method: ELoginMethod;
  accountType: ELoginAccountType;
  account?: string;
  phone?: string;
  mail?: string;
  password?: string;
  verificationCode?: string;
}

export const BLOG_PRE_LOGIN_ACCOUNT = "BLOG_PRE_LOGIN_ACCOUNT";

// 获取之前登录的信息
export const getPreLoginAccount = (): Partial<ILoginInputInfo> => {
  const jsonInfo = localStorage.getItem(BLOG_PRE_LOGIN_ACCOUNT) || '';
  let handleInfo: Partial<ILoginInputInfo> = {};
  try {
    handleInfo = JSON.parse(jsonInfo || '{}');
  } catch (err) {
    console.log(err);
  }
  if (!handleInfo || typeof handleInfo !== 'object') handleInfo = {};
  return handleInfo;
};

export const setPreLoginAccount = (loginInfo: ILoginInputInfo) => {
  const cloneInfo = cloneDeep(loginInfo);
  delete cloneInfo.password;
  delete cloneInfo.verificationCode;
  localStorage.setItem(BLOG_PRE_LOGIN_ACCOUNT, JSON.stringify(loginInfo));
};

export const getDefaultLoginInputInfo = (): ILoginInputInfo => {
  const preLoginInfo = getPreLoginAccount();
  if (!Object.keys(preLoginInfo).length) {
    return {
      method: ELoginMethod.verificationCode,
      accountType: ELoginAccountType.null,
    }
  }
  return preLoginInfo as ILoginInputInfo;
};

export const checkInput = (str: string): Partial<ILoginInputInfo> => {
  if (!str) return {accountType: ELoginAccountType.null}
  if (checkMail(str)) return {mail: str, accountType: ELoginAccountType.mail};
  if (checkPhone(str)) return {phone: str, accountType: ELoginAccountType.phone};
  return {account: str, accountType: ELoginAccountType.account}
}

export const withdrawAccount = (loginInputInfo: ILoginInputInfo)=>{
  return loginInputInfo.account || loginInputInfo.mail || loginInputInfo.phone || ""
}