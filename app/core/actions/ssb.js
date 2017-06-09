export const ADD_SBOT = 'ADD_SBOT'
export const ADD_ID = 'ADD_ID'

export const addSSBAction = (sbot) => {
  return {
    type: 'ADD_SBOT',
    payload: sbot
  }
}


export const addIdentityAction = (name, photo, id) => {
  return {
    type: 'ADD_ID',
    payload: {
      name,
      photo,
      id
    }
  }
}