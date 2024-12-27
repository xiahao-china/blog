import mongoose from 'mongoose';
const Schema = mongoose.Schema

export interface IBrowseHistory {
  id: string;
  uid: string;
  articleId: string;
  browseStartTimeMs: number[];
  browseNum: number;
}

export const getDefaultBrowseHistory = () => {
  return {
    id: '',
    uid: '',
    articleId: '',
    browseStartTimeMs: [],
    browseNum: 0
  }
}

const browseHistorySchema = new Schema({
  id: String,
  uid: String,
  articleId: String,
  browseStartTimeMs: Array,
  browseNum: Number
})

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('browseHistory', browseHistorySchema)
