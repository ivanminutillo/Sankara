export const UPDATE_BALANCE = 'UPDATE_BALANCE'

export const updateBalanceAction = (amount, currency) => {
  return {
    type: UPDATE_BALANCE,
    payload: {
      amount: amount,
      currency: currency
    }
  }
}
