import mongoose from 'mongoose';
const Schema = mongoose.Schema

export interface ISearchHistory {
  ip: string; // 请求来源ip
  searchContentList: string[]; // 最后五次搜索内容
  searchTimeMsList: number[]; // 最后五次搜索内容
}

export const getDefaultSearchHistory = () => {
  return {
    ip: '',
    searchContentList: [],
    searchTimeMsList: [],
  }
}

const searchHistorySchema = new Schema({
  ip: String,
  searchContentList: Array,
  searchTimeMsList: Array
})

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('searchHistory', searchHistorySchema)
