启动项目： 在根目录下操作
node server/server.js 开启服务
yarn start  启动项目


## 注意，登录用户是userObj， 非登录用户的信息是 user

## 遇到问题：
  前后端联调： 解决端口不一致的方法，使用proxy配置转发


## 使用的插件
reducer: 新建store， 随时通过store.getState获取状态

需要状态变更的时候：store.dispatch(action)来更改状态

Reducer函数接受state和action，返回新的state，可以用store.subscribe监听每次修改

Redux和React一起使用：把store.dispatch方法传递给组件，内部可以修改状态
SubScribe订阅render函数，每次修改都重新渲染
Redux相关内容，移动到单独的文件中：xxx.redux.js

Redux处理异步：需要借助redux-thunk插件
react-readux优雅的连接react和redux
+
react-redux:通过提供Provider和connect两个接口来连接
provider可以让你忘记subscribe，记住reducer，action和dispatch
connect复制从外部获取组件需要的参数

connect需要传递两个参数，第一个是需要的state数据，第二个是所需要的action，使用这个api连接后，他会将所需的数据和action自动加入props里边
···javascript
  const mapStateProps = (state) => {
    return {num: state}
  }
  const actionCreators = {addAction, removeAction};
  YourConpoent = conenct(mapStateProps, actionCreators);
···


基于cookie用户验证
express依赖cookie-parser, 登录后服务端返回，你带着cookie就可以访问受限资源了


 