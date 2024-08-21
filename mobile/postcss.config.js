const postCssPxToRem = require("postcss-pxtorem");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    postCssPxToRem({
      rootValue: 37.5, // 1rem的大小
      propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
      selectorBlackList: ["__vconsole"],
      exclude: new RegExp(`/toastui-editor.css`)
    }),
    autoprefixer()
  ]
}