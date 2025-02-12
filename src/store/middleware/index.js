import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import { isDev } from 'config'
import graphqlMiddleware from './graphqlMiddleware'
import apolloMiddleware from './apolloMiddleware'
import pendingMiddleware from './pendingMiddleware'
import optimisticMiddleware from './optimisticMiddleware'
import userBlockingMiddleware from './userBlockingMiddleware'
import errorMiddleware from './errorMiddleware'
import { routerMiddleware } from 'connected-react-router'

export default function createMiddleware (history, req) {
  const middleware = compact([
    routerMiddleware(history),
    apolloMiddleware,
    graphqlMiddleware,
    errorMiddleware,
    optimisticMiddleware,
    pendingMiddleware,
    promiseMiddleware,
    userBlockingMiddleware,
    !req && isDev && createLogger({ collapsed: true })
  ])

  const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
    ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
    : compose

  return composeFn(
    applyMiddleware(...middleware)
  )
}
