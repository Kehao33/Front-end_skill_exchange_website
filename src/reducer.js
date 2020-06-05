// 合并所有reducer并且返回

import { combineReducers } from 'redux'
// user为用户的reducer，负责根据action来更新state
import { user } from './redux/user.redux'

export default combineReducers({user})
