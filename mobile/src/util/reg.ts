export const isPhone = (str: string) => /^1[3456789]\d{9}$/.test(str);

export const isMobile = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(navigator.userAgent.toLowerCase());

//Android终端
export const isAndroid = navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Adr") > -1;
//iOS终端
export const isIOS = Boolean(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));

export const isWeChat = navigator.userAgent.indexOf('MicroMessenger') > -1;

export const weChatVersion = ((window.navigator.userAgent.match(/MicroMessenger\/(\d+\.\d+\.\d+\.\d+)/)?.[0]) || '').replace('MicroMessenger/','');

export const checkMail = (str: string) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(str);
};

export const checkPhone = (str: string) => {
  return /^1[3-9]\d{9}$/.test(str);
};