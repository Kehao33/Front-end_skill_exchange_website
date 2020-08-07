// 用于拦截请求的

import axios from 'axios'
// import operUser from './tools'
import operUser from './tools'
import { message } from 'antd'

// 客户端拦截请求
axios.interceptors.request.use(function (config) {
  // console.log('正在请求数据中')
  console.log('requse config', config)

  // if (config.data.needLogin) {
  //   message.error('您无访问权限, 请登录进行操作')
  //   operUser.removeUser()
  // }
  return config
})

// 服务端拦截请求
axios.interceptors.response.use(function (config) {
  console.log('response interrceptors config: ', config)
  if (config.data.needLogin) {
    message.error('您无访问权限, 请登录进行操作')
    operUser.removeUser()
  }

  return config
})
