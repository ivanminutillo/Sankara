import { ADD_MUTUAL } from '../actions/mutual'

const mutualState = {}

export default function ssb (state = mutualState, action) {
  switch (action.type) {
    case ADD_MUTUAL:
      return action.payload
    default:
      return state
  }
}
