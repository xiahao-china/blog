import { EReqStatus, sendResponse, TDefaultRouter, TNext } from "@/routes/const";
import { checkLogin } from "@/controllers/user";
import { IMulterUploadSingleFileRes } from "@/controllers/file/const";
import staticServe from 'koa-static';
import { FILE_STORAGE_PATH } from "@/controllers/file/const";

const staticServeObj = staticServe(FILE_STORAGE_PATH);

export const uploadFilePreCheck = async (ctx: TDefaultRouter<{}>, next: TNext) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, '', EReqStatus.noLogin);
  await next();
  const filePath = (ctx as unknown as {file: IMulterUploadSingleFileRes | undefined}).file?.path;
  const fileName = (ctx as unknown as {file: IMulterUploadSingleFileRes | undefined}).file?.filename;
  if (!filePath){
    return sendResponse.error(ctx, '文件上传失败，请稍后再试！');
  }
  return sendResponse.success(ctx, {filePath: `/api/file/load/${fileName}`});
};

export const loadFileControllers = async (ctx: TDefaultRouter<{}>, next: TNext) => {
  ctx.path = `/${ctx.params.filename}`;
  return staticServeObj(ctx, next)
};