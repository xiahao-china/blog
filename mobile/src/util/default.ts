import { checkIsMobile } from "@/util/reg";

export interface IObject {
  [key: string]: any;
}

export const createArrayByLen = (len: number, defaultContent: any = null) => {
  let nowLen = 0;
  const arr = [];
  while (nowLen < len) {
    arr.push(defaultContent);
    nowLen++;
  }
  return arr;
};

export const getUrlParams = (url?: string) => {
  const cloneUrl = url ? url : location.href;
  if (!cloneUrl.includes("?")) {
    return {};
  }
  const urlStr = cloneUrl.split("?")[1];
  const obj: IObject = {};
  const paramsArr = urlStr.split("&");
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    const arr = paramsArr[i].split("=");
    obj[arr[0]] = arr[1];
  }
  return obj;
};

export const getCookie = (name: string) => {
  let arr: string[] | null = [];
  const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  // eslint-disable-next-line no-cond-assign
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
};

export const scrollToTop = () => {
  // 距离顶部的距离
  const drag = 10;
  const gap = document.documentElement.scrollTop;
  if (gap > 0) {
    document.documentElement.scrollTop = gap - gap / drag;
    window.requestAnimationFrame(scrollToTop);
  }
};

export const offsetOnKeyBoard = (needOffset: boolean) => {
  setTimeout(() => {
    const documents = window.document.documentElement;
    if (!documents) return;
    documents.style.transition = "all 0.3s ease";
    documents.style.transform = needOffset ? "translateY(-40vh)" : "none";
  });
};

// 对比点分隔格式版本号前者是否大于等于后者
export const contrastPointSeparatedVersions = (v1: string, v2: string) => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return true;
    else if (num1 < num2) return false;
  }
  return true;
};

export const getMethodUrlLink = (params: IObject, needEncodeURI?: boolean) => {
  const turnData = Object.keys(params).map((item) => {
    const needTurn = ["object"].includes(typeof params[item]);
    return `${item}=${
      needTurn
        ? JSON.stringify(params[item])
        : needEncodeURI
        ? encodeURIComponent(params[item])
        : params[item]
    }`;
  });
  if (!turnData.length) return "";
  return `?${turnData.join("&")}`;
};

// 校验pc端进行部分页面的ui转换，使其可用
export const checkPcUiTransform = (
  callback: (needTransform: boolean) => void
) => {
  const htmlEl = document.getElementsByTagName("html")[0];
  if (!htmlEl) callback(false);
  if (!checkIsMobile()) {
    htmlEl.setAttribute("style", "font-size: 37.5px");
    callback(true);
  } else {
    callback(false);
  }
};
