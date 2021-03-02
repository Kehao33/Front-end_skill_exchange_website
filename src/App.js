import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

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
import AdminComment from './pages/admin/adminComment/AdminComment'
import './pages/common/common.less'
import './interceptors'
// import AdminEditArt from './pages/admin/adminEditArt/adminEditArt.jsx'
// import AdminUserInfo from './pages/admin/adminUserInfo/adminUserInfo.jsx'
import UserWrite from './pages/userWrite/UserWrite.jsx'
import Admin from './Admin.js'
import Rss from './pages/rss/Rss.jsx'
import FrontCircle from './pages/frontCircle/FrontCircle.jsx'

// // import Home from './pages/container/home'
class App extends Component {
  // componentDidUpdate() {
  //   const { userObj, location } = this.props
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
  //     // history.replace('/index')
  //   }
  // }
  render() {
    const { userObj } = this.props
    const isLogin = userObj ? 1 : 0
    return (
      <Router>
        <div className="app">
          <Header />
          <Switch>
            <Route path="/index" component={Home} />
            <Route path="/dynamic" component={Dynamic} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/resource" component={Resource} />
            <Route path="/algorithm" component={Algorithm} />
            <Route path="/rss" component={Rss} />
            <Route path="/frontCircle" component={FrontCircle} />
            <Route path="/article/:id" component={Article} />
            <Route
              path="/user"
              render={() =>
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
                // 后期可能会加入新的模块和功能
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
                      {/* <Route path="/admin/article/:aid" component={AdminEditArt} /> */}
                      <Route path="/admin/article" component={AdminArticle} />
                      <Route path="/admin/comment" component={AdminComment} />
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
      </Router>
    )
  }
}

export default connect((state) => state.user, {})(App)
