import {GET_FEED, GET_USER_FEED} from '../actions/feed'

const feedState = []
const userFeedState = []

export function feed (state = feedState, action) {
  switch (action.type) {
    case GET_FEED:
      return action.payload
    default:
      return state
  }
}

export function userFeed (state = userFeedState, action) {
  switch (action.type) {
    case GET_USER_FEED:
      return action.payload
    default:
      return state
  }
}
