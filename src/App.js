import React, { Component } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { message } from 'antd'
import { connect } from 'react-redux'

import './pages/common/common.less'
import Home from './pages/index/index.jsx'
import Header from './components/header/header.jsx'
import Dynamic from './pages/dynamic/dynamic.jsx'
import Register from './pages/register/register.jsx'
import Login from './pages/login/login.jsx'
import Resource from './pages/resource/resource.jsx'
import Algorithm from './pages/algorithm/algorithm.jsx'
import Article from './pages/article/article.jsx'
import UserCenter from './pages/userCenter/userCenter.jsx'
import AdminUser from './pages/admin/adminUser/adminUser.jsx'
import AdminArticle from './pages/admin/adminArticle/adminArticle.jsx'
import AdminEditArt from './pages/admin/adminEditArt/adminEditArt.jsx'
// import AdminUserInfo from './pages/admin/adminUserInfo/adminUserInfo.jsx'
import UserWrite from './pages/userWrite/UserWrite.jsx'
import Admin from './Admin.js'
import './common.less'

// // import Home from './pages/container/home'
class App extends Component {
  // componentDidUpdate() {
  //   const { userObj, history, location } = this.props
  //   const isLogin = userObj ? 1 : 0
  //   if (!isLogin && /user/g.test(location.pathname)) {
  //     message.warning('您未登录，请登录')
  //     // history.push('/login')
  //   } else if (
  //     isLogin &&
  //     userObj.userRole !== 'admin' &&
  //     /admin/g.test(location.pathname)
  //   ) {
  //     message.error('您的权限不够，系统默认跳转到首页')
  //     history.replace('/index')
  //   }
  // }
  render() {
    const { userObj } = this.props
    const isLogin = userObj ? 1 : 0
    return (
      <HashRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route path="/index" component={Home} />
            <Route path="/dynamic" component={Dynamic} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/resource" component={Resource} />
            <Route path="/algorithm" component={Algorithm} />

            <Route path="/article/:id" component={Article} />
            <Route
              path="/user"
              render={() =>
                //   <Switch>
                //     <Route path="/user/write" component={UserWrite} />
                //     <Route path="/user/:id" component={UserCenter} />
                //   </Switch>
                // )
                isLogin ? (
                  <Switch>
                    <Route path="/user/write" component={UserWrite} />
                    <Route path="/user/:id" component={UserCenter} />
                  </Switch>
                ) : (
                  <Redirect to="/login" push />
                )
              }
            />
            <Route
              path="/admin"
              render={() =>
                //   <Admin>
                //     <Switch>
                //       <Route path="/admin/user" component={AdminUser} />
                //       <Route path="/admin/article" component={AdminArticle} />
                //       <Route path="/admin/userinfo" component={AdminUserInfo} />
                //     </Switch>
                //   </Admin>
                // )
                isLogin && userObj.userRole === 'admin' ? (
                  <Admin>
                    <Switch>
                      <Route path="/admin/user" component={AdminUser} />
                      <Route path="/admin/article/:aid" component={AdminEditArt} />
                      <Route path="/admin/article" component={AdminArticle} />
                    </Switch>
                  </Admin>
                ) : (
                  <Redirect to="/login" push />
                )
              }
            />
            <Route
              exact
              path="/"
              render={() => <Redirect to="/index" push />}
            />
            {/* 错误处理页面,直接跳到主页*/}
            <Route render={() => <Redirect to="/index" push />} />
          </Switch>
        </div>
      </HashRouter>
    )
  }
}

export default connect((state) => state.user, {})(App)

// 完成路由拦截功能
// const routes = [
//   { path: '/index', exact: true, key: '/index', component: Home, auth: 0 },
//   {
//     path: '/dynamic',
//     exact: true,
//     key: '/dynamic',
//     component: Dynamic,
//     auth: 0,
//   },
//   {
//     path: '/register',
//     exact: true,
//     key: '/register',
//     component: Register,
//     auth: 0,
//   },
//   { path: '/login', exact: true, key: '/login', component: Login, auth: 0 },
//   {
//     path: '/resource',
//     exact: true,
//     key: '/resource',
//     component: Resource,
//     auth: 0,
//   },
//   {
//     path: '/algorithm',
//     exact: true,
//     key: '/algorithm',
//     component: Algorithm,
//     auth: 0,
//   },
//   {
//     path: '/article/:id',
//     exact: true,
//     key: '/article/id',
//     component: Article,
//     auth: 0,
//   },
//   {
//     path: '/user/write',
//     exact: true,
//     key: '/user',
//     component: UserWrite,
//     auth: 0,
//   },

//   {
//     path: '/user/:id',
//     exact: true,
//     key: '/user/id',
//     component: UserCenter,
//     auth: 1,
//   },
//   {
//     path: '/admin/user',
//     exact: true,
//     key: '/admin/user',
//     component: AdminUser,
//     auth: 1,
//   },
//   {
//     path: '/admin/article',
//     exact: true,
//     key: '/adim/article',
//     component: AdminArticle,
//     auth: 1,
//   },
//   {
//     path: '/admin/user-info',
//     exact: true,
//     key: '/admin/userinfo',
//     component: AdminUserInfo,
//     auth: 1,
//   },
// ]

// import Home from './pages/container/home'
// class App extends Component {
//   render() {
//     return (
//       <HashRouter>
//         <div className="App">
//           <Header />
//           <Switch>
//             {routes.map((item) => {
//               return (
//                 <Route
//                   path={item.path}
//                   exact={item.exact}
//                   key={item.key}
//                   component={item.auth && getRoute(item.path)}
//                 />
//               )
//             })}
//             {/* 错误处理页面,直接跳到主页*/}
//             <Route render={() => <Redirect to="/index" push />} />
//           </Switch>
//         </div>
//       </HashRouter>
//     )
//   }
// }

// // // 最原始版
// class App extends Component {
//   render() {
//     return (
//       <HashRouter>
//         <div className="App">
//             {/* <IsLogin /> */}
//           <Header />
//           <Switch>
//             <Route path="/index" component={Home} />
//             <Route path="/dynamic" component={Dynamic} />
//             <Route path="/login" component={Login} />
//             <Route path="/register" component={Register} />
//             <Route path="/resource" component={Resource} />
//             <Route path="/algorithm" component={Algorithm} />

//             <Route path="/article/:id" component={Article} />
//             <Route
//               path="/user/write"
//               component={UserWrite}
//             />
//             <Route
//               path="/user/:id"
//               component={UserCenter}
//             />
//             <Route
//               path="/admin"
//               render={() => (
//                 <Admin>
//                   <Switch>
//                     <Route path="/admin/user" component={AdminUser} />
//                     <Route path="/admin/article" component={AdminArticle} />
//                     <Route path="/admin/userinfo" component={AdminUserInfo} />
//                   </Switch>
//                 </Admin>
//               )}
//             />
//             {/* 错误处理页面,直接跳到主页*/}
//             <Route render={() => <Redirect to="/index" push />} />
//           </Switch>
//         </div>
//       </HashRouter>
//     )
//   }
// }

// export default App
