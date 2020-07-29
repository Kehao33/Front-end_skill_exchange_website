### 一、操作环境与启动项目：

操作环境：mongodb+npm+node 环境

启动项目：
yarn server; //启动服务
yarn start; //启动项目

### 二、技术栈：

React.js + Ant Design + MongoDB + Redux

注意: 登录用户是 userObj,用来登录状态信息

## 遇到问题：

- 前后端联调： 解决端口不一致的方法，使用 proxy 配置转发
- 默认的登录信息从 sessionStorage 中取，解决状态可变问题
- setState`同步`与`异步`问题,其实不是真的 异步
  - 解决： 后来逛博客，看到了一篇名为"你真的理解 setState 吗?"中 get 了解答，setState 的异步不是真的异步，而是因为合成事件和钩子函数的调用顺序在更新之前，导致了合成事件和钩子函数中没法立即得到更新后的值，所以就成了所谓的异步

## 心得

1. 在 React.js 中最好使用简洁的 Hooks，不要滥用状态组件
2. 对库或者是功能进行封装管理、便于统一管理
3. 了解底层，更能够很快的解决 bug 和其原理，使用起来也印象深刻,比如setState的'异步'为啥子会这样，这个跟React的调用栈有关



###  预览效果图：

![](C:\Users\jake\Desktop\img\jianli1.png)



![](C:\Users\jake\Desktop\img\jianli2.png)



![](C:\Users\jake\Desktop\img\jianlifor.png)