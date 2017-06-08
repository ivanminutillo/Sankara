export const ADD_MUTUAL = 'ADD_MUTUAL'

export const addMutualAction = (sbot) => {
  return {
    type: ADD_MUTUAL,
    payload: sbot
  }
}
