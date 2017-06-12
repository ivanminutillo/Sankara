var pull = require('pull-stream')
var many = require('pull-many')
var paramap = require('pull-paramap')
var refs = require('ssb-ref')

var Big = require('big.js')()
// don't use scientific notation
Big.E_NEG = -Infinity
Big.E_POS = Infinity

function bigsToStrs(bigs) {
  var strs = {}
  for (var k in bigs)
    if (bigs[k].c[0])
      strs[k] = bigs[k].toString()
  return strs
}

function updateBalances(balances, account, amount) {
  if (!(balances[account] instanceof Big)) balances[account] = amount
  else balances[account] = balances[account].plus(amount)
}

function decryptMessages(sbot) {
  return pull(
    paramap(function (msg, cb) {
      var v = msg.value
      if (!v || !v.content) cb()
      else if (typeof v.content === 'object') cb(null, msg)
      else if (typeof v.content !== 'string') cb()
      else sbot.private.unbox(v.content, function (err, c) {
        if (err || !c) return cb()
        var m = {}; for (var k in msg) m[k] = msg[k]
        m.value = {}; for (var k in v) m.value[k] = v[k]
        m.value.content = c
        m.private = true
        cb(null, m)
      })
    }, 4),
    pull.filter()
  )
}

exports.name = 'mutual'
exports.version = require('./package').version

exports.manifest = {
  getAccountBalance: 'async',
  getAccountBalances: 'async',
  getCurrencyBalances: 'async',
  streamAccountHistory: 'source',
  streamTransactions: 'source',
}

exports.init = function (sbot, config) {
  return new Mutual(sbot, config)
}

function Mutual(sbot, config) {
  if (!sbot) throw new TypeError('Missing sbot')

  this.sbot = sbot
  this.config = config || {}
}

Mutual.prototype.close = function (err, cb) {
  if (typeof err === 'function' && !cb) cb = err, err = null
  this.sbot.close(err, cb)
}

Mutual.prototype.getAccountBalance = function (opts, cb) {
  var account = opts.account
  var currency = opts.currency
  if (!refs.isLink(account))
    return cb(new TypeError('account must be a ssb ref'))

  pull(
    many([
      this.sbot.links({rel: 'account', values: true, source: account}),
      this.sbot.links({rel: 'account', values: true, dest: account})
    ]),
    pull.unique('key'),
    decryptMessages(this.sbot),
    pull.filter(function (msg) {
      var c = msg.value.content
      return c
        && c.type === 'mutual/credit'
        && c.currency === currency
        && (c.account === account || msg.value.author === account)
        && c.account !== msg.value.author
    }),
    pull.map(function (msg) {
      var c = msg.value.content
      var amount
      try { amount = Big(c.amount) }
      catch(e) { return 0 }
      if (msg.value.author === account) amount.s *= -1
      return amount
    }),
    pull.reduce(function (acc, amount) {
      return acc.plus(amount)
    }, new Big(0), function (err, balance) {
      cb(err, balance.toString())
    })
  )
}

Mutual.prototype.getAccountBalances = function (opts, cb) {
  if (typeof opts === 'string') opts = {account: opts}
  var account = opts.account
  if (!refs.isLink(account))
    return cb(new TypeError('account must be a ssb ref'))

  var balances = {}
  pull(
    many([
      this.sbot.links({rel: 'account', values: true, source: account}),
      this.sbot.links({rel: 'account', values: true, dest: account})
    ]),
    pull.unique('key'),
    decryptMessages(this.sbot),
    pull.filter(function (msg) {
      var c = msg.value.content
      return c
        && c.type === 'mutual/credit'
        && (c.account === account || msg.value.author === account)
        && c.account !== msg.value.author
    }),
    pull.drain(function (msg) {
      var c = msg.value.content
      var amount
      try { amount = Big(c.amount) }
      catch(e) { return }
      if (msg.value.author === account) amount.s *= -1
      updateBalances(balances, c.currency, amount)
    }, function (err) {
      if (err) return cb(err)
      cb(null, bigsToStrs(balances))
    })
  )
}

Mutual.prototype.getCurrencyBalances = function (opts, cb) {
  if (typeof opts === 'string') opts = {currency: opts}
  var currency = opts.currency

  var balances = {}
  pull(
    this.sbot.messagesByType('mutual/credit'),
    decryptMessages(this.sbot),
    pull.filter(function (msg) {
      var c = msg.value.content
      return c.currency === currency
    }),
    pull.drain(function (msg) {
      var c = msg.value.content
      var amount
      try { amount = Big(c.amount) }
      catch(e) { return }
      updateBalances(balances, msg.value.author, amount.times(-1))
      updateBalances(balances, c.account, amount)
    }, function (err) {
      if (err) return cb(err)
      cb(null, bigsToStrs(balances))
    })
  )
}

Mutual.prototype.streamAccountHistory = function (opts) {
  var account = opts && opts.account
  if (!refs.isLink(account))
    return pull.error(new TypeError('account must be a ssb ref'))
  var currency = opts.currency
  var counterparty = opts.counterparty
  return pull(
    this.sbot.messagesByType('mutual/credit'),
    decryptMessages(this.sbot),
    pull.filter(function (msg) {
      var c = msg.value.content
      return c
        && (c.account === account || msg.value.author === account)
        && (!currency || c.currency === currency)
        && (!counterparty || c.account === counterparty)
    }),
    pull.map(function (msg) {
      var c = msg.value.content
      var originated = (msg.value.author === account)
      var amount
      try { amount = Big(c.amount) }
      catch(e) { return }
      if (originated && c.account !== account) amount.s *= -1
      return {
        id: msg.key,
        timestamp: msg.value.timestamp,
        counterparty: originated ? c.account : msg.value.author,
        private: !!msg.private,
        originated: originated,
        amount: amount.toString(),
        currency: c.currency,
        memo: c.memo,
      }
    }),
    pull.filter()
  )
}

Mutual.prototype.streamTransactions = function (opts) {
  var currency = opts && opts.currency
  return pull(
    this.sbot.messagesByType('mutual/credit'),
    decryptMessages(this.sbot),
    currency && pull.filter(function (msg) {
      var c = msg.value.content
      return c.currency === currency
    }),
    pull.map(function (msg) {
      var c = msg.value.content
      var amount
      try { amount = Big(c.amount) }
      catch(e) { return }
      return {
        id: msg.key,
        timestamp: msg.value.timestamp,
        author: msg.value.author,
        private: !!msg.private,
        counterparty: c.account,
        amount: amount.toString(),
        currency: c.currency,
        memo: c.memo,
      }
    }),
    pull.filter()
  )
}
