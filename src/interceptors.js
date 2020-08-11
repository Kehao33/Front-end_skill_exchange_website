// 用于拦截请求的

import axios from 'axios'
// import operUser from './tools'
import operUser from './tools'
import { message } from 'antd'
// import {logOutUser} from './redux/user.redux'

// 客户端拦截请求
axios.interceptors.request.use(function (config) {
  let verif_url = new RegExp(config.url, 'g')
  if (
    (verif_url && verif_url.test('/user')) ||
    (verif_url && verif_url.test('/admin'))
  ) {
    if (config.data && config.data.needLogin) {
      // logOutUser()
      message.error('您无访问权限, 请登录进行操作')
    }
  }
  return config
})

// 服务端拦截请求
axios.interceptors.response.use(function (config) {
  let cheack = config && config.config
  // let verif_url = cheack && cheack.url
  let verif_url = new RegExp(cheack && cheack.url, 'g')

  if (
    (verif_url && verif_url.test('/user')) ||
    (verif_url && verif_url.test('/admin'))
  ) {
    if (config.data && config.data.needLogin) {
      operUser.removeUser()
      // logOutUser()
      message.error('您无访问权限, 请登录进行操作')
    }
  }
  return config
})
