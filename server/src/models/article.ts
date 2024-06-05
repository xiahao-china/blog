const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export interface IArticle {
  id: string;
  title: string;
  content: string;
  createrUid: string;
  createTime: number;
  lastUpdateTime: number;
  collectNum: number;
  likeNum: number;
  reviewId: number[];
}

export const getDefaultArticle = ()=>{
  const nowMs = new Date().getTime();
  return {
    id: '',
    title: '',
    content: '',
    createrUid: '',
    createTime: nowMs,
    lastUpdateTime: nowMs,
    collectNum: 0,
    likeNum: 0,
    reviewId: [],
  }
}

const articleSchema = new Schema({
  id: String,
  title: String,
  content: String,
  createrUid: String,
  createTime: Number,
  lastUpdateTime: Number,
  collectNum: Number,
  likeNum: Number,
  reviewId: Array,
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('article', articleSchema);
