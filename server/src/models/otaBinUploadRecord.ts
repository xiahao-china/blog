import mongoose from 'mongoose';

// 定义 OTA 固件二进制文件上传记录的接口
export interface IOTABinUploadRecord {
  id: string; // 上传记录 ID
  projectId: string; // 所属项目 ID
  uploadTime: number; // 上传时间
  uploadUid: string; // 上传者 UID
  fileName: string; // 上传的文件名
  fileSize: number; // 文件大小（字节）
}

// 获取默认的 OTA 固件二进制文件上传记录
export const getDefaultOTABinUploadRecord = (): IOTABinUploadRecord => {
  const nowMs = new Date().getTime();
  return {
    id: '',
    projectId: '',
    uploadTime: nowMs,
    uploadUid: '',
    fileName: '',
    fileSize: 0
  };
};

// 定义 OTA 固件二进制文件上传记录的 Schema
const otaBinUploadRecordSchema = new mongoose.Schema({
  id: String,
  projectId: String,
  uploadTime: Number,
  uploadUid: String,
  fileName: String,
  fileSize: Number
});

// 把 schema 转换为一个 Model
export default mongoose.model('otaBinUploadRecord', otaBinUploadRecordSchema);
