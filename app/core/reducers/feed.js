import {GET_FEED, GET_USER_FEED, UPDATE_FEED, GET_FRIENDS} from '../actions/feed'
import {UPDATE_BALANCE} from '../actions/currency'

const feedState = [
  // {
  //   currency: 'ECO',
  //   members: 0,
  //   feed: []
  // }
]
const userFeedState = []

export function feed (state = feedState, action) {
  switch (action.type) {
    case GET_FEED:
      let membersTot = action.payload.feed
      .map(item => item.author)
      .filter((x, i, a) => a.indexOf(x) === i)
      .length
      let id = state.filter(item => item.currency === action.payload.currency)
      if (id.length === 0) {
        return [
          ...state,
          {
            currency: action.payload.currency,
            balance: 0,
            members: membersTot,
            feed: action.payload.feed
          }
        ]
      } else {
        // don't update the state if it didnt happened anything
        return [...state]
      }
    case UPDATE_BALANCE:
      let index = state.map(item => item.currency).indexOf(action.payload.currency)
      let updatedState = state.slice()
      updatedState[index].balance = action.payload.amount
      return updatedState
    case UPDATE_FEED:
      let feedIndex = state.map(item => item.currency).indexOf(action.payload.currency)
      let updatedFeedState = state.slice()
      updatedFeedState[feedIndex].feed.unshift(action.payload.tx)
      return updatedFeedState
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
