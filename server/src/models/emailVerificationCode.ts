import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IEmailVerificationCode {
  email: string;
  code: String;
  sendTime: number;
  expireTime: number;
}

const emailVerificationCodeSchema = new Schema({
  // _id : 605d8f81e1ed264a867cfcc2,
  // 基本信息
  "email": String,
  "code": String,
  "sendTime": Number,
  "expireTime": Number,
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('emailVerificationCode', emailVerificationCodeSchema);
