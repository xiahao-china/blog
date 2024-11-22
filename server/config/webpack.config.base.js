const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const serverConfig = require('../../serverConfig.js');

const webpackConfig = {
  target: 'node', // koa项目仅在node环境下运行，因此设置称'node'
  entry: {
    // 设置入口文件
    server: path.join(__dirname, '../src/index.ts')
  },
  output: {
    // 设置打包后的文件和位置
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist')
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js|ts$/,
        use: {
          loader: 'babel-loader'
        },
        // 尽量将 loader 应用于最少数量的必要模块，因此设置include
        // 只针对该目录下的js文件进行babel处理
        include: [path.join(__dirname, '../src')]
      }
    ]
  },
  resolve: {
    // modules: 告诉webpack哪些目录需要搜索去匹配解析
    modules: [path.join(__dirname, '../src/index.ts'), 'node_modules'],
    // extensions: 告诉webpack这些后缀文件需要去搜索匹配
    extensions: ['.ts', '.js', '.json', '.mjs'],
    alias: {
      // 设置别名指向对应目录
      '@': path.join(__dirname, '../src')
    }
  },
  plugins: [
    new CleanWebpackPlugin(), // 打包前清除输出目录
    new webpack.DefinePlugin({
      // 定义环境变量，区分开发和生产环境
      // 具体详情可查看DefinePlugin文档
      'process.env.NODE_ENV':
        process.env.NODE_ENV === 'production'
          ? JSON.stringify('production')
          : JSON.stringify('development'),
      'process.env.serverConfig': JSON.stringify({
        ngRootPath: serverConfig.ngRootPath,
        ngFilesName: serverConfig.ngFilesName,
        mailAuthPass: serverConfig.mailAuthPass,
        aliAccessKeyId: serverConfig.aliAccessKeyId,
        aliAccessKeySecret: serverConfig.aliAccessKeySecret,
      }),
    })
  ],
  externals: [nodeExternals()], // 排除对node_modules里的依赖进行打包
  // node下这些选项可以使最初为Node.js环境编写的代码，在其他环境（如浏览器）中运行
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackConfig
