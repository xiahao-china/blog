import { isMobile } from "@/util";
import Quill from 'quill'

type TQuillContext = {
  quill: Quill;
}
export interface IToolBarSelectItem {
  label: string;
  value: string;
  isDefault?: boolean;
}

const DEFAULT_FONT_SIZE = isMobile ? 14 : 15;
const SIZE_MIN = 8;
const SIZE_MAX = 24;

const createSizeSelectList = (
  minLimit: number,
  maxLimit: number
):{
  list: IToolBarSelectItem[];
  whitelist: string[];
} => {
  const resList = [];
  for (let i = minLimit; i <= maxLimit; i++) {
    resList.push({
      label: DEFAULT_FONT_SIZE === i ? '默认' :`${i}pt`,
      value: DEFAULT_FONT_SIZE === i  ? '' : `${(i / 37.5).toFixed(2)}rem`,
      isDefault: DEFAULT_FONT_SIZE === i,
    });
  }
  return {
    list: resList,
    whitelist: resList.map((item) => item.value),
  };
};
export const FONT_SIZE_SELECT_LIST = createSizeSelectList(SIZE_MIN,SIZE_MAX);

export const EDITOR_OPTIONS = {
  size: function(value: boolean | string){
    if (value){
      if(FONT_SIZE_SELECT_LIST.list.find((item)=>item.value === value)?.isDefault){
        (this as unknown as TQuillContext).quill.format('size', '');
      }
      (this as unknown as TQuillContext).quill.format("size", value);
    }else {
      (this as unknown as TQuillContext).quill.format('size', '');
    }
  }
};
