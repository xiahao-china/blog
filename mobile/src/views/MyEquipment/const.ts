import {
  EEquipmentOptions,
  EEquipmentStatus,
  EEquipmentType,
} from "@/api/equipment/const";

export interface IEquipmentSubstanceInfoMapItem {
  name: string;
  icon: string;
}

export const EQUIPMENT_SUBSTANCE_INFO_MAP: {
  [key in EEquipmentOptions]: IEquipmentSubstanceInfoMapItem;
} = {
  [EEquipmentOptions.lighting]: {
    name: "灯光开关",
    icon: "icon-lightbulb",
  },
};

export const EQUIPMENT_STATUS_INFO_MAP = {
  [EEquipmentStatus.unActive]: {
    text: "未激活",
    color: "rgb(140, 140, 140)"
  },
  [EEquipmentStatus.offline]: {
    text: "不活跃",
    color: "rgb(211, 72, 101)"
  },
  [EEquipmentStatus.online]: {
    text: "在线",
    color: "rgb(7,193,96)"
  },
};
