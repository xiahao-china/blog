import Router from "koa-router";
import {
  articleListControllers,
  createArticleControllers,
  getArticleDetailControllers,
  searchArticleControllers
} from "@/controllers/article";

export default (router: Router) => {
  router.get('/article/create', createArticleControllers);
  router.get('/article/getDetail', getArticleDetailControllers);
  router.post('/article/search', searchArticleControllers);
  router.post('/article/list', articleListControllers);
}