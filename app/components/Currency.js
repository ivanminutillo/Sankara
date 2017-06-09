import React, { Component } from 'react'
import Hero from './hero'
import Tx from './tx'
import Feed from './feed'
import styles from './page.scss'
var pull = require('pull-stream')
var schemas = require('../utils/mutualSsb/schemas')
import getAvatar from 'ssb-avatar'
var paramap = require('pull-paramap')

class Currency extends Component {
  constructor () {
    super()
    this.sendTx = this.sendTx.bind(this)
    this.handleAccount = this.handleAccount.bind(this)
    this.handleAmount = this.handleAmount.bind(this)
    this.handleMemo = this.handleMemo.bind(this)
    this.state = {
      to: '',
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
      pull(
        this.props.mutual.streamAccountHistory({account: this.props.sbot.id}),
        pull.collect(function (err, tsx) {
        })
      )  
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
            console.log(counterInfo)
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

  handleAccount (e) {
    this.setState({
      ...this.state,
      to: e.target.value
    })
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

  sendTx () {
    let _this = this
    let tx = {
      type: 'mutual/credit',
      account: _this.state.to,
      amount: _this.state.amount,
      currency: _this.props.match.params.name,
      memo: _this.state.description
    }
    this.props.sbot.publish(tx, function (err, msg) {
      if (err) throw err
      console.log(msg)
    })
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
              amount={this.state.amount}
              memo={this.state.description}
              sendTx={this.sendTx}
              handleAccount={this.handleAccount}
              handleAmount={this.handleAmount}
              handleMemo={this.handleMemo}
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
