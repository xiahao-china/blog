import { ESCAPED_CHARS_LIST } from "@/const/common";

export const formatNumToWan = (val?: number) => {
  if (!val && (val === undefined || val === null)) return "";
  if (val >= 10000) {
    const turnVal = (val / 10000).toString().split(".");
    const hasDecimal = turnVal[1] && turnVal[1][0] && turnVal[1][0] !== "0";
    return `${turnVal[0]}${hasDecimal ? "." : ""}${
      hasDecimal ? turnVal[1][0] : ""
    }W`;
  }
  return val.toString();
};

export const limitRange = (range: number, max: number, min: number) => {
  if (range > max) return max;
  if (range < min) return min;
  return range;
};

export const splitStringByLength = (length: number, inputString: string) => {
  // 将字符串按指定长度分割
  const chunks = inputString.match(new RegExp(`.{1,${length}}`, "g"));
  if (!chunks) return inputString;
  // 使用空格连接分割后的数组元素
  const result = chunks.join(" ");
  return result;
};

export const numberToChinese = (inputNum?: number | string): string => {
  if (!inputNum) return "";
  let num = parseInt(inputNum.toString());
  const chineseNumbers: string[] = [
    "",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const unitNames: string[] = ["", "十", "百", "千"];

  if (num === 0) {
    return "零";
  }

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    const digit = num % 10;
    if (digit > 0) {
      if (unitIndex === 1 && digit === 1)
        result = unitNames[unitIndex] + result;
      else result = chineseNumbers[digit] + unitNames[unitIndex] + result;
    } else if (result.length > 0 && result[0] !== "零") {
      // 添加零，避免出现两个连续的零
      result = "零" + result;
    }

    unitIndex++;
    num = Math.floor(num / 10);
  }

  return result;
};

export const formatEscapedChars = (str: string) => {
  let handleStr = str;
  Object.keys(ESCAPED_CHARS_LIST).forEach((key) => {
    if (handleStr.includes(key)) {
      handleStr = handleStr.replaceAll(key, ESCAPED_CHARS_LIST[key]);
    }
  });
  return handleStr;
};
