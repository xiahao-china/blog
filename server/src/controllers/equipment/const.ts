import { EEquipmentOptions, EEquipmentType, IEquipment } from "@/models/equipment";
import { IPageReqBase } from "@/routes/api/const";
import { aedesObj } from "@/lib/mqtt";
import { IObject } from "@/utils/const";
import { lightingOptionControllers } from "@/controllers/mqttSwitch";



export type IEquipmentOptionsItem = {
  [key in EEquipmentOptions]: (params: IObject, clientId: string) => void;
};

export const EQUIPMENT_OPTIONS_MAP: { [key in EEquipmentType]: IEquipmentOptionsItem } = {
  [EEquipmentType.switch]: {
    [EEquipmentOptions.lighting]: (params, clientId) => {
      lightingOptionControllers(aedesObj, params.status ? 'cmd:ON;': 'cmd:ON;', clientId)
    }
  }
};


export interface IEquipmentSearchOnlineControllersReqParams extends IPageReqBase {
  account: string;
}

export interface IAddEquipmentControllersReqParams {
  eid: string;
  wifiPassword: string;
}

export interface IDelEquipmentControllersReqParams {
  eid: string;
}

export interface IOptionsEquipmentControllersReqParams {
  eid: string;
  option: EEquipmentOptions;
  optionJsonParams: string;
}

export interface IAdminCreateEquipmentControllersReqParams {
  account: string;
  password: string;
  type: EEquipmentType;
}

export const EQUIPMENT_BASE_RES_KEY_LIST: (keyof IEquipment)[] = [
  "eid",
  "status",
  "type",
  "wifiName",
  "account",
  "lastUseTime",
  "substance"
];