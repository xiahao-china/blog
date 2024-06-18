export interface IArticle {
  id: string;
  title: string;
  content: string;
  cover: string;
  createrUid: string;
  createrNick: string;
  createTime: number;
  lastUpdateTime: number;
  browseNum: number; // 浏览量
  collectNum: number; // 收藏量
  likeNum: number; // 点赞量
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

export interface IDeleteArticleReqParams {
  id: string;
}
