const path = require("path");
const {fileURLToPath, URL, pathToFileURL} = require("node:url");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const postCssPxToRem = require("postcss-pxtorem");
const autoprefixer = require("autoprefixer");
const {VantResolver} = require("@vant/auto-import-resolver");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
const VConsolePlugin = require("vconsole-webpack-plugin");
const CompressionWebpackPlugin =  require('compression-webpack-plugin');

const isAnalyze = process.env.OPTION_TYPE === "analyze";
const isTest = process.env.OPTION_TYPE === "test";

const pluginList = [
  ComponentsPlugin({
    resolvers: [VantResolver()]
  }),
  new VConsolePlugin({enable: isTest}),
    new CompressionWebpackPlugin({
      filename: '[path][base].gz', // 提示compression-webpack-plugin@3.0.0的话asset改为filename
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
];

isAnalyze && pluginList.push(
  new BundleAnalyzerPlugin()
);

module.exports = {
  // lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: pluginList,
    resolve: {
      alias: {
        src: fileURLToPath(new URL("./src", pathToFileURL(__filename))),
      },
    },
  },
  outputDir: path.join(__dirname, "./activityDist"),
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
        },
        common: {
          name: "chunk-common",
          minChunks: 2,
          priority: -20,
          chunks: "initial",
          reuseExistingChunk: true,
        },
        "weixin-js-sdk": {
          name: "weixin-js-sdk",
          chunks: "all",
          test: /weixin-js-sdk\/index\.js/,
          enforce: true,
        },
      },
    });

    // 10k以下图片压缩以减少请求次数
    // config.module
    //   .rule("images")
    //   .use("url-loader")
    //   .tap(options => {
    //     console.log('options',options);
    //     options.limit = 1024 * 10;
    //     return options;
    //   });

    // config.module
    //   .rule("eslint")
    //   .use("eslint-loader")
    //   .loader("eslint-loader")
    //   .tap(options => {
    //     options.fix = true;
    //     return options;
    //   });

    config.plugins.delete("prefetch");
  },
  css: {
    loaderOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/globalStyle/reset.less";',
        javascriptEnabled: true /*这个可以解决less方法无法执行的问题*/,
        rewriteUrls: "all" /*这个解决字体图标无法显示的问题*/,
      },
    },
  },
  publicPath: "",
  devServer: {
    client: {
      overlay: false,
    },
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:31226",
        target: "http://jike.ink",
        // pathRewrite: {
        //   // 路径改写规则
        //   "^/api/": "/", // 以“^/xxx”为开头的改写为''/xxx
        // },
      },
      "/websocket": {
        target: "http://127.0.0.1:31228",
        // target: "http://jike.ink",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          // 路径改写规则
          "^/websocket": "/", // 以“^/xxx”为开头的改写为''/xxx
        },
        logger: console,
        logLevel: "debug",
        onProxyReqWs: function(proxyReq, req, res) {
          console.log('PROXY REQUEST:', proxyReq.method, proxyReq.path);
        },
        onProxyResWs: function(proxyRes, req, res) {
          console.log('PROXY RESPONSE:', proxyRes.statusCode);
        },
        onError: function(err, req, res) {
          console.log('PROXY ERROR:', err);
        }
      },
    },
  },
};

