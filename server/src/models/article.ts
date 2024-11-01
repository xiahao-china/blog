const mongoose = require('mongoose')
const Schema = mongoose.Schema

export interface IArticle {
  id: string
  title: string
  cover: string // 封面
  content: string // 内容基本为非html格式化
  createrUid: string // 创建者uid
  collaborateUid: string[] // 协作者uid
  createTime: number // 创建时间
  lastUpdateTime: number // 最后更新时间
  browseNum: number // 浏览量
  collectNum: number // 收藏量
  likeNum: number // 点赞量
  reviewId: number[] // 评论id
  isHTML: boolean // 是否格式为html 当前已废弃
  isPrivate: boolean // 是否私有
}

export const getDefaultArticle = () => {
  const nowMs = new Date().getTime()
  return {
    id: '',
    title: '',
    cover: '',
    content: '',
    createrUid: '',
    collaborateUid: [],
    createTime: nowMs,
    lastUpdateTime: nowMs,
    browseNum: 0,
    collectNum: 0,
    likeNum: 0,
    reviewId: [],
    isHTML: false,
    isPrivate: false
  }
}

const articleSchema = new Schema({
  id: String,
  title: String,
  cover: String,
  content: String,
  createrUid: String,
  createTime: Number,
  lastUpdateTime: Number,
  collectNum: Number,
  browseNum: Number,
  likeNum: Number,
  isHTML: Boolean,
  reviewId: Array,
  isPrivate: Boolean,
  collaborateUid: Array
})

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('article', articleSchema)
