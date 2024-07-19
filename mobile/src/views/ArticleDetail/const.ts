export enum EArticleActionType {
  edit = 1,
  delete,
}

export interface IArticleActionItem {
  id: EArticleActionType;
  text: string;
  color: string;
}
export const ARTICLE_ACTION_LIST:IArticleActionItem[] = [
  {
    id: EArticleActionType.edit,
    text: "编辑",
    color: '#007fff',
  },
  {
    id: EArticleActionType.delete,
    text: "删除",
    color: 'rgb(237, 105, 136)',
  },
];

export const defaultArticleDetail = {
  id: "",
  title: "",
  cover: "http://m-t.iyangyang.fun/cdnQiniu/mobile/DragonBoatFestival/banner.png",
  content: "",
  createrUid: "",
  createrNick: "",
  createrAvatar: "",
  createTime: new Date().getTime(),
  createTimeStr: "2023-08-22 18:34",
  lastUpdateTime: new Date().getTime(),
  browseNum: 0,
  collectNum: 0,
  likeNum: 0,
  reviewNum: 0,
  reviewId: [],
  hasLike: false,
  hasFollow: false,
  hasCollect: false
};