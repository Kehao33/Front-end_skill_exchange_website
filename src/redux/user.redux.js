import { message } from 'antd'
import operUser, { getRedirectPath } from '../tools'
import {
  reqRegister,
  reqLogin,
  reqModifyUser,
  reqLogOut,
} from './../requestAPI/operHttp'

// action
const LOGIN_SUCCESS = 'LOGIN_SUCCESS' //登录成功
const USER_MODIFY = 'USER_MODIFY' //用户中心 完善信息
const MODIFY_USER = 'MODIFY_USER'
const REGISTER_SUCCESS = 'REGISTER_SUCCESS' // 注册成功
const USER_LOGOUT = 'USER_LOGOUT' //用户退出
const ERROR_MSG = 'ERROR_MSG' //错误处理
let userRole = '' // 根据用户角色来实现注册成功和登录成功的页面跳转
let isRegisterOrLogout = false

const initState = {
  redirectTo: operUser.getUser(),
  userObj: operUser.getUser(),
}

export function user(state = initState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    case USER_LOGOUT:
      return { ...state, ...action.payload }

    // 用户完善信息，如果是头部的userObj和userCenter页面的相同，那就同步该更新数据
    case USER_MODIFY:
      return { ...state, ...action.payload }
    case MODIFY_USER:
      return { ...state, ...action.payload }
    case ERROR_MSG:
      return { ...state, isAuth: false, msg: action.msg }
    default:
      return { ...state }
  }
}

function userModify(obj) {
  return { type: MODIFY_USER, payload: obj }
}

function errorMsg(msg) {
  return { msg, type: ERROR_MSG }
}
//  action creater
function registerSuccess(obj) {
  return { type: REGISTER_SUCCESS, payload: obj }
}
// login success creater
function loginSuccess(loginfo) {
  return { type: LOGIN_SUCCESS, payload: loginfo }
}
// 用户注册使用
export function register(userObj) {
  const { nickName, userEmail, userPwd, confirmPwd } = userObj
  if (!nickName || !userEmail || !userPwd || !confirmPwd) {
    return errorMsg('请输入相关注册数据')
  } else if (userPwd !== confirmPwd) {
    return errorMsg('请确两次输入密码一致')
  }
  return async (dispatch) => {
    const { data } = await reqRegister(userObj)
    // const res = await axios.post('/pubic/register', userObj)
    if (data.isOk) {
      // 如果后台操作成功，则派发一个action
      userRole = ''
      isRegisterOrLogout = true
      message.success('注册成功, 跳转到登录页面...')
      dispatch(
        registerSuccess({
          redirectTo: getRedirectPath(userRole, isRegisterOrLogout),
        })
      )
    } else {
      userRole = ''
      dispatch(errorMsg(data.msg))
      message.error(data.msg)
    }
  }
}

// 用户登录使用
export function login(userObj) {
  const { userEmail, userPwd } = userObj
  if (userEmail.trim().length === 0 || userPwd.trim().length === 0) {
    message.error('登录信息不正确!')
    return errorMsg('用户名必须输入')
  }
  return async (dispatch) => {
    const { data } = await reqLogin(userObj)
    if (data.isOk) {
      const { loginUser, msg } = data

      message.success(msg)
      operUser.saveUser(loginUser)
      dispatch(
        loginSuccess({
          redirectTo: getRedirectPath(loginUser, false),
          userObj: loginUser,
        })
      )
    } else {
      message.error('登录失败')
      dispatch(errorMsg(data.msg))
    }
  }
}

// 用户退出
export function logOutUser() {
  isRegisterOrLogout = true
  userRole = ''
  operUser.removeUser()
  return async (dispatch) => {
    reqLogOut()
    dispatch({
      type: USER_LOGOUT,
      payload: {
        redirectTo: getRedirectPath(userRole, isRegisterOrLogout),
        userObj: null,
      },
    })
  }
}

// 用户于用户中心完善用户信息
// export function uModifyInfo(modifyInfo) {
//   return async (dispatch) => {
//     const { data } = await reqUpdateUserInfo(
//       '/user/update-userinfo',
//       modifyInfo,
//       'POST'
//     )

//     if (data.isOk) {
//       message.success(data.msg)
//       dispatch(userModify(data.data))
//     } else message.error(data.msg)
//   }
// }

export function modifyUserObj(reqData) {
  return async (dispatch) => {
    const { data } = await reqModifyUser(reqData, 'POST')
    operUser.removeUser()
    if (data.isOk) {
      message.success(data.msg)
    } else {
      message.warning(data.msg)
    }
    dispatch(userModify({ redirectTo: '/login', userObj: null }))
  }
}
