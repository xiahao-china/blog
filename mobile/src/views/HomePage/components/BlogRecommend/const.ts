import { IArticle, IArticleRecommendRes } from "@/api/article/const";
import { formatNumToWan } from "@/util/format";
import dayjs from "dayjs";
import { extractCoverKeyInfo } from "@/views/HomePage/components/BlogItem/const";

export enum ERecommendType {
  totalBrowse = 1, // 总浏览最多
  myBrowse = 2, // 我看的最多
  totalLike = 3, // 总点赞最多
  lastCreate = 4, // 最新
  totalCollection = 5, // 收藏最多
}

export interface IHandleArticle {
  browseNum: string;
  collectNum: string;
  likeNum: string;
  createTimeStr: string;
  recommendType: ERecommendType;
  nick: string;
  bgColor: string;
  recommendTypeIcon: string;
}

export const RECOMMEND_TYPE_ICON_MAP = {
  [ERecommendType.totalBrowse]: "icon-hot-for-ux-fill",
  [ERecommendType.myBrowse]: "icon-hot-for-ux-fill",
  [ERecommendType.totalLike]: "icon-message_like",
  [ERecommendType.lastCreate]: "icon-new",
  [ERecommendType.totalCollection]: "icon-shoucang",
};


export const SCROLL_LOGO = [
  { value: "icon-JavaScript", color: "#FFD700", bgColor: "#8A2BE2" },
  { value: "icon-weiruan", color: "#8A2BE2", bgColor: "#DA70D6" },
  { value: "icon-weixin", color: "#DA70D6", bgColor: "#FF69B4" },
  { value: "icon-ios", color: "#FF69B4", bgColor: "#4682B4" },
  { value: "icon-LOGO", color: "#4682B4", bgColor: "#FFD700" },
  { value: "icon-flash", color: "#FFD700", bgColor: "#8A2BE2" },
  { value: "icon-bluetooth", color: "#8A2BE2", bgColor: "#DA70D6" },
  { value: "icon-logo", color: "#DA70D6", bgColor: "#FF69B4" },
  { value: "icon-JavaScript", color: "#FF69B4", bgColor: "#4682B4" },
  { value: "icon-WIFI", color: "#4682B4", bgColor: "#FFD700" },
  { value: "icon-Vue", color: "#FFD700", bgColor: "#8A2BE2" },
  { value: "icon-Nodejs", color: "#8A2BE2", bgColor: "#DA70D6" },
  { value: "icon-iot", color: "#DA70D6", bgColor: "#FF69B4" },
  { value: "icon-bitebi", color: "#FF69B4", bgColor: "#4682B4" },
  { value: "icon-bug", color: "#4682B4", bgColor: "#FFD700" },
  { value: "icon-alipay-fill", color: "#FFD700", bgColor: "#8A2BE2" },
  { value: "icon-logo1", color: "#8A2BE2", bgColor: "#DA70D6" },
  { value: "icon-react", color: "#DA70D6", bgColor: "#FF69B4" },
  { value: "icon-Clion-01-01", color: "#FF69B4", bgColor: "#4682B4" },
  { value: "icon-qq", color: "#4682B4", bgColor: "#FFD700" },
  { value: "icon-github-line", color: "#FFD700", bgColor: "#8A2BE2" },
  { value: "icon-c", color: "#8A2BE2", bgColor: "#DA70D6" },
];

export const handleRecommendArticle = (
  data: IArticleRecommendRes
): (IHandleArticle & IArticle)[] => {
  const commonArticleHandle = (
    item: IArticle,
    recommendType: ERecommendType
  ) => {
    if (!item) return null;
    return {
      ...item,
      browseNum: formatNumToWan(item.browseNum),
      collectNum: formatNumToWan(item.collectNum),
      likeNum: formatNumToWan(item.likeNum),
      createTimeStr: dayjs(item.createTime).format("YYYY-MM-DD HH:mm"),
      tag: item.tag || [],
      recommendType,
      bgColor: extractCoverKeyInfo(item.title).linearGradient,
      recommendTypeIcon: RECOMMEND_TYPE_ICON_MAP[recommendType],
    } as IHandleArticle & IArticle;
  };

  const resList = [
    commonArticleHandle(
      data.mostViewedArticlesInTotal[0],
      ERecommendType.totalBrowse
    ),
    commonArticleHandle(
      data.mostViewedArticlesByMe[0],
      ERecommendType.myBrowse
    ),
    commonArticleHandle(
      data.mostLikedArticlesInTotal[0],
      ERecommendType.totalLike
    ),
    commonArticleHandle(data.latestArticles[0], ERecommendType.lastCreate),
    commonArticleHandle(
      data.mostCollectedArticles[0],
      ERecommendType.totalCollection
    ),
  ].filter((item) => !!item);

  // 列表去重
  const resMap = new Map();
  const res = [];
  for (const item of resList) {
    if (!resMap.has(item.id)) {
      resMap.set(item.id, true);
      res.push(item);
    }
  }

  return res;
};
