import xss from "xss";
import articleModel, { getDefaultArticle, IArticle } from "@/models/article";

import { EReqStatus, IPageReqBase, sendResponse, TDefaultRouter, TNext } from "@/routes/api/const";
import { checkLogin } from "@/controllers/user";
import userModel, { IUserInfo } from "@/models/user";
import { filterObjItemByKey, uniqueArray } from "@/utils/common";
import { ARTICLE_RES_KEY_LIST } from "@/controllers/article/const";


export interface ICreateArticleControllersReqParams {
  id: string;
  title: string;
  content: string;
  isHTML?: boolean;
}

export interface ISearchArticleControllersReqParams extends IPageReqBase {
  uid: string;
  text: string;
}

export const createAndEditArticleControllers = async (ctx: TDefaultRouter<ICreateArticleControllersReqParams>, next: TNext) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const {
    id,
    title,
    content,
    isHTML
  } = ctx.request.body || {};
  if (!title && !content) return sendResponse.error(ctx, "文章标题或内容不能为空!");
  try {
    const nowArticle: IArticle = id ? await articleModel.collection.findOne({ id }) : undefined;
    if (nowArticle) {
      if (nowArticle.createrUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足");
      await articleModel.collection.updateOne({ id }, {
        $set: {
          title: xss(title),
          content: xss(content),
          isHTML: isHTML || false,
        }
      });
      return sendResponse.success(ctx, { id: nowArticle.id });
    }

    const articleNum = await articleModel.collection.count();
    const newArticle: IArticle = {
      ...getDefaultArticle(),
      id: `${new Date().getTime()}${articleNum + 1}`,
      createrUid: userInfo.uid,
      title: xss(title),
      content: xss(content),
      isHTML: isHTML || false,
    };

    await articleModel.collection.insertMany([newArticle]);

    return sendResponse.success(ctx, { id: newArticle.id });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getArticleDetailControllers = async (ctx: TDefaultRouter<{ id: string }>, next: TNext) => {
  const { id } = ctx.request.query || {};
  if (!id) return sendResponse.error(ctx, "传参缺失，请检查id!");
  const article: IArticle = await articleModel.collection.findOne({ id });
  if (!article) return sendResponse.error(ctx, "文章不存在!");
  const createrUserInfo: IUserInfo = await userModel.collection.findOne({ uid: article.createrUid });
  try {
    articleModel.collection.updateOne({ id }, { $set: { browseNum: article.browseNum + 1 } }, {});
  } catch (err) {
    console.log(err);
  }
  const userInfo = await checkLogin(ctx, next);
  sendResponse.success(ctx, {
    ...filterObjItemByKey(article, ARTICLE_RES_KEY_LIST),
    createrNick: createrUserInfo ? createrUserInfo.nick : "已注销用户",
    createrAvatar: createrUserInfo?.avatar || "",
    hasLike: (userInfo ? userInfo.likeArticleId : []).includes(id),
    hasCollect: (userInfo ? userInfo.collectArticleId : []).includes(id),
    hasFollow: (userInfo ? userInfo.followUid : []).includes(createrUserInfo.uid)
  });

};

export const searchArticleControllers = async (ctx: TDefaultRouter<ISearchArticleControllersReqParams>, next: TNext) => {
  const { pageSize, pageNumber, uid, text } = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, "传参缺失，请检查pageSize与pageNumber!");
  try {
    if (uid) {
      const total = await articleModel.collection.find({ createrUid: uid }).count();
      const articleList = await articleModel.collection.find({ createrUid: uid })
        .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
        .limit(pageSize) // 限制每页的记录数
        .toArray();
      return sendResponse.success(ctx, {
        list: articleList,
        total
      });
    }
    const total = await articleModel.collection.find({ content: { $regex: text || "", $options: "i" } }).count();
    const articleList = await articleModel.collection.find({ content: { $regex: text || "", $options: "i" } })
      .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
      .limit(pageSize) // 限制每页的记录数
      .toArray();
    return sendResponse.success(ctx, {
      list: filterObjItemByKey(articleList, ARTICLE_RES_KEY_LIST),
      total
    });
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const articleListControllers = async (ctx: TDefaultRouter<IPageReqBase>, next: TNext) => {
  const { pageSize, pageNumber } = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, "传参缺失，请检查pageSize与pageNumber!");
  try {
    const total = await articleModel.collection.count();
    const articleList:IArticle[] = await articleModel.collection.find({})
      .sort({ createTime: -1 })
      .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
      .limit(pageSize) // 限制每页的记录数
      .toArray();
    const uidList = uniqueArray(articleList.map((item)=>item.createrUid));
    const userInfoList:IUserInfo[] = await Promise.all(uidList.map(async (item)=>  await userModel.collection.findOne({uid:item})))
    const userInfoMap:{[key:string]:IUserInfo} = {};
    userInfoList.forEach((item)=>userInfoMap[item.uid]=item);
    const resList = filterObjItemByKey(articleList, ARTICLE_RES_KEY_LIST) as (IArticle & {nick: string})[];
    resList.forEach((item,index)=>{
      resList[index].nick = userInfoMap[item.createrUid].nick;
    })
    return sendResponse.success(ctx, {
      list: resList,
      total
    });
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const deleteArticleControllers = async (ctx: TDefaultRouter<{ id: string }>, next: TNext) => {
  const { id } = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, "传参缺失，请检查文章id!");
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  try {
    const article: IArticle = await articleModel.collection.findOne({ id });
    if (!article) return sendResponse.error(ctx, "文章不存在");
    if (article.createrUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足");
    await articleModel.collection.deleteOne({ id });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const likeArticleControllers = async (ctx: TDefaultRouter<{ id: string }>, next: TNext) => {
  const { id } = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, "传参缺失，请检查文章id!");
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  try {
    const article: IArticle = await articleModel.collection.findOne({ id });
    if (!article) return sendResponse.error(ctx, "文章不存在");
    await articleModel.collection.updateOne({ id }, {
      $set: { likeNum: article.likeNum + 1 }
    });
    const likeIdList = userInfo.likeArticleId;
    likeIdList.push(id);
    await userModel.collection.updateOne({ uid: userInfo.uid }, {
      $set: {
        likeArticleId: likeIdList,
        likeNum: likeIdList.length
      }
    });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const collectArticleControllers = async (ctx: TDefaultRouter<{ id: string }>, next: TNext) => {
  const { id } = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, "传参缺失，请检查文章id!");
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  try {
    const article: IArticle = await articleModel.collection.findOne({ id });
    if (!article) return sendResponse.error(ctx, "文章不存在");
    await articleModel.collection.updateOne({ id }, {
      $set: { collectNum: article.collectNum + 1 }
    });
    const collectIdList = userInfo.collectArticleId;
    collectIdList.push(id);
    await userModel.collection.updateOne({ uid: userInfo.uid }, {
      $set:{
        collectArticleId: collectIdList,
        collectNum: collectIdList.length
      }
    });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};
