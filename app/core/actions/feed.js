export const GET_FEED = 'GET_FEED'
export const GET_USER_FEED = 'GET_USER_FEED'
export const UPDATE_FEED_WITH_NAME = 'UPDATE_FEED_WITH_NAME'

export const getFeedAction = (feed) => {
  return {
    type: 'GET_FEED',
    payload: feed
  }
}

export const getUserFeedAction = (feed) => {
  console.log('actio')
  return {
    type: 'GET_USER_FEED',
    payload: feed
  }
}

export const updateFeedWithNameAction = (id, name) => {
  return {
    type: UPDATE_FEED_WITH_NAME,
    payload: {
      id, name
    }
  }
}
