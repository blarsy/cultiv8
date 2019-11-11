import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Iterable } from 'immutable'
import Modal from 'react-modal'
import App from './App'
import reducer from './actions/reducer'
import registerServiceWorker from './registerServiceWorker'
import { createLogger } from 'redux-logger'
import sagas from './actions/sagas'
import createHistory from 'history/createBrowserHistory'
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware
} from 'react-router-redux'

const history = createHistory()

const configureStore = () => {
  const middlewares = []
  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      collapsed: true,
      stateTransformer: state => {
        if (Iterable.isIterable(state)) {
          return state.toJS()
        }
        return state
      }
    })
    middlewares.push(logger)
  }
  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)
  middlewares.push(routerMiddleware(history))
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    combineReducers({ global: reducer, router: routerReducer }),
    composeEnhancers(applyMiddleware(...middlewares))
  )
  sagaMiddleware.run(sagas)
  return store
}

Modal.setAppElement('#root')

ReactDOM.render(
  <Provider store={configureStore()}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
