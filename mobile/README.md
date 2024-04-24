# yangyang-activity-mobile (洋洋语音活动工程)

### 前置环境依赖
```
node v16.20.2
pnpm
```

### 使用
```
pnpm i
pnpm run serve
```

### 构建
```
pnpm run build
```

### Lints and fixes files
```
pnpm run lint
```

-------

## 开发规范

* 文件结构为
```
src/api: 统一请求包装
src/assets: 静态文件内容，包括图片，全局样式配置
src/components: 公用组件
src/router: 路由
src/store: 状态管理
src/view: 具体页面文件
```
* 声明规范
```
Ixxxxx: 形如interface Ixxxxx的接口声明需要以I开头
Txxxxx: 形如type Txxxxx的接口声明需要以T开头
```

## 其他注意
* ios在接口错误时会直接抛出提示，安卓则需要前端处理，coding时请注意差异，屏蔽ios的接口后续处理，仅处理成功