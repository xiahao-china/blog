import { IBaseUserInfo, IUserInfo } from "@/api/usr/const";
import { articleRecommend } from "@/api/article/index";

export interface IArticle {
  id: string;
  title: string;
  content: string;
  cover: string;
  createrUid: string;
  createrAvatar: string;
  createrNick: string;
  createTime: number;
  lastUpdateTime: number;
  browseNum: number; // 浏览量
  collectNum: number; // 收藏量
  likeNum: number; // 点赞量
  reviewNum: number; // 评论数
  reviewId: number[];
  isHTML: boolean;
  tag?: string[]; // 标签
  isPrivate?: boolean;
  collaborateUid?: string[];
}

export interface IDraftArticle {
  creatorUid: string;

  title: string;
  content: string;
  createTime: number;
  lastUpdateTime: number;
  isHTML: boolean;
}

export interface ICreateAndEditArticleReqParams {
  id: string;
  title: string;
  content: string;
  cover?: string;
  isHTML?: boolean;
  isPrivate?: boolean;
  collaborateUid?: string[];
}

export interface IGetArticleDetailReqParams {
  id: string;
}

export interface IGetArticleDetailResItem extends IArticle{
  hasLike: boolean;
  hasCollect: boolean;
  hasFollow: boolean;
  collaborateUserInfo: IBaseUserInfo[];
}

export interface ISearchArticleReqParams {
  pageSize: number;
  pageNumber: number;
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

export interface  IArticleRecommendRes {
  mostViewedArticlesInTotal: IArticle[];
  mostViewedArticlesByMe: IArticle[];
  mostLikedArticlesInTotal: IArticle[];
  latestArticles: IArticle[];
  mostCollectedArticles: IArticle[];
}

export interface INormalArticleReqParams {
  id: string;
}


export interface ISaveDraftArticleReqParams {
  title?: string;
  content?: string;
  articleId?: string;
}