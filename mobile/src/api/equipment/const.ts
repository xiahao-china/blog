export enum EEquipmentStatus {
  unActive = 1,
  offline,
  online,
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
  wifiName: string;
  wifiPassword: string;
  substance: EEquipmentOptions;
  lastUseTime: number;
  extraInfo: string;
}

export interface IEquipmentSearchOnlineReqParams {
  pageSize: number;
  pageNumber: number;
  account: string;
}

export interface IEquipmentSearchOfflineRes {
  total: number;
  list: IEquipment[];
}

export interface IEquipmentOptionsReqParams {
  eid: string;
  option: EEquipmentOptions;
  optionJsonParams: string;
}

export interface IEquipmentDelReqParams {
  eid: string;
}

export interface IEquipmentAddReqParams {
  eid: string;
  password: string;
}
