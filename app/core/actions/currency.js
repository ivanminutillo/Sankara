export const UPDATE_BALANCE = 'UPDATE_BALANCE'

export const updateBalanceAction = (amount) => {
  return {
    type: UPDATE_BALANCE,
    payload: amount
  }
}
