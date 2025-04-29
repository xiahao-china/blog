// 获取图片文件
export const getImgFiles = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

export const calcSizeBase375 = (size: number) => {
  return (document.documentElement.clientWidth / 375) * size;
};

export const copyText = (str: string) => {
  const input = document.createElement('input');
  input.setAttribute('value', str);
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

// 获取图标文件
// export const getIconFiles = (url: String) => {
//     return new URL(`../assets/icon/${url}`, import.meta.url).href;
// };