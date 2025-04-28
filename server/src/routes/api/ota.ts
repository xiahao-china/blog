import Router from "koa-router";
import {
  createProject, editProject,
  getProjectList,
  getProjectDetail,
  uploadOTABin,
  createOTABinInfo,
  getOTAUpdateRecord,
  getLastVersion,
  downloadOTABin,
  getOTABinInfoList
} from "@/controllers/ota";
import { otaUploadByMulter } from "@/controllers/ota/const";

export default (router: Router) => {
  // web部分
  // 创建项目
  router.post("/ota/createProject", createProject);
  // 编辑项目
  router.post("/ota/editProject", editProject);
  // 获取项目列表
  router.post("/ota/getProjectList", getProjectList);
  // 获取项目详情
  router.post("/ota/getProjectDetail", getProjectDetail);
  // 获取固件bin信息列表
  router.post("/ota/getOTABinInfoList", getOTABinInfoList);
  // 上传固件bin文件
  router.post("/ota/uploadOTABin", uploadOTABin, otaUploadByMulter.single('file'),);
  // 创建固件bin信息记录
  router.post("/ota/createOTABinInfo", createOTABinInfo);
  // 项目下固件更新记录
  router.post("/ota/getOTAUpdateRecord", getOTAUpdateRecord);

  // 硬件部分
  // 获取最新版本
  router.get("/ota/getLastVersion", getLastVersion);
  // 固件下载
  router.get("/ota/downloadOTABin", downloadOTABin);

}
