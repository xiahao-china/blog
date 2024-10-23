import Router from "koa-router";
import {
  articleListControllers, collectArticleControllers, createAndEditArticleControllers, delDraftArticleControllers,
  deleteArticleControllers,
  getArticleDetailControllers, getDraftArticleControllers, likeArticleControllers, saveDraftArticleControllers,
  searchArticleControllers
} from "@/controllers/article";

export default (router: Router) => {
  router.post('/article/createAndEdit', createAndEditArticleControllers);
  router.get('/article/getDetail', getArticleDetailControllers);
  router.post('/article/search', searchArticleControllers);
  router.post('/article/list', articleListControllers);
  router.post('/article/delete', deleteArticleControllers);
  router.post('/article/like', likeArticleControllers);
  router.post('/article/collect', collectArticleControllers);
  router.post('/article/draft/save', saveDraftArticleControllers);
  router.post('/article/draft/del', delDraftArticleControllers);
  router.get('/article/draft/get', getDraftArticleControllers);
}