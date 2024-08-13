import path from 'path';
import multer from "@koa/multer";

export interface IMulterUploadSingleFileRes {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export const FILE_STORAGE_PATH = path.join(__dirname, process.env.NODE_ENV === 'development' ? "../../../tools/mongodb/uploadFiles" : '');

//调用multer的diskStorage方法,diskStorage（硬盘）存储引擎
const storage = multer.diskStorage({
  //destination目的地，文件的存储的地方
  destination(req, { originalname }, cb) {
    cb(null, FILE_STORAGE_PATH);                 //文件存储的路径
  },

  filename(req, { originalname }, cb) {
    const ext = originalname.split(".").pop(); //截取后缀
    const fileName = originalname.replace(/\.\w+$/,'');
    cb(null, `${fileName}-${Date.now()}.${ext}`); //文件起别名
  }
});


export const uploadByMulter = multer({ storage });