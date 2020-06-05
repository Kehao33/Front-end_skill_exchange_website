import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { message } from 'antd'

@withRouter //@withRouter的作用是是普通的组件都拥有history属性
@connect((state) => state.user, {})
class IsLogin extends Component {
  async componentDidMount() {
    // 需要验证的路由
    const needAuth = /(\/user)|(\/admin)/g
    const { userObj, location, history } = this.props
    const pathname = location.pathname
    // 如果是登录，或者注册页面了，就返回null
    console.log('pathname: ', pathname)
    if (needAuth.test(pathname)) {
      if (!userObj) {
        message.warning('您的访问权限不够,请登录')
        history.push('/login')
      } else if (/admin/g.test(pathname)) {
        if (userObj && userObj.userRole !== 'admin') {
          message.warning('您的访问权限不够,默认跳转到首页')
          history.push('/index')
        }
      }
    }
  }

  render() {
    return null
  }
}

export default IsLogin
