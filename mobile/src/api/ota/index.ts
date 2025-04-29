import request, { IBaseRes } from "@/api/request";
import {
  ICreateProjectReqParams,
  IEditProjectReqParams,
  IGetProjectListReqParams,
  IGetProjectDetailReqParams,
  IUploadOTABinReqParams,
  ICreateOTABinInfoReqParams,
  IGetFirmwareUpdateRecordReqParams,
  IGetLastVersionReqParams,
  IDownloadOTABinReqParams,
  IOTABin,
  IOTAProject,
  IOTABinDownloadRecord,
} from "./const";

// 创建项目
export const createProject = async (
  params: Partial<ICreateProjectReqParams>
) => {
  const res = await request.post<IBaseRes<{ id: string }>>(
    "/api/ota/createProject",
    params
  );
  return res;
};

// 编辑项目
export const editProject = async (params: Partial<IEditProjectReqParams>) => {
  const res = await request.post<IBaseRes>("/api/ota/editProject", params);
  return res;
};

// 获取项目列表
export const getProjectList = async (
  params: Partial<IGetProjectListReqParams>
) => {
  const res = await request.post<
    IBaseRes<{ list: IOTAProject[]; total: number }>
  >("/api/ota/getProjectList", params);
  return res;
};

// 获取项目详情
export const getProjectDetail = async (params: IGetProjectDetailReqParams) => {
  const res = await request.post<IBaseRes<IOTAProject>>(
    "/api/ota/getProjectDetail",
    params
  );
  return res;
};

// 获取固件bin信息列表
export const getOTABinInfoList = async (params: any) => {
  // 请根据实际需求替换 any 为正确类型
  const res = await request.post<IBaseRes<{ list: IOTABin[]; total: number }>>(
    "/api/ota/getOTABinInfoList",
    params
  );
  return res;
};

// 上传固件bin文件
export const uploadOTABin = async (
  params: Partial<FormData>
) => {
  const res = await request.post<IBaseRes<{ fileName: string; uploadId: string; }>>(
    "/api/ota/uploadOTABin",
    params,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res;
};

// 创建固件bin信息记录
export const createOTABinInfo = async (
  params: Partial<ICreateOTABinInfoReqParams>
) => {
  const res = await request.post<IBaseRes<{ id: string }>>(
    "/api/ota/createOTABinInfo",
    params
  );
  return res;
};

// 项目下固件更新记录
export const getOTAUpdateRecord = async (
  params: Partial<IGetFirmwareUpdateRecordReqParams>
) => {
  const res = await request.post<
    IBaseRes<{
      list: IOTABinDownloadRecord[];
      total: number;
    }>
  >("/api/ota/getOTAUpdateRecord", params);
  return res;
};

// 获取最新版本
export const getLastVersion = async (params: IGetLastVersionReqParams) => {
  const res = await request.get<IBaseRes<IOTABin>>(
    "/api/ota/getLastVersion",
    params
  );
  return res;
};

// 固件下载
export const downloadOTABin = async (params: IDownloadOTABinReqParams) => {
  const res = await request.get<IBaseRes<{ downloadUrl: string }>>(
    "/api/ota/downloadOTABin",
    params
  );
  return res;
};
