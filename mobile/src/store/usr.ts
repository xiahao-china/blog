import { StoreOptions } from "vuex";
import { ESex, IUserInfo } from "@/api/usr/const";
import { checkLoginStatusReq } from "@/api/usr";
import { cloneDeep } from "lodash";

export interface IUserState {usrInfo: IUserInfo & {hasLoaded: boolean}}

export const DEFAULT_USR_INFO = {
  uid: "",
  username: "",
  avatar: "",
  nick: "",
  mail: "",
  hasChangeNick: false,
  sex: ESex.unknow,
  lastLoginTime: 0,
  followNum: 0,
  likesNum: 0,
  collectNum: 0,
  hasLoaded: false,
}

export default {
  state: {
    usrInfo: cloneDeep(DEFAULT_USR_INFO)
  },
  mutations: {
    updateAllUserInfo: (state, payload: IUserInfo) => {
      state.usrInfo = {
        ...payload,
        hasLoaded: true,
      };
    },
  },
  actions: {
    checkLoginStatus: async (context) => {
      const res = await checkLoginStatusReq();
      if (res.code === 200) context.commit("updateAllUserInfo", res.data);
      else context.commit("updateAllUserInfo", cloneDeep(DEFAULT_USR_INFO));
    },
  },
  modules: {},
} as StoreOptions<IUserState>;
