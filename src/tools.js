// 这里用于写一些常见的 工具操作函数
// store主要用来实现localStorage保存数据持久化，并且兼容性所有浏览器
// import localStore from 'store'
import store from 'store2'
import axios from 'axios'
import { message } from 'antd'

/* 
  根据用户的类型，来实现跳转网页地址
  如果是超级用户admin,就跳转地址就是url='/admin/user'
  如果是一般用户normal, 跳转地址就是'user/center',该页面可以实现用户编写文章
*/

var memoryUser = {
  user: {}, //保存当前登录用户在内存中
}

// 以下对象用来操作用户信息，实现持久化
const USER_INFO = 'USER_INFO'

var operUser = {
  // 保存 用户的基本信息
  saveUser(userObj) {
    store.session(USER_INFO, userObj)
  },

  // 获取 用户的基本信息
  getUser() {
    return store.session.get(USER_INFO)
  },

  // 移除用户， 删除用户基本信息
  removeUser() {
    store.session.remove(USER_INFO)
  },
}
// var operUser = {
//   // 保存 用户的基本信息
//   saveUser(userObj) {
//     localStore.set(USER_INFO, userObj)
//   },

//   // 获取 用户的基本信息
//   getUser() {
//     return localStore.get(USER_INFO)
//   },

//   // 移除用户， 删除用户基本信息
//   removeUser() {
//     localStore.remove(USER_INFO)
//   },
// }

function getRedirectPath(loginUser, isRegisterOrLogout) {
  // 如果在注册成功，或者是退出登录， 则跳转到登录页面
  if (isRegisterOrLogout) {
    return '/login'
  }
  // 如果用户角色，不存在，返回null
  if (!loginUser && JSON.stringify(loginUser) === '{}') return ''
  return loginUser.userRole === 'admin'
    ? `/admin/user`
    : `/user/${loginUser._id}`
}

// 封装axios，请求数据
// 返回是一个promise对象，错误统一处理
function $http(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      // 发送get请求
      promise = axios.get(url, {
        // 配置对象
        params: data, //之情请求参数
      })
    } else {
      //发送post请求
      promise = axios.post(url, data)
    }

    // 如果成功，就调用resolve(res),res为后台返回的数据
    promise
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        // 如果请求失败，统一处理错误请求提醒
        message.error('请求出错: ' + err.message)
      })
  })
}

function formatDate(dataStr) {
  return dataStr.substr(0, dataStr.indexOf('T'))
}

export { getRedirectPath, memoryUser, $http, formatDate }
export default operUser
