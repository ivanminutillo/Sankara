import React, { Component } from 'react'
import Hero from './hero'
import Tx from './tx'
import Feed from './feed'
import styles from './page.scss'
var pull = require('pull-stream')
var schemas = require('../utils/mutualSsb/schemas')
import getAvatar from 'ssb-avatar'
var paramap = require('pull-paramap')
import Mutual from '../utils/mutualSsb'


class Currency extends Component {
  constructor () {
    super()
    this.sendTx = this.sendTx.bind(this)
    this.handleAccount = this.handleAccount.bind(this)
    this.handleAmount = this.handleAmount.bind(this)
    this.handleMemo = this.handleMemo.bind(this)
    this.state = {
      account: '',
      name: '',
      amount: 0,
      description: ''
    }
  }

  componentDidUpdate (prevProps) {
    let _this = this
    if (prevProps.mutual !== this.props.mutual && this.props.mutual.config ||  this.props.mutual.config && prevProps.location.pathname !== this.props.location.pathname) {
      this.props.mutual.getAccountBalance({account: this.props.sbot.id, currency: this.props.match.params.name}, function (err, amount) {
        _this.props.updateBalance(amount)
      })
    }
    if (prevProps.feed.length !== this.props.feed.length) {
      pull(
        pull.values(this.props.feed),
        paramap(function (data, cb) {
          getAvatar(_this.props.sbot, data.author, data.author, function (err, info) {
            let newTx = {
              ...data,
              authorName: info.name
            }
            cb(err, newTx)
          })
        }),
        paramap(function (data, cb) {
          getAvatar(_this.props.sbot, data.counterparty, data.counterparty, function (err, counterInfo) {
            let newTx = {
              ...data,
              counterpartyName: counterInfo.name
            }
            cb(err, newTx)
          })
        }),
        pull.collect((err, info) => {
          _this.props.updateFeed(info)
        })
      )
    }
  }

  handleAccount (item) {
    if (item === null) {
      this.setState({
        name: '',
        account: ''
      })
    } else {
      this.setState({
        ...this.state,
        name: item.value,
        account: item.label
      })
    }
  }

  handleAmount (e) {
    this.setState({
      ...this.state,
      amount: e.target.value
    })
  }

  handleMemo (e) {
    this.setState({
      ...this.state,
      description: e.target.value
    })
  }

  publish (sbot, value, recps, cb) {
    if (process.env.DRY_RUN) throw JSON.stringify([recps, value], 0, 2)
    if (recps) value.recps = recps, sbot.private.publish(value, recps, cb)
    else sbot.publish(value, cb)
  }


  publishCredit (value, pub) {
    var _this = this
    // var recps = public ? null :
    //   value.account[0] === '@' ? [this.selfId, value.account] : [this.selfId]
    this.publish(this.props.sbot, value, null, function (err, msg) {
      if (err) throw err
      let tx = {
        amount: msg.value.content.amount,
        author: msg.value.author,
        counterparty: msg.value.content.account,
        currency: msg.value.content.currency,
        id: msg.key,
        memo: msg.value.content.memo,
        private: false,
        timestamp: msg.value.timestamp
      }
      _this.setState({
        account: '',
        name: '',
        amount: 0,
        description: ''
      })
      return _this.props.getFeed(tx)
    })
  }

  sendTx () {
    let _this = this
    let tx = {
      type: 'mutual/credit',
      account: _this.state.name,
      amount: _this.state.amount,
      currency: _this.props.match.params.name,
      memo: _this.state.description
    }
    var value = schemas.credit(tx.account, tx.amount, tx.currency, tx.memo)
    return this.publishCredit(value)
  }

  render () {
    return (
      <div>
        <Hero
          currency={this.props.match.params.name}
          memberList={this.props.feed}
          balance={this.props.currency.balance}
        />
        <div className={styles.row}>
          <div className={styles.columns + ' ' + styles['medium-centered'] + ' ' + styles['medium-10']}>
            <Tx
              account={this.state.account}
              name={this.state.name}
              amount={this.state.amount}
              memo={this.state.description}
              sendTx={this.sendTx}
              handleAccount={this.handleAccount}
              handleAmount={this.handleAmount}
              handleMemo={this.handleMemo}
              getOptions={this.getOptions}
              friends={this.props.friends}
            />
            <Feed
              currency={this.props.match.params.name}
              feed={this.props.updatedFeed}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Currency
