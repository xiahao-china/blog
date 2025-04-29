import xss from "xss";
import otaProjectModel, { getDefaultOTAProject, IOTAProject } from "@/models/otaProject";
import otaBinModel, { getDefaultOTABin, IOTABin } from "@/models/otaBin";
import otaBinDownloadRecordModel, {
  getDefaultOTABinDownloadRecord, IOTABinDownloadRecord
} from "@/models/otaBinDownloadRecord";
import otaBinUploadRecordModel, {
  getDefaultOTABinUploadRecord, IOTABinUploadRecord
} from "@/models/otaBinUploadRecord";
import { EReqStatus, IPageReqBase, sendResponse, TDefaultRouter, TNext } from "@/routes/api/const";
import { checkLogin } from "@/controllers/user";
import { filterObjItemByKey } from "@/utils/common";
import {
  ICreateProjectReqParams,
  IEditProjectReqParams,
  IGetProjectListReqParams,
  IGetProjectDetailReqParams,
  IUploadOTABinReqParams,
  ICreateOTABinInfoReqParams,
  IGetFirmwareUpdateRecordReqParams,
  IGetLastVersionReqParams,
  IDownloadOTABinReqParams, OTA_PROJECT_BASE_RES_KEY_LIST,
  OTA_FILE_STORAGE_PATH
} from "./const";
import otaBinDownloadRecord from "@/models/otaBinDownloadRecord";
import staticServe from "koa-static";
import Router from "koa-router";

const staticServeObj = staticServe(OTA_FILE_STORAGE_PATH);

