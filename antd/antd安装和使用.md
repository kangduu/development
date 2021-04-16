### 安装并使用

使用 npm 或 yarn 安装

```npm
npm install antd --save
cnpm install antd --save
```

```npm
yarn add antd	
```

在index.js中写入

```js
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
//在所有import语句之后调用
moment.locale('zh-cn');
```

