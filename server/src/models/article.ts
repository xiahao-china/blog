const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export interface IArticle {
  id: string;
  title: string;
  cover: string; // 封面
  content: string;
  createrUid: string;
  createTime: number;
  lastUpdateTime: number;
  browseNum: number; // 浏览量
  collectNum: number; // 收藏量
  likeNum: number; // 点赞量
  reviewId: number[];
  isHTML: boolean;
}

export const getDefaultArticle = ()=>{
  const nowMs = new Date().getTime();
  return {
    id: '',
    title: '',
    cover: '',
    content: '',
    createrUid: '',
    createTime: nowMs,
    lastUpdateTime: nowMs,
    browseNum: 0,
    collectNum: 0,
    likeNum: 0,
    reviewId: [],
    isHTML: false,
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
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('article', articleSchema);
