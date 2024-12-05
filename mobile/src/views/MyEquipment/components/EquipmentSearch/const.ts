import { debounce } from "lodash";
import { equipmentSearchOnline } from "@/api/equipment";
import {
  IEquipmentSearchOfflineRes,
  IEquipmentSearchOnlineReqParams,
} from "@/api/equipment/const";

export const EVERY_PAGE_MAX = 10;

export const throttleSearch = debounce(
  async (
    params: IEquipmentSearchOnlineReqParams,
    callback: (res: IEquipmentSearchOfflineRes & { msg: string }) => void
  ) => {
    if (!params.account) {
      callback({
        list: [],
        total: 0,
        msg: "",
      });
      return;
    }
    const res = await equipmentSearchOnline(params);
    if (res.code !== 200) {
      callback({
        list: [],
        total: 0,
        msg: res.message || "搜索失败!",
      });
      return;
    }
    callback({
      ...res.data,
      msg: "",
    });
  },
  600
);
