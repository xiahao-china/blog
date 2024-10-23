const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export interface IDraftArticle {
  creatorUid: string;

  title: string;
  content: string;
  createTime: number;
  lastUpdateTime: number;
  isHTML: boolean;
}

export const getDefaultDraftArticle = (): IDraftArticle=>{
  const nowMs = new Date().getTime();
  return {
    creatorUid: '',
    title: '',
    content: '',
    createTime: nowMs,
    lastUpdateTime: nowMs,
    isHTML: false,
  }
}

const draftArticleSchema = new Schema({
  creatorUid: String,

  title: String,
  content: String,
  createTime: Number,
  lastUpdateTime: Number,
  isHTML: Boolean
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('draftArticle', draftArticleSchema);
