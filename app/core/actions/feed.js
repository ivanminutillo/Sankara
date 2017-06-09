export const GET_FEED = 'GET_FEED'
export const GET_USER_FEED = 'GET_USER_FEED'
export const UPDATE_FEED = 'UPDATE_FEED'

export const getFeedAction = (feed) => {
  return {
    type: 'GET_FEED',
    payload: feed
  }
}

export const getUserFeedAction = (feed) => {
  return {
    type: 'GET_USER_FEED',
    payload: feed
  }
}

export const updateFeedAction = (feed) => {
  return {
    type: UPDATE_FEED,
    payload: feed
  }
}
