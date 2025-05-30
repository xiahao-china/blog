import request, {IBaseRes} from "@/api/request";
import {
  IArticle, IArticleListReqParams, IArticleListRes, IArticleRecommendRes,
  ICreateAndEditArticleReqParams, IDraftArticle,
  IGetArticleDetailReqParams, IGetArticleDetailResItem, INormalArticleReqParams, ISaveDraftArticleReqParams,
  ISearchArticleReqParams,
  ISearchArticleRes
} from "./const";

export const createAndEditArticle = async (params: Partial<ICreateAndEditArticleReqParams>) => {
  const res = await request.post<IBaseRes<{id: string}>>('/api/article/createAndEdit', params);
  return res;
}

export const getArticleDetail = async (params: IGetArticleDetailReqParams) => {
  const res = await request.get<IBaseRes<IGetArticleDetailResItem>>('/api/article/getDetail', params);
  return res;
}

export const searchArticle = async (params: Partial<ISearchArticleReqParams>) => {
  const res = await request.post<IBaseRes<ISearchArticleRes>>('/api/article/search', params);
  return res;
}

export const articleList = async (params: Partial<IArticleListReqParams>) => {
  const res = await request.post<IBaseRes<IArticleListRes>>('/api/article/list', params);
  return res;
}

export const articleRecommend = async () => {
  const res = await request.get<IBaseRes<IArticleRecommendRes>>('/api/article/recommend', {});
  return res;
}
export const deleteArticle = async (params: Partial<INormalArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/delete', params);
  return res;
}

export const likeArticle = async (params: Partial<INormalArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/like', params);
  return res;
}

export const collectArticle = async (params: Partial<INormalArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/collect', params);
  return res;
}

export const saveDraftArticle = async (params: Partial<ISaveDraftArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/draft/save', params);
  return res;
}

export const delDraftArticle = async (articleId?: string) => {
  const res = await request.post<IBaseRes>('/api/article/draft/del', {articleId: articleId || ''});
  return res;
}

export const getDraftArticle = async (articleId?: string) => {
  const res = await request.get<IBaseRes<IDraftArticle>>('/api/article/draft/get', {articleId: articleId || ''});
  return res;
}



