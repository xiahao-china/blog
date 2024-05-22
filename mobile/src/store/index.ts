import {createStore, StoreOptions} from "vuex";
import {assign} from "lodash";
import usrStore, {IUserState} from "./usr";

export type IStore = StoreOptions<IUserState>;

const DEFAULT_STORE_OBJ = {
  state: {},
  mutations: {},
  actions: {},
  modules: {},
}

export default createStore(assign(DEFAULT_STORE_OBJ, usrStore) as IStore);
