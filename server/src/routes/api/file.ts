import Router from "koa-router";

import { loadFileControllers, uploadFilePreCheck } from "@/controllers/file";
import { uploadByMulter } from "@/controllers/file/const";

export default (router: Router) => {
  router.post('/file/upload', uploadFilePreCheck, uploadByMulter.single('file'));
  router.get('/file/load/:filename', loadFileControllers);
}