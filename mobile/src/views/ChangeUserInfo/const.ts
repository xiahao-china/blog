import { ESex, SEX_MAP } from "@/api/usr/const";

export const SEX_COLUMNS = Object.keys(SEX_MAP).map((item)=>{
  return ({
    text: SEX_MAP[parseInt(item) as ESex],
    value: parseInt(item) as ESex,
  })
})