import { StoreOptions } from "vuex";
import { IUserInfo } from "@/api/usr/const";
import { checkLoginStatusReq } from "@/api/usr";

export interface IUserState {usrInfo: IUserInfo}

export default {
  state: {
    usrInfo: {
      uid: "",
      username: "",
      avatar: "",
      name: "",
      mail: "",
      followNum: 0,
      likesNum: 0,
      collectNum: 0,
    }
  },
  mutations: {
    updateAllUserInfo: (state, payload: IUserInfo) => {
      state.usrInfo = payload;
    },
  },
  actions: {
    checkLoginStatus: async (context) => {
      const res = await checkLoginStatusReq();
      if (res.code === 200) context.commit("updateAllUserInfo", res.data);
    },
  },
  modules: {},
} as StoreOptions<IUserState>;
