import {GET_FEED, GET_USER_FEED, UPDATE_FEED, GET_FRIENDS} from '../actions/feed'
const feedState = []
const userFeedState = []

export function feed (state = feedState, action) {
  switch (action.type) {
    case GET_FEED:
      return [
        ...state,
        action.payload
      ]
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

export function updatedFeed (state = [], action) {
  switch (action.type) {
    case UPDATE_FEED:
      return action.payload
    default:
      return state
  }
}

export function friends (state = [], action) {
  switch (action.type) {
    case GET_FRIENDS:
      return action.payload
    default:
      return state
  }
}
