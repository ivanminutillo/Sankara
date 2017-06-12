var refs = require('ssb-ref')
var Big = require('big.js')

exports.credit = function (account, amount, currency, memo) {
  if (!refs.isLink(account)) throw new TypeError('account should be a ssb ref')
  if (typeof currency !== 'string') throw new TypeError('currency should be string')
  if (!currency) throw new RangeError('currency should be non-empty string')
  if (memo !== undefined && typeof memo !== 'string')
    throw new Error('memo should be string')
  try { amount = Big(amount) }
  catch(e) { throw new RangeError('bad amount: ' + e.stack) }

  return {
    type: 'mutual/credit',
    account: account,
    amount: amount.toString(),
    currency: currency,
    memo: memo,
  }
}

exports.debit = function (account, amount, currency, memo) {
  try { amount = Big(amount) }
  catch(e) { throw new RangeError('bad amount: ' + e.stack) }
  amount.s *= -1
  return exports.credit(account, amount, currency, memo)
}

exports.account = function (name, desc) {
  if (name !== undefined && typeof name !== 'string')
    throw new Error('name should be string')
  if (desc !== undefined && typeof desc !== 'string')
    throw new Error('description should be string')

  return {
    type: 'mutual/account',
    name: name,
    description: desc,
  }
}
