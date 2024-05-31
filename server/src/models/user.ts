const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export enum ESex {
  unknow,
  male,
  female
}
export interface IUserInfo {
  uid: string;
  userName: string;
  password: string;
  sex: ESex,
  avatar: string;
  email: string;
  phone: number;
  createTime: number;
  lastLoginTime: number;
  deptId: number[];
  state: number;
  role: number;
  roleList: number[]
  remark: string;
  token: string;

  phoneVerCode: number; // 手机号验证码
  phoneVerCodeExpireTime: number; // 手机号验证码过期时间
  phoneGetVerCodeNum: number[]; // 手机号验证码获取时间

  emailVerCode: number; // 邮箱验证码
  emailVerCodeExpireTime: number;
}

const usersSchema = new Schema({
  // _id : 605d8f81e1ed264a867cfcc2,
  // 基本信息
  "uid" : Number,
  "userName" : String,
  "password" : String,
  "avatar": String,
  "sex": Number,
  "email" : String,
  "phone" : String,
  // "createTime" : { type: Date, default: Date.now },
  // "lastLoginTime" : { type: Date, default: Date.now },
  "createTime": Number,
  "lastLoginTime": Number,

  "deptId" : Array,
  "state" : Number,
  "role" : Number,
  "roleList" : Array,

  "phoneVerCode": Number,
  "phoneVerCodeExpireTime": Number,
  "phoneGetVerCodeNum": Number,


  "emailVerCode": Number,
  "emailVerCodeExpireTime": Number,

  // token
  "token": String,
  // 备用的字段
  "remark": String
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('users', usersSchema);
