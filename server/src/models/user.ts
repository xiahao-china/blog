import {USER_TOKEN_EXPIRED_INTERVAL_MS} from "@/controllers/user/const";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export enum ESex {
  unknow = 1,
  male,
  female
}

export enum ERole {
  admin = 1,
  manager,
  normal
}

export enum EUserStatus {
  using = 1,
  block,
  signOut,
}

export interface IUserInfo {
  uid: string;
  nick: string;
  password: string;
  sex: ESex,
  avatar: string;
  email: string;
  phone: number;
  createTime: number;
  lastLoginTime: number;

  collectArticleId: string[]; // 收藏的文章
  likeArticleId: string[]; // 点赞的文章
  followUid: string[]; // 关注的人uid
  bindEquipmentId: string[]; // 绑定的设备id

  state: EUserStatus;
  role: ERole;
  hasChangeNick: boolean;
  remark: string; // 备注
  token: string;
  tokenExpiredTime: number;
  pcToken: string;
  pcTokenExpiredTime: number;
}

export const getDefaultUserInfo = (): IUserInfo => {
  const nowMs = new Date().getTime();
  return ({
    uid: '',
    nick: '',
    password: '',
    avatar: '',
    sex: ESex.unknow,
    email: '',
    phone: 0,
    createTime: nowMs,
    lastLoginTime: nowMs,

    collectArticleId: [],
    likeArticleId: [],
    followUid: [],
    bindEquipmentId: [],

    state: EUserStatus.using,
    role: ERole.normal,
    hasChangeNick: false,

    // token用于移动端
    token: '',
    tokenExpiredTime: nowMs + USER_TOKEN_EXPIRED_INTERVAL_MS,
    // pcToken用于pc端
    pcToken: '',
    pcTokenExpiredTime: nowMs + USER_TOKEN_EXPIRED_INTERVAL_MS,
    // 备用的字段
    remark: ''
  })
};

const usersSchema = new Schema({
  // _id : 605d8f81e1ed264a867cfcc2,
  // 基本信息
  uid: String,
  nick: String,
  password: String,
  avatar: String,
  sex: Number,
  email: String,
  phone: String,
  // "createTime" : { type: Date, default: Date.now },
  // "lastLoginTime" : { type: Date, default: Date.now },
  createTime: Number,
  lastLoginTime: Number,

  collectArticleId: Array,
  likeArticleId: Array,
  followUid: Array,
  bindEquipmentId: Array,

  state: Number,
  role: Number,
  hasChangeNick: Boolean,

  // token
  token: String,
  tokenExpiredTime: Number,
  // pcToken
  pcToken: String,
  pcTokenExpiredTime: Number,
  // 备用的字段
  remark: String
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model('users', usersSchema);
