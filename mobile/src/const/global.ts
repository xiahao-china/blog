export const LOCAL_CDN_STATIC_SERVER_URL = "https://m.iyangyang.fun/cdnServer";
export const QI_NIU_CDN_STATIC_SERVER_URL = `${location.origin}/cdnQiniu/mobile`;

// export const QI_NIU_CDN_STATIC_SERVER_URL = 'http://wx.iyangyang.fun/mobile';

export const judgeIsProductionEnv = () => {
  return Boolean(["m.iyangyang.fun", "m.hawlkj.cn"].find((item) => window.location.href.includes(item)));
};

export const IS_PRODUCTION_ENV = judgeIsProductionEnv();

export const ONE_YEAR_MS = 31536000000;
