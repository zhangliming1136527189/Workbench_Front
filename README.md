# NC Cloud 工作台 &middot; ![node version](https://img.shields.io/badge/node-8.10.0-brightgreen.svg) ![npm version](https://img.shields.io/badge/npm-5.6.0-blue.svg)  ![webpack version](https://img.shields.io/badge/webpack-4.1.1-blue.svg)
## 浏览器兼容

## 演示地址
http://nccloud.netlify.com

## 描述
服务于 NC 各个模块节点页面，各模块节点挂载在工作台中实现整个节点页面的完整性。

## 功能描述
- 用户登录
- 用户信息
- 组织切换
- 首页可配置
- 首页部件可拖拽
- 挂载节点页面
- 主题切换
- 其他...

## 技术栈
react + redux + webpack + react-router + ES6/7/8

## 相关依赖
```javascript
// 项目基础依赖
"dependencies": {
    "axios": "^0.18.0",                 // 数据请求     https://github.com/axios/axios
    "prop-types": "^15.6.1",            // 类型校验     https://github.com/facebook/prop-types
    "react": "^16.2.0",                 
    "react-dom": "^16.2.0",                   
    "react-redux": "^5.0.7",            
    "react-router-dom": "^4.2.2",       // react router v4  https://reacttraining.com/react-router/
    "redux": "^3.7.2",
    "redux-thunk": "^2.2.0"             //  redux 异步 action 中间件  https://github.com/gaearon/redux-thunk
}
// 项目开发依赖
"devDependencies": {
    "autoprefixer": "^8.1.0",                           // css 兼容插件 
    "babel-core": "^6.26.0",                            // bale 核心包
    "babel-loader": "^7.1.4",                           
    "babel-plugin-syntax-dynamic-import": "^6.18.0",    // 按需加载插件
    "babel-plugin-transform-runtime": "^6.23.0",        // bable 依赖的工具函数插件
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "css-loader": "^0.28.10",
    "cssnano": "^3.10.0",                               // css 优化插件
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.0.6",
    "less": "^3.0.1",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.2.0",                // webpack4 下 extract-text-webpack-plugin 插件编译报错，替代品 https://github.com/webpack-contrib/mini-css-extract-plugin
    "postcss-loader": "^2.1.1",                         // css 兼容
    "react-loadable": "^5.3.1",                         // 懒加载 以组件为中心的代码分割和懒加载 https://github.com/jamiebuilds/react-loadable
    "style-loader": "^0.20.3",
    "react-intl-universal": "^1.8.4",                   // 国际化 
    "url-loader": "^1.0.1",
    "webpack": "^4.1.1",
    "webpack-cli": "^2.0.12",
    "webpack-dev-server": "^3.1.1"
}
```

## 源码目录结构
> 文件夹 src
```
├── assets                  // 项目媒体资源文件夹
|   ├── images              // 图片文件夹
|   └── iconfonts           // 图标字体文件夹
├── components              // 项目公共组件文件
|   ├── Loading             // loading 公共组件文件夹
|   |   ├── index.less      // loading 组件样式文件
|   |   └── index.js        // loading 组件文件
|   └── ...                 // 其他公共组件文件夹，其目录机构同 loading
├── layout                  // 项目基本布局
├── pages                   // 项目页面文件夹
|   ├── home                // 项目首页
|   |   ├── index.less      // 首页样式
|   |   └── index.js        // 首页页面文件
|   └── ...                 // 其他页面，其目录结构同首页
├── store                   // 项目 store 文件夹
|   ├── home                // 首页 store 
|   |   ├── action-type.js  // 首页 action-type 文件
|   |   ├── action.js       // 首页 action 文件
|   |   └── reducer.js      // 首页 reducer 文件
|   ├── ...                 // 其他页面 store 文件夹，其目录结构同首页 store 文件夹
|   └── index.js            // 项目整体 reducer 文件
├── routes.js               // 项目路由配置文件
├── app.js                  // 项目入口文件
└── index.html              // 项目 HTML 模板
```

## 启动 (开发模式)
```
git clone https://github.com/glud123/demo-main.git

cd demo-main

npm i

npm run dev

```

## 打包构建 (生产模式)
```
npm run build
```
## 开发规范
> ## 命名规则
> 局部变量
> 对象和数组
> 方法命名
> 组件之间的通信
