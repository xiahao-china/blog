import { IPageReqBase } from "@/routes/api/const";
import { IOTAProject } from "@/models/otaProject";
import { getOTAUpdateRecord } from "@/controllers/ota/index";
import path from "path";
import multer from "@koa/multer";
import fs from "fs";

export interface ICreateProjectReqParams{
  name: string; // 项目名称
  description: string; // 项目描述
}

export interface IEditProjectReqParams{
  id: string; // 项目 ID
  name: string; // 项目名称
  description: string; // 项目描述
  currentVersion: number; // 当前启用版本
}

export interface IGetProjectListReqParams extends IPageReqBase {
}

export interface IGetProjectDetailReqParams {
  id: string; // 项目 ID
}

export interface IUploadOTABinReqParams {
  projectId: string; // 项目 ID
}

export interface ICreateOTABinInfoReqParams {
  projectId: string; // 项目 ID
  name: string; // 固件名称
  version: number; // 固件版本 格式为 0.1
  uploadId: string; // 固件下载地址
}

export interface IGetFirmwareUpdateRecordReqParams extends IPageReqBase {
  projectId: string; // 项目 ID
}

export interface IGetLastVersionReqParams {
  projectId: string; // 项目 ID
}

export interface IDownloadOTABinReqParams {
  binFileId: string; // 固件文件 ID
  chipid: string; // 下载设备的 chipid
}

export const OTA_PROJECT_BASE_RES_KEY_LIST: (keyof IOTAProject)[] = [
  "id",
  "name",
  "description",
  "currentVersion",
  "createTime",
  "maxVersion"
];

export const OTA_FILE_STORAGE_PATH = path.join(__dirname, process.env.NODE_ENV === 'development' ? "../../../tools/mongodb/uploadFiles/otaBin" : '../../dbToolShell/uploadFiles/otaBin');


//调用multer的diskStorage方法,diskStorage（硬盘）存储引擎
const storage = (()=>{
  // 检查文件夹是否存在，如果不存在则创建
  if (!fs.existsSync(OTA_FILE_STORAGE_PATH)) {
    fs.mkdirSync(OTA_FILE_STORAGE_PATH, { recursive: true });
  }
  return multer.diskStorage({
    //destination目的地，文件的存储的地方
    destination(req, { originalname }, cb) {
      cb(null, OTA_FILE_STORAGE_PATH);                 //文件存储的路径
    },

    filename(req, { originalname }, cb) {
      const ext = originalname.split(".").pop(); //截取后缀
      const fileName = originalname.replace(/\.\w+$/,'');
      cb(null, `${fileName}-${Date.now()}.${ext}`); //文件起别名
    }
  });
})()


export const otaUploadByMulter = multer({ storage });