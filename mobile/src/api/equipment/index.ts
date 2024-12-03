import request, { IBaseRes } from "@/api/request";
import {
  IEquipment,
  IEquipmentAddReqParams,
  IEquipmentDelReqParams,
  IEquipmentOptionsReqParams,
  IEquipmentSearchOfflineRes,
  IEquipmentSearchOnlineReqParams,
} from "./const";

export const equipmentList = async () => {
  const res = await request.post<IBaseRes<IEquipment[]>>(
    "/api/equipment/list",
    {}
  );
  return res;
};

export const equipmentSearchOnline = async (
  params: Partial<IEquipmentSearchOnlineReqParams>
) => {
  const res = await request.post<IBaseRes<IEquipmentSearchOfflineRes>>(
    "/api/equipment/searchOnline",
    params
  );
  return res;
};
export const equipmentOptions = async (
  params: Partial<IEquipmentOptionsReqParams>
) => {
  const res = await request.post<IBaseRes>("/api/equipment/options", params);
  return res;
};
export const equipmentDel = async (params: Partial<IEquipmentDelReqParams>) => {
  const res = await request.post<IBaseRes>("/api/equipment/del", params);
  return res;
};
export const equipmentAdd = async (params: Partial<IEquipmentAddReqParams>) => {
  const res = await request.post<IBaseRes>("/api/equipment/add", params);
  return res;
};