export const createProject: Router.IMiddleware<any, any> = async (
  ctx: TDefaultRouter<ICreateProjectReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { name, description } = ctx.request.body || {};
  if (!name) return sendResponse.error(ctx, "项目名称不能为空!");
  try {
    const projectNum = await otaProjectModel.collection.count();
    const newOTAProject: IOTAProject = {
      ...getDefaultOTAProject(),
      id: `${new Date().getTime()}${projectNum + 1}`,
      name: xss(name),
      createUid: userInfo.uid,
      description: xss(description)
    };

    await otaProjectModel.collection.insertMany([newOTAProject]);
    return sendResponse.success(ctx, { id: newOTAProject.id });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const editProject = async (
  ctx: TDefaultRouter<IEditProjectReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { id, name, description, currentVersion } = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, "项目 ID 不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");

    await otaProjectModel.collection.updateOne(
      { id },
      {
        $set: {
          name: xss(name),
          description: xss(description),
          currentVersion: currentVersion || project.currentVersion
        }
      }
    );
    return sendResponse.success(ctx, { id });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getProjectList = async (
  ctx: TDefaultRouter<IGetProjectListReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { pageSize, pageNumber } = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, "传参缺失，请检查 pageSize 与 pageNumber!");
  try {
    const filterObj = { createUid: userInfo.uid };
    const total = await otaProjectModel.collection.find(filterObj).count();
    const projectList = await otaProjectModel.collection
      .find(filterObj)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    return sendResponse.success(ctx, {
      list: projectList,
      total
    });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getProjectDetail = async (
  ctx: TDefaultRouter<IGetProjectDetailReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { id } = ctx.request.body || {};
  if (!id) return sendResponse.error(ctx, "项目 ID 不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");
    const filteredProject = filterObjItemByKey(project, OTA_PROJECT_BASE_RES_KEY_LIST);
    return sendResponse.success(ctx, filteredProject);
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};


export const createOTABinInfo = async (
  ctx: TDefaultRouter<ICreateOTABinInfoReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { name, version, uploadId, projectId } = ctx.request.body || {};
  if (!projectId) return sendResponse.error(ctx, "项目 ID 不能为空!");
  if (!version) return sendResponse.error(ctx, "固件版本不能为空!");
  if (!uploadId) return sendResponse.error(ctx, "上传记录不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id: projectId });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");

    const checkOTABinInfo = await otaBinModel.collection.findOne({ $and: [{ belongProjectId: projectId }, { version }] });
    if (checkOTABinInfo) return sendResponse.error(ctx, "固件版本已存在!");

    const uploadRecord = await otaBinUploadRecordModel.collection.findOne({ id: uploadId });
    if (!uploadRecord) return sendResponse.error(ctx, "上传记录不存在!");
    if (uploadRecord.uploadUid!== userInfo.uid) return sendResponse.error(ctx, "权限不足!");
    if (uploadRecord.projectId!== projectId) return sendResponse.error(ctx, "上传记录与项目不匹配!");

    const binNum = await otaBinModel.collection.count();
    const newOTABin: IOTABin = {
      ...getDefaultOTABin(),
      id: `${new Date().getTime()}${binNum + 1}`,
      belongProjectId: projectId,
      version,
      name: xss(name),
      downloadUrl: xss(`/${uploadRecord.fileName}`),
      createUid: userInfo.uid
    };

    await otaBinModel.collection.insertMany([newOTABin]);
    return sendResponse.success(ctx, { id: newOTABin.id });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getOTABinInfoList = async (
  ctx: TDefaultRouter<IGetFirmwareUpdateRecordReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { projectId, pageSize, pageNumber } = ctx.request.body || {};
  if (!projectId) return sendResponse.error(ctx, "项目 ID 不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id: projectId });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");
    const filterObj = { belongProjectId: projectId };
    const total = await otaBinModel.collection.find(filterObj).count();
    const binList = await otaBinModel.collection
      .find(filterObj)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return sendResponse.success(ctx, {
      list: binList,
      total
    });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getOTAUpdateRecord = async (
  ctx: TDefaultRouter<IGetFirmwareUpdateRecordReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { projectId, pageSize, pageNumber } = ctx.request.body || {};
  if (!projectId) return sendResponse.error(ctx, "项目 ID 不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id: projectId });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");

    const filterObj = { belongProjectId: projectId };
    const total = await otaBinDownloadRecord.collection.find(filterObj).count();
    const binList = await otaBinDownloadRecord.collection
      .find(filterObj)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const getLastVersion = async (
  ctx: TDefaultRouter<IGetLastVersionReqParams>,
  next: TNext
) => {
  const { projectId } = ctx.request.query || {};
  if (!projectId) return sendResponse.error(ctx, "项目 ID 不能为空!");
  try {
    const project = await otaProjectModel.collection.findOne({ id: projectId });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    // 找到对应bin版本
    const binInfo = await otaBinModel.collection.findOne({ version: project.currentVersion });
    if (!binInfo) return sendResponse.error(ctx, "版本产物不存在!");

    return sendResponse.success(ctx, {
      currentVersion: project.currentVersion,
      binFileId: binInfo.id
    });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const downloadOTABin = async (
  ctx: TDefaultRouter<IDownloadOTABinReqParams>,
  next: TNext
) => {
  const { binFileId, chipid } = ctx.request.query || {};
  if (!binFileId) return sendResponse.error(ctx, "固件文件 ID 不能为空!");
  try {
    const binInfo = await otaBinModel.collection.findOne({ id: binFileId });
    if (!binInfo) return sendResponse.error(ctx, "固件文件记录不存在!");
    // 新增下载记录
    const downloadRecordNum = await otaBinDownloadRecordModel.collection.count();
    const newDownloadRecord: IOTABinDownloadRecord = {
      ...getDefaultOTABinDownloadRecord(),
      id: `${new Date().getTime()}${downloadRecordNum + 1}`,
      binFileId,
      chipid: chipid || "",
      projectId: binInfo.belongProjectId
    };
    await otaBinDownloadRecordModel.collection.insertMany([newDownloadRecord]);
    ctx.path = `${binInfo.downloadUrl}`;
    ctx.set('Content-Disposition', `attachment; filename="${binInfo.downloadUrl.replace('/', "")}"`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return staticServeObj(ctx, next);
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const uploadOTABin = async (
  ctx: TDefaultRouter<IUploadOTABinReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  try {

    // 这里需要添加文件上传逻辑
    await next();
    const { projectId } = ctx.request.body || {};
    console.log("ctx.request.body", ctx.request.body);
    if (!projectId) return sendResponse.error(ctx.req.body, "项目 ID 不能为空!");
    const project = await otaProjectModel.collection.findOne({ id: projectId });
    if (!project) return sendResponse.error(ctx, "项目不存在!");
    if (project.createUid !== userInfo.uid) return sendResponse.error(ctx, "权限不足!");

    const fileInfo = ctx.request.file;
    const filePath = fileInfo?.path;
    const fileName = fileInfo?.filename;
    if (!filePath) {
      return sendResponse.error(ctx, "文件上传失败，请稍后再试！");
    }
    // 新增上传记录
    const uploadRecordNum = await otaBinUploadRecordModel.collection.count();
    const newUploadRecord: IOTABinUploadRecord = {
     ...getDefaultOTABinUploadRecord(),
      id: `${new Date().getTime()}${uploadRecordNum + 1}`,
      projectId,
      fileName: fileName || "",
      uploadUid: userInfo.uid,
      fileSize: fileInfo.size
    }
    await otaBinUploadRecordModel.collection.insertMany([newUploadRecord]);
    return sendResponse.success(ctx, {
      fileName,
      uploadId: newUploadRecord.id
    });
  } catch (err) {
    console.log("err", err);
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};
