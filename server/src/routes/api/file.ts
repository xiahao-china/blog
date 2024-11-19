import Router from "koa-router";

import { compressedFile, loadFileControllers, uploadFilePreCheck } from "@/controllers/file";
import { uploadByMulter } from "@/controllers/file/const";

export default (router: Router) => {
  router.post('/file/upload', uploadFilePreCheck, uploadByMulter.single('file'), compressedFile);
  router.get('/file/load/:filename', loadFileControllers);
}