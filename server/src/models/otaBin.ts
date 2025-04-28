const mongoose = require('mongoose')
const Schema = mongoose.Schema

export interface IOTABin {
  id: string;
  name: string; // 固件名称
  version: number; // 固件版本 格式为 0.1
  downloadUrl: string; // 固件下载地址
  createTime: number; // 创建时间
  createUid: string; // 创建者uid
  belongProjectId: string; // 所属项目ID
}

export const getDefaultOTABin = () => {
  const nowMs = new Date().getTime()
  return {
    id: '',
    name: '',
    version: 0,
    downloadUrl: '',
    createTime: nowMs,
    createUid: '',
    belongProjectId: ''
  }
}

const otaBinSchema = new Schema({
  id: String,
  name: String,
  version: Number,
  downloadUrl: String,
  createTime: Number,
  createUid: String,
  belongProjectId: String,
})

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('otaBin', otaBinSchema)
