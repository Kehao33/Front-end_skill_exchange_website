# 前端技术交流网站 
###  预览效果图：
  你需要访问：https://quankehao.gitee.io/qstationview/
  这只是一个静态的网页，呈现出网站的一部分
 

### 操作环境与启动项目：

操作环境：mongodb+npm+node 环境

启动项目：
yarn server; //启动服务
yarn start; //启动项目

### 技术栈：

React.js + Ant Design + MongoDB + Redux

注意: 登录用户是 userObj,用来登录状态信息

## 遇到问题：

- 前后端联调： 解决端口不一致的方法，使用 proxy 配置转发【开发环境】，如果是生产环境需要使用其他方法，如nginx
- 默认的登录信息从 sessionStorage 中取，解决状态可变问题
- setState`同步`与`异步`问题,其实不是真的 异步
  - 解决： 后来逛博客，看到了一篇名为"你真的理解 setState 吗?"中 get 了解答，setState 的异步不是真的异步，而是因为合成事件和钩子函数的调用顺序在更新之前，导致了合成事件和钩子函数中没法立即得到更新后的值，所以就成了所谓的异步
- 当管理员删除普通用户的时候，没有删除对应的评论/文章，在渲染文章或者是评论的时候没有逻辑判断导致用户信息渲染错误

## 心得

1. 在 React.js 中最好使用简洁的 Hooks，不要滥用状态组件
2. 对库或者是功能进行封装管理、便于统一管理
3. 了解底层，更能够很快的解决 bug 和其原理，使用起来也印象深刻,比如setState的'异步'为啥子会这样，这个跟React的调用栈有关.
4. 各种分析要到位，当使用到一个对象的时候，要判断其是否为空，如果为空访问数据当然会报错【正如java中的空指针异常】
5. 这个个人作品还是花费了我很多的时间，开始写的时候刚刚Ant Design 4.0问世，于是就直接用上了antd4，发现真的很好用，但是好用也存在着局限的问题，如当你要修改他的样式的时候，你得在打开调试工具，然后找到对应的类，然后在修改，总的来说antd修改样式有点繁琐，但也可以接受；后台使用express来写的，写完后发现了koa真的很好用，代码看起来比express简单多了，当然基于koa的egg.js也是很棒，以后会好好琢磨koa或者egg的；对sessionStorage的理解更深了，或者是说对会话级别的存储有了更深的了解，因为我在使用用户信息保存的时候，我开始使用的便是sessionStorage，后来发现了一个bug，就是当使用右键点击新窗口打开的时候会丢失信息，所以后来便换成了localStorage

