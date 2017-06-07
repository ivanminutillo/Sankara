// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ssb from './ssb'
import {feed, userFeed} from './feed'

const rootReducer = combineReducers({
  ssb,
  feed,
  userFeed,
  router
})

export default rootReducer
