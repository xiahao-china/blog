export const LINEAR_GRADIENT_MAP = [
  "linear-gradient(#e66465, #9198e5)",
  "linear-gradient(to right, #9fe1fa, #f4edc9)",
  "linear-gradient(to top right, rgb(238, 163, 175), rgb(149, 214, 240))",
  "linear-gradient(111.4deg, rgb(238, 113, 113) 1%, rgb(246, 215, 148) 58%)",
  "linear-gradient(102.7deg, rgb(253, 218, 255) 8.2%, rgb(223, 173, 252) 19.6%, rgb(173, 205, 252) 36.8%, rgb(173, 252, 244) 73.2%, rgb(202, 248, 208) 90.9%)",
  "linear-gradient(58.2deg, rgba(40, 91, 212, 0.73) -3%, rgba(171, 53, 163, 0.45) 49.3%, rgba(255, 204, 112, 0.37) 97.7%)",
  "linear-gradient(181.2deg, rgb(181, 239, 249) 10.5%, rgb(254, 254, 254) 86.8%)",
  "linear-gradient(107.7deg, rgb(101, 168, 143) -30.7%, rgb(144, 220, 193) 7.2%, rgb(225, 203, 150) 31.3%, rgb(251, 166, 150) 82.6%, rgb(250, 54, 65) 128.5%)",
  "linear-gradient(111.4deg, rgb(209, 231, 235) 7.4%, rgb(238, 219, 199) 51.4%, rgb(255, 159, 122) 82.6%, rgb(255, 109, 58) 100.2%)",
  "linear-gradient(109.6deg, rgb(101, 58, 150) 29.9%, rgb(168, 141, 194) 99.9%)",
  "linear-gradient(106.5deg, rgba(255, 215, 185, 0.91) 23%, rgba(223, 159, 247, 0.8) 93%)",
  "linear-gradient(109.6deg, rgb(0, 51, 102) 11.2%, rgb(187, 187, 187) 91.1%)",
  "linear-gradient(103.3deg, rgb(252, 225, 208) 30%, rgb(255, 173, 214) 55.7%, rgb(162, 186, 245) 81.8%)",
  "linear-gradient(110.6deg, rgb(179, 157, 219) 7%, rgb(150, 159, 222) 47.7%, rgb(24, 255, 255) 100.6%)",
];

export interface ICoverKeyInfo {
  linearGradient: string;
  keyWord: string;
}

export const extractCoverKeyInfo = (str: string): ICoverKeyInfo => {
  const encodingAry = new TextEncoder().encode(str[0]);
  const calVal = Math.ceil(
    encodingAry.reduce((pre, cur) => pre + cur, 0) / encodingAry.length
  );
  const mapIndex = calVal % LINEAR_GRADIENT_MAP.length;
  let matchEnKeyWord = str.match(/([A-z]|-)+/)?.[0] || "";
  if (!matchEnKeyWord)
    matchEnKeyWord = str.match(/([\u4e00-\u9fa5])+/)?.[0] || "";
  if (!matchEnKeyWord) matchEnKeyWord = str.slice(0, 4);
  return {
    linearGradient: LINEAR_GRADIENT_MAP[mapIndex],
    keyWord: matchEnKeyWord,
  };
};
