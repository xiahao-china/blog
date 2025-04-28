import staticServe from "koa-static";
import sharp, { FormatEnum } from "sharp";
import fs from "fs";

import { EReqStatus, sendResponse, TDefaultRouter, TNext } from "@/routes/api/const";
import { checkLogin } from "@/controllers/user";
import { FILE_STORAGE_PATH } from "@/controllers/file/const";
import { IObject } from "@/utils/const";

const staticServeObj = staticServe(FILE_STORAGE_PATH);

export const uploadFilePreCheck = async (ctx: TDefaultRouter<IObject>, next: TNext) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  await next();
  const filePath = ctx.request.file?.path;
  const fileName = ctx.request.file?.filename;
  if (!filePath) {
    return sendResponse.error(ctx, "文件上传失败，请稍后再试！");
  }
  return sendResponse.success(ctx, { filePath: `/api/file/load/${fileName}` });
};

export const compressedFile = async (ctx: TDefaultRouter<IObject>, next: TNext) => {
  const fileInfo = ctx.request.file;
  await new Promise((resolve,reject) => {
    const ext = fileInfo.filename.split(".").pop(); //截取后缀
    sharp(`${FILE_STORAGE_PATH.replaceAll('\\','/')}/${fileInfo.filename}`)
      .resize(null, null, { withoutEnlargement: true })
      .toFormat(ext as keyof FormatEnum, { quality: 75 })
      .toFile(
        `${FILE_STORAGE_PATH}/compressed-${fileInfo.filename}`,
        async (err, info) => {
          if (err) {
            resolve(fileInfo);
            return;
          }
          fs.unlinkSync(`${FILE_STORAGE_PATH.replaceAll('\\','/')}/${fileInfo.filename}`);
          ctx.request.file = {
            ...fileInfo,
            filename: `compressed-${fileInfo.filename}`,
            path: `${FILE_STORAGE_PATH}/compressed-${fileInfo.filename}`,
          };
          console.log(ctx.request.file)
          resolve(info);
        });
  })
  await next();

};

export const loadFileControllers = async (ctx: TDefaultRouter<IObject>, next: TNext) => {
  ctx.path = `/${ctx.params.filename}`;
  // @ts-ignore
  return staticServeObj(ctx, next);
};