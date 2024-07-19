import {getArticleDetail} from "@/api/article/index";

export interface IArticle {
  id: string;
  title: string;
  content: string;
  cover: string;
  createrUid: string;
  nick: string;
  createrAvatar: string;
  createTime: number;
  lastUpdateTime: number;
  browseNum: number; // 浏览量
  collectNum: number; // 收藏量
  likeNum: number; // 点赞量
  reviewNum: number; // 评论数
  reviewId: number[];
}

export interface ICreateAndEditArticleReqParams {
  id: string;
  title: string;
  content: string;
}

export interface IGetArticleDetailReqParams {
  id: string;
}

export interface IGetArticleDetailResItem extends IArticle{
  hasLike: boolean;
  hasCollect: boolean;
  hasFollow: boolean;
}

export interface ISearchArticleReqParams {
  pageSize: number;
  pageNumber: number;
  uid: string;
  text: string;
}


export interface ISearchArticleRes{
  list: IArticle[];
  total: number;
}

export interface IArticleListReqParams {
  pageSize: number;
  pageNumber: number;
}

export interface IArticleListRes{
  list: IArticle[];
  total: number;
}

export interface INormalArticleReqParams {
  id: string;
}
