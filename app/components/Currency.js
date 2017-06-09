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
var createFeed = window.require('ssb-feed')
var ssbKeys = window.require('ssb-keys')


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

  sendTx () {
    let _this = this
    let tx = {
      type: 'mutual/credit',
      account: _this.state.name,
      amount: _this.state.amount,
      currency: _this.props.match.params.name,
      memo: _this.state.description
    }
    console.log(tx)
     var value = schemas.credit('@iL6NzQoOLFP18pCpprkbY80DMtiG4JFFtVSVUaoGsOQ=.ed25519', 1.5, 'FOO', 'send some foo')
    // let value = schemas.credit("@iL6NzQoOLFP18pCpprkbY80DMtiG4JFFtVSVUaoGsOQ=.ed25519", 1, 'ECO', 'gift')
    console.log(value)
    var bob = createFeed(this.props.sbot, ssbKeys.generate())
    console.log(bob)
    bob.add(value, function (err, msg) {
      if (err) throw err
      console.log('good')
    })
  }

  render () {
    console.log(this.state.account)
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
