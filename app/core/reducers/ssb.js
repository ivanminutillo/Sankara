import { ADD_SBOT, ADD_ID } from '../actions/ssb'

const ssbState = {
  sbot: {},
  name: '',
  id: '',
  photo: ''
}

export default function ssb (state = ssbState, action) {
  switch (action.type) {
    case ADD_SBOT:
      return {
        ...state,
        sbot: action.payload
      }
    case ADD_ID:
      return {
        ...state,
        name: action.payload.name,
        id: action.payload.id,
        photo: action.payload.photo
      }
    default:
      return state
  }
}
