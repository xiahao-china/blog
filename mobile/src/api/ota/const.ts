export interface IOTABin {
  id: string;
  name: string; // 固件名称
  version: number; // 固件版本 格式为 0.1
  downloadUrl: string; // 固件下载地址
  createTime: number; // 创建时间
  createUid: string; // 创建者uid
  belongProjectId: string; // 所属项目ID
}

export interface IOTABinDownloadRecord {
  id: string; // 下载记录 ID
  binFileId: string; // 固件文件 ID
  projectId: string; // 项目 ID
  downloadTime: number; // 下载时间
  chipid: string; // 下载设备的 chipid
}

export interface IOTAProject {
  id: string;
  name: string; // 项目名称
  description: string; // 项目描述
  currentVersion: number; // 当前启用版本，即最后可使用版本 格式为 0.1
  createTime: number | string; // 创建时间
  createUid: string; // 创建者uid
}

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

export interface IGetProjectListReqParams {
  pageSize: number;
  pageNumber: number;
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
  downloadUrl: string; // 固件下载地址
}

export interface IGetFirmwareUpdateRecordReqParams {
  pageSize: number;
  pageNumber: number;
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
];
