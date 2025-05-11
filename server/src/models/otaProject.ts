const mongoose = require('mongoose')
const Schema = mongoose.Schema

export interface IOTAProject {
  id: string;
  name: string; // 项目名称
  description: string; // 项目描述
  currentVersion: number; // 当前启用版本，即最后可使用版本 格式为 0.1
  createTime: number; // 创建时间
  createUid: string; // 创建者uid
  maxVersion: number; // 最大版本，即最后可使用版本 格式为 0.1
}

export const getDefaultOTAProject = () => {
  const nowMs = new Date().getTime()
  return {
    id: '',
    name: '',
    description: '',
    currentVersion: 0,
    createTime: nowMs,
    createUid: '',
    maxVersion: 0
  }
}

const otaProjectSchema = new Schema({
  id: String,
  name: String,
  description: String,
  currentVersion: Number,
  createTime: Number,
  createUid: String,
  maxVersion: Number,
})

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('otaProject', otaProjectSchema)
