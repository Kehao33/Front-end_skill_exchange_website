// 用于拦截请求的

import axios from 'axios'
// import operUser from './tools'
import operUser from './tools'
import { message } from 'antd'

// 客户端拦截请求
axios.interceptors.request.use(function (config) {
  let verif_url = new RegExp(config.url, 'g')
  // let user = operUser.getUser()
  // if (verif_url && verif_url.test('/user')) {
  //   if (user && user.userRole) return config
  //   else message.error('你的操作不正确，需要登录，或重新登录')
  //   return config
  // } else if (verif_url && verif_url.test('/admin')) {
  //   if (user && user.userRole && user.userRole.indexOf('admin') > -1)
  //     return config
  //   else message.error('你的操作不正确，或者权限不够，或重新登录')
  //   return config
  // }
  if (
    (verif_url && verif_url.test('/user')) ||
    (verif_url && verif_url.test('/admin'))
  ) {
    if (config.data && config.data.needLogin) {
      operUser.removeUser()
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
      message.error('您无访问权限, 请登录进行操作')
    }
  }
  return config
})
