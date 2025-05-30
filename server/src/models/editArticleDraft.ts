const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export interface IEditArticleDraft  {
  creatorUid: string;

  title: string;
  content: string;
  createTime: number;
  lastUpdateTime: number;
  isHTML: boolean;
  articleId: string;
}

export const getDefaultEditArticleDraft = (): IEditArticleDraft=>{
  const nowMs = new Date().getTime();
  return {
    creatorUid: '',
    title: '',
    content: '',
    createTime: nowMs,
    lastUpdateTime: nowMs,
    isHTML: false,
    articleId: ''
  }
}

const editArticleDraftSchema = new Schema({
  creatorUid: String,

  title: String,
  content: String,
  createTime: Number,
  lastUpdateTime: Number,
  isHTML: Boolean,
  articleId: String
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('editArticleDraft', editArticleDraftSchema);
