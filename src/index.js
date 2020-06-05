import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
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
    <HashRouter>
      <Route path={`/`} component={App}></Route>
    </HashRouter>
    {/* <App/> */}
  </Provider>,
  document.getElementById('root')
)
