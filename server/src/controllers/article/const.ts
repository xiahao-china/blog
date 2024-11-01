import { IArticle } from "@/models/article";

export const createVerificationCode = (len = 4) => {
  let code = (Math.random() * Math.pow(10, len + 1)).toFixed(0).slice(0, len);
  const codeLen = code.length;
  for (let i = 0; i < (len - codeLen); i++) {
    code = code + (Math.random() * 10).toFixed(0).slice(-1);
  }
  return code;
};

// 验证码获取间隔
export const VERIFICATION_CODE_ACQUISITION_INTERVAL = 1 * 60 * 1000;

// 验证码过期时长
export const VERIFICATION_CODE_VALIDITY_TIME = 10 * 60 * 1000;

export const getArticleListControllersFilterObj = (uid: string)=>{
  return uid ? {
    $or: [
      {
        isPrivate: { $nin: [true] },
      },
      {
        $and: [
          {
            isPrivate: { $in: [true] },
          },
          {
            createrUid: { $in: [uid] },
          }
        ]
      }
    ],
  } : {
    isPrivate: { $nin: [true] },
  };
}

export const ARTICLE_RES_KEY_LIST: (keyof IArticle)[] = [
  "id",
  "title",
  "cover",
  "content",
  "createrUid",
  "createTime",
  "lastUpdateTime",
  "browseNum",
  "collectNum",
  "likeNum",
  "reviewId",
  "isHTML",
  "isPrivate",
  'collaborateUid'
];
