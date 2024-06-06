import xss from "xss";
import articleModel, {getDefaultArticle, IArticle} from '@/models/article';

import {IPageReqBase, sendResponse, TDefaultRouter, TNext} from "@/routes/const";
import {checkLogin} from "@/controllers/user";


export interface ICreateArticleControllersReqParams {
  id: string;
  title: string;
  content: string;
}

export interface ISearchArticleControllersReqParams extends IPageReqBase {
  uid: string;
  text: string;
}

export const createAndEditArticleControllers = async (ctx: TDefaultRouter<ICreateArticleControllersReqParams>, next: TNext) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, '您的登录态已过期');
  const {
    id,
    title,
    content,
  } = ctx.request.body || {};
  if (!title && !content) return sendResponse.error(ctx, '文章标题或内容不能为空!');
  try{
    const nowArticle: IArticle = id ? await articleModel.collection.findOne({id}) : undefined;
    if (nowArticle){
      await articleModel.collection.findOneAndUpdate({id},{
        title: title || nowArticle.title,
        content: content || nowArticle.content,
      })
      return sendResponse.success(ctx);
    }

    const articleNum = await articleModel.collection.count();

    await articleModel.collection.insertMany([{
      ...getDefaultArticle(),
      id: `${new Date().getTime()}${articleNum + 1}`,
      createrUid: userInfo.uid,
      title: xss(title),
      content: xss(content),
    }]);

    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}

export const getArticleDetailControllers = async (ctx: TDefaultRouter<{ id: string }>, next: TNext) => {
  const {id} = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, '传参缺失，请检查id!');
  const article = await articleModel.collection.findOne({id});
  if (!article) return sendResponse.error(ctx, '文章不存在!');
  sendResponse.success(ctx, article);
}

export const searchArticleControllers = async (ctx: TDefaultRouter<ISearchArticleControllersReqParams>, next: TNext) => {
  const {pageSize, pageNumber, uid, text} = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, '传参缺失，请检查pageSize与pageNumber!');
  try {
    if (uid) {
      const total = await articleModel.collection.find({createrUid: uid}).count();
      const articleList = await articleModel.collection.find({createrUid: uid})
        .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
        .limit(pageSize) // 限制每页的记录数
        .toArray();
      return sendResponse.success(ctx, {
        list: articleList,
        total,
      });
    }
    const total = await articleModel.collection.find({content: {$regex: text || '', $options: 'i'}}).count();
    const articleList = await articleModel.collection.find({content: {$regex: text || '', $options: 'i'}})
      .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
      .limit(pageSize) // 限制每页的记录数
      .toArray();
    return sendResponse.success(ctx, {
      list: articleList,
      total,
    });
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}

export const articleListControllers = async (ctx: TDefaultRouter<IPageReqBase>, next: TNext) => {
  const {pageSize, pageNumber} = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, '传参缺失，请检查pageSize与pageNumber!');
  try {
    const total = await articleModel.collection.count();
    const articleList = await articleModel.collection.find({})
      .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
      .limit(pageSize) // 限制每页的记录数
      .toArray();
    return sendResponse.success(ctx, {
      list: articleList,
      total,
    });
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}

export const deleteArticleControllers = async (ctx: TDefaultRouter<{id: string}>, next: TNext) => {
  const {id} = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, '传参缺失，请检查id!');
  try {
    const article = await articleModel.collection.findOne({id});
    if (!article) return sendResponse.error(ctx, '文章不存在');
    await articleModel.collection.deleteOne({id});
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}
