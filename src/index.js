import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk' // 一个让redux可以异步处理的插件
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import { HashRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import reducers from './reducer.js'
import './index.less'
import './interceptors'
import App from './App'

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider  locale={zhCN}>
      <HashRouter>
        <Route path={`/`} component={App}></Route>
      </HashRouter>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)
