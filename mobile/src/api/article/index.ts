import request, {IBaseRes} from "@/api/request";
import {
  IArticle, IArticleListReqParams, IArticleListRes,
  ICreateAndEditArticleReqParams, IDeleteArticleReqParams,
  IGetArticleDetailReqParams,
  ISearchArticleReqParams,
  ISearchArticleRes
} from "./const";

export const createAndEditArticle = async (params: Partial<ICreateAndEditArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/createAndEdit', params);
  return res;
}

export const getArticleDetail = async (params: IGetArticleDetailReqParams) => {
  const res = await request.get<IBaseRes<IArticle>>('/api/article/getDetail', params);
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

export const deleteArticle = async (params: Partial<IDeleteArticleReqParams>) => {
  const res = await request.post<IBaseRes>('/api/article/delete', params);
  return res;
}





