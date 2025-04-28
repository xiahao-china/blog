const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 定义固件二进制文件下载记录的接口
export interface IOTABinDownloadRecord {
  id: string; // 下载记录 ID
  binFileId: string; // 固件文件 ID
  projectId: string; // 项目 ID
  downloadTime: number; // 下载时间
  chipid: string; // 下载设备的 chipid
}

// 获取默认的固件二进制文件下载记录
export const getDefaultOTABinDownloadRecord = () => {
  const nowMs = new Date().getTime()
  return {
    id: '',
    binFileId: '',
    projectId: '',
    downloadTime: nowMs,
    chipid: ''
  }
}

// 定义固件二进制文件下载记录的 Schema
const otaBinDownloadRecordSchema = new Schema({
  id: String,
  binFileId: String,
  projectId: String,
  downloadTime: Number,
  chipid: String,
})

// 把 schema 转换为一个 Model
export default mongoose.model('otaBinDownloadRecord', otaBinDownloadRecordSchema)
