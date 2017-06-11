export const GET_FEED = 'GET_FEED'
export const GET_USER_FEED = 'GET_USER_FEED'
export const UPDATE_FEED = 'UPDATE_FEED'
export const GET_FRIENDS = 'GET_FRIENDS'

export const getFeedAction = (feed, currency) => {
  return {
    type: 'GET_FEED',
    payload: {
      feed, currency
    }
  }
}

export const getUserFeedAction = (feed) => {
  return {
    type: 'GET_USER_FEED',
    payload: feed
  }
}

export const updateFeedAction = (tx, currency) => {
  return {
    type: UPDATE_FEED,
    payload: {
      tx, currency
    }
  }
}

export const addFriendsAction = (friends) => {
  return {
    type: GET_FRIENDS,
    payload: friends
  }
}