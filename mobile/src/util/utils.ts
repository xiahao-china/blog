// 获取图片文件
export const getImgFiles = (url: String) => {
    return new URL(`../assets/${url}`, import.meta.url).href;
};
// 获取图标文件
// export const getIconFiles = (url: String) => {
//     return new URL(`../assets/icon/${url}`, import.meta.url).href;
// };