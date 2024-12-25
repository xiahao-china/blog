import { EReqStatus, IPageReqBase, sendResponse, TDefaultRouter, TNext } from "@/routes/api/const";
import { checkLogin } from "@/controllers/user";

import equipmentModel, { EEquipmentOptions, EEquipmentType, getDefaultEquipment, IEquipment } from "@/models/equipment";
import userModel from "@/models/user";

import { IObject } from "@/utils/const";
import { filterObjItemByKey } from "@/utils/common";

import {
  EQUIPMENT_BASE_RES_KEY_LIST,
  IEquipmentSearchOnlineControllersReqParams,
  IDelEquipmentControllersReqParams,
  IAddEquipmentControllersReqParams,
  IOptionsEquipmentControllersReqParams,
  IAdminCreateEquipmentControllersReqParams,
  EQUIPMENT_OPTIONS_MAP,
  IAdminDelEquipmentControllersReqParams
} from "./const";


export const equipmentListControllers = async (
  ctx: TDefaultRouter<IObject>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  try {
    const eidList = userInfo.bindEquipmentId || [];
    const equipmentList = await equipmentModel.collection.find({
      eid: { $in: eidList }
    }).toArray() as unknown as IEquipment[];
    const resList = filterObjItemByKey(equipmentList, EQUIPMENT_BASE_RES_KEY_LIST);
    return sendResponse.success(ctx, resList);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const equipmentSearchControllers = async (
  ctx: TDefaultRouter<IEquipmentSearchOnlineControllersReqParams>,
  next: TNext
) => {
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  const { pageSize, pageNumber, account } = ctx.request.body || {};
  if (!pageSize || !pageNumber) return sendResponse.error(ctx, "传参缺失，请检查pageSize与pageNumber!");

  try {
    const equipmentListCollection = equipmentModel.collection
      .find({ account: { $regex: account || "", $options: "i" } });
    const total = await equipmentListCollection.count();
    const equipmentList = await equipmentListCollection
      .sort({ createTime: -1 })
      .skip((pageNumber - 1) * pageSize) // 跳过前面的记录
      .limit(pageSize) // 限制每页的记录数
      .toArray() as unknown as IEquipment[];
    const resList = filterObjItemByKey(equipmentList, EQUIPMENT_BASE_RES_KEY_LIST);
    return sendResponse.success(ctx, {
      total,
      list: resList
    });
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const addEquipmentControllers = async (
  ctx: TDefaultRouter<IAddEquipmentControllersReqParams>,
  next: TNext
) => {
  const { eid, password } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  if (!eid) return sendResponse.error(ctx, "传参缺失，请检查eid!");
  if (!password) return sendResponse.error(ctx, "传参缺失，请检查password!");
  const eidList = userInfo.bindEquipmentId || [];
  if (eidList.includes(eid)) return sendResponse.error(ctx, "您已经绑定过该设备!");

  try {
    const equipmentInfo = await equipmentModel.collection.findOne({ eid });
    if (!equipmentInfo) return sendResponse.error(ctx, "设备不存在!");
    if (equipmentInfo.password !== password) return sendResponse.error(ctx, "wifi密码错误!");

    const newBindEquipmentId = [...eidList, eid];
    await userModel.collection.updateOne({ uid: userInfo.uid }, {
      $set: {
        bindEquipmentId: newBindEquipmentId
      }
    });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const delEquipmentControllers = async (
  ctx: TDefaultRouter<IDelEquipmentControllersReqParams>,
  next: TNext
) => {
  const { eid } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  if (!eid) return sendResponse.error(ctx, "传参缺失，请检查eid!");
  const eidList = userInfo.bindEquipmentId || [];
  if (!eidList.includes(eid)) return sendResponse.error(ctx, "您还未绑定该设备!");
  try {
    const newBindEquipmentId = eidList.filter((item) => item !== eid);
    await userModel.collection.updateOne({ uid: userInfo.uid }, {
      $set: {
        bindEquipmentId: newBindEquipmentId
      }
    });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};

export const optionsEquipmentControllers = async (
  ctx: TDefaultRouter<IOptionsEquipmentControllersReqParams>,
  next: TNext
) => {
  const { eid, option, optionJsonParams } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  if (!eid || !option || !optionJsonParams) return sendResponse.error(ctx, "传参缺失，请检查!");
  const eidList = userInfo.bindEquipmentId || [];
  if (!eidList.includes(eid)) return sendResponse.error(ctx, "您还未绑定该设备!");

  try {
    const equipmentInfo = await equipmentModel.collection.findOne({ eid }) as unknown as IEquipment;
    if (!equipmentInfo) return sendResponse.error(ctx, "设备不存在!");
    const optionsParams = JSON.parse(optionJsonParams);
    EQUIPMENT_OPTIONS_MAP[equipmentInfo.type]?.[option as EEquipmentOptions]?.(optionsParams, equipmentInfo.clientId, eid);
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
};


//  管理员创建设备, 暂时写死权限
export const adminCreateEquipmentControllers = async (
  ctx: TDefaultRouter<IAdminCreateEquipmentControllersReqParams>,
  next: TNext
) => {
  const { account, password, type } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  // 暂时写死权限
  if (userInfo.email !== '471087639@qq.com') return sendResponse.error(ctx, "权限不足");
  try {
    const count = await equipmentModel.collection.count();
    await equipmentModel.collection.insertOne({
      ...getDefaultEquipment(),
      eid: `${new Date().getTime()}-${count+1}`,
      account,
      password,
      type,
    });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}

//  管理员删除设备, 暂时写死权限
export const adminDelEquipmentControllers = async (
  ctx: TDefaultRouter<IAdminDelEquipmentControllersReqParams>,
  next: TNext
) => {
  const { eid } = ctx.request.body || {};
  const userInfo = await checkLogin(ctx, next);
  if (!userInfo) return sendResponse.error(ctx, "", EReqStatus.noLogin);
  // 暂时写死权限
  if (userInfo.email !== '471087639@qq.com') return sendResponse.error(ctx, "权限不足");
  try {
    const equipmentInfo = await equipmentModel.collection.findOne({ eid });
    if (!equipmentInfo) return sendResponse.error(ctx, "设备不存在!");
    await equipmentModel.collection.deleteOne({ eid });
    return sendResponse.success(ctx);
  } catch (err) {
    return sendResponse.error(ctx, JSON.stringify(err));
  }
}

