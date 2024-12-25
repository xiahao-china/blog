import mongoose from "mongoose";
import { IObject } from "@/utils/const";

const Schema = mongoose.Schema;

export enum EEquipmentStatus {
  unActive = 1,
  offline,
  online
}

export enum EEquipmentType {
  switch = 1,
}

export enum EEquipmentOptions {
  lighting = "lighting",
}

export interface ISwitchEquipmentExtraInfo {
  isOpen: false;
}

export interface IEquipment {
  eid: string;
  clientId: string;
  account: string;
  password: string;
  status: EEquipmentStatus;
  type: EEquipmentType;
  substance: EEquipmentOptions;
  wifiName: string;
  wifiPassword: string;
  lastUseTime: number;
  extraInfo: string;
}

export const getDefaultEquipment = (): IEquipment => {
  return {
    eid: "",
    clientId: "",
    account: "",
    password: "",
    status: EEquipmentStatus.unActive,
    type: EEquipmentType.switch,
    substance: EEquipmentOptions.lighting,
    wifiName: "",
    wifiPassword: "",
    lastUseTime: 0,
    extraInfo: JSON.stringify({})
  };
};

const equipmentSchema = new Schema({
  eid: String,
  clientId: String,
  account: String,
  password: String,
  status: Number,
  type: Number,
  wifiName: String,
  wifiPassword: String,
  substance: String,
  lastUseTime: Number,
  extraInfo: String
});

//   要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数：
export default mongoose.model("equipment", equipmentSchema);
