export interface ILoginInputInfo {
  account: string;
  password: string;
  isMail: boolean;
}

export const checkMail = (str: string) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str);
};

export const BLOG_PRE_LOGIN_ACCOUNT = "BLOG_PRE_LOGIN_ACCOUNT";
export const getPreLoginAccount = () => {
  return localStorage.getItem(BLOG_PRE_LOGIN_ACCOUNT);
};

export const setPreLoginAccount = (account: string) => {
  localStorage.setItem(BLOG_PRE_LOGIN_ACCOUNT, account);
};

export const DEFAULT_LOGIN_INPUT_INFO: ILoginInputInfo = {
  account: getPreLoginAccount() || "",
  password: "",
  isMail: checkMail(getPreLoginAccount() || ""),
};
