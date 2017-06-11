// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ssb from './ssb'
import mutual from './mutual'
// import currency from './currency'
import {feed, userFeed, updatedFeed, friends} from './feed'

const rootReducer = combineReducers({
  ssb,
  feed,
  userFeed,
  mutual,
  // currency,
  updatedFeed,
  friends,
  router
})

export default rootReducer
