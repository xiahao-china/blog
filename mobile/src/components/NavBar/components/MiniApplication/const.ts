export interface IDropdownSelectOptions {
  text: string;
  value: string;
  icon?: string;
  iconUrl?: string;
}

export const DROPDOWN_SELECT_OPTIONS: IDropdownSelectOptions[] = [
  {
    text: "我的设备",
    value: "MyEquipment",
    icon: "icon-shebei",
  },
  {
    text: "OTA管理",
    value: "OTAProjectManage",
    icon: "icon-OTAshengjiweixuanzhong",
  },
  {
    text: "tinyPng 图片压缩",
    value: "https://tinypng.com/cn/",
    iconUrl: require("@/assets/staticImg/common/tinyPngLogo.png"),
  },
  {
    text: "青泥科研废物导航",
    value: "https://www.qingnixueshu.top/",
    iconUrl: "https://www.qingnixueshu.top/uploadfile/202312/fde68cb53e26281.png",
  },
  // { text: "其他", value: "Gadget" },
];
