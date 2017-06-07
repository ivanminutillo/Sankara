// @flow
import React, { Component } from 'react'
import Hero from './hero'
import Tx from './tx'
import Feed from './feed'
import styles from './page.scss'

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
              feed={this.props.feed}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Currency
