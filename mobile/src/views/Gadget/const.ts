export enum ETurningDirection {
  left = 1,
  right
}

export enum EGadget {
  dice = 1,
  fictionCrawler,
  timeShifting,
}

export interface IGadgetMapItem {
  gadget: EGadget;
  path: string;
  title: string;
  subTitle: string;
  coverImg: string;
  cardBgColor: string;
  bgColor: string;
  iconName: string;
}

export const GADGET_MIN = Math.min(...Object.keys(EGadget).map((item)=>parseInt(item)).filter((item)=>!isNaN(item)));
export const GADGET_MAX = Math.max(...Object.keys(EGadget).map((item)=>parseInt(item)).filter((item)=>!isNaN(item)));

export const GADGET_MAP: { [key in EGadget]: IGadgetMapItem } = {
  [EGadget.dice]: {
    gadget: EGadget.dice,
    path: '/Dice',
    title: '随机骰子',
    subTitle: '自定义投掷点数与内容，解决选择困难',
    coverImg: require("@/assets/staticImg/gadget/dice.png"),
    cardBgColor: '#1f1f1e',
    bgColor: '#111111',
    iconName: 'icon-touzi',
  },
  [EGadget.fictionCrawler]: {
    gadget: EGadget.fictionCrawler,
    path: '/FictionCrawler',
    title: '小说爬虫',
    subTitle: '爬取站点小说下载txt，解决获取资源',
    coverImg: require("@/assets/staticImg/gadget/dice.png"),
    cardBgColor: '#1a1a19',
    bgColor: '#111111',
    iconName: 'icon-touzi',
  },
  [EGadget.timeShifting]: {
    gadget: EGadget.timeShifting,
    path: '/TimeShifting',
    title: '时间转换',
    subTitle: '快速选择转换，计算您要的时间',
    coverImg: require("@/assets/staticImg/gadget/dice.png"),
    cardBgColor: '#1a1a19',
    bgColor: '#111111',
    iconName: 'icon-touzi',
  },
}

export const TURNING_DIRECTION_CLASS_MAP : {[key in ETurningDirection]: string} = {
  [ETurningDirection.left]: 'turningLeft',
  [ETurningDirection.right]: 'turningRight',
}