import React, {Component} from 'react'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import styles from './sitetemplate.scss'
let ssbClient = window.require('ssb-client')
import { connect } from 'react-redux'
import {addSSBAction, addIdentityAction} from '../core/actions/ssb'
import {getFeedAction, getUserFeedAction, updateFeedWithNameAction, addFriendsAction} from '../core/actions/feed'
import {addMutualAction} from '../core/actions/mutual'
var pull = require('pull-stream')
import Mutual from '../utils/mutualSsb'
import getAvatar from 'ssb-avatar'
var paramap = require('pull-paramap')
var schemas = require('../utils/mutualSsb/schemas')

class SiteTemplate extends Component {
  constructor () {
    super()
    this.connectionManager = this.connectionManager.bind(this)
    this.handleJoinButton = this.handleJoinButton.bind(this)
    this.joinCurrency = this.joinCurrency.bind(this)
    this.updateCurrencyValue = this.updateCurrencyValue.bind(this)
    this.state = {
      activeJoin: false,
      currencyToJoin: ''
    }
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
      pull(
        _this.props.mutual.streamAccountHistory({account: _this.props.id}),
        pull.collect(function (err, txs) {
          if (err) throw err
          _this.props.getUserFeed(txs)
        })
      )
    })
  }

  publish (sbot, value, recps, cb) {
    if (process.env.DRY_RUN) throw JSON.stringify([recps, value], 0, 2)
    if (recps) value.recps = recps, sbot.private.publish(value, recps, cb)
    else sbot.publish(value, cb)
  }

  joinCurrency () {
    let tx = {
      type: 'mutual/credit',
      account: this.props.id,
      amount: 1,
      currency: this.state.currencyToJoin,
      memo: 'Joined the ' + this.state.currencyToJoin + ' currency'
    }
    var value = schemas.credit(tx.account, tx.amount, tx.currency, tx.memo)
    return this.publishCredit(value)
  }

  updateCurrencyValue (e) {
    this.setState({
      currencyToJoin: e.target.value
    })
  }

  handleJoinButton () {
    this.setState({
      activeJoin: !this.state.activeJoin
    })
  }

  connectionManager () {
    let _this = this

    ssbClient(function (err, sbot) {
      if (err) throw err
       _this.props.addSSB(sbot)
      let mutual = Mutual.init(_this.props.sbot)
      _this.props.addMutual(mutual)
      getAvatar(sbot, sbot.id, sbot.it, function (err, info) {
        if (err) throw err
        _this.props.addIdentity(info.name, info.image, info.from)
      })
      pull(
        mutual.streamTransactions({account: sbot.id}),
        pull.collect(function (err, txs) {
          if (err) throw err
          txs.map(tx => {
            if (tx.counterparty.startsWith('@') || tx.counterparty.startsWith('%')) {
              return _this.props.getFeed(tx)
            }
          })
        })
      )
      pull(
        mutual.streamAccountHistory({account: sbot.id}),
        pull.collect(function (err, txs) {
          if (err) throw err
          _this.props.getUserFeed(txs)
        })
      )
      sbot.friends.hops(sbot.id, 'follow', {dunbar: 10, hops: 1}, function (err, friends) {
        if (err) throw err
        let friendsId = Object.keys(friends)
        pull(
          pull.values(friendsId),
          paramap(function (friend, cb) {
            getAvatar(_this.props.sbot, friend, friend, function (err, info) {
              cb(err, {
                value: info.id,
                label: info.name
              })
            })
          }),
          pull.collect(function (err, msgs) {
            _this.props.addFriends(msgs)
          })
        )
      })
    })
  }

  componentDidMount () {
    this.connectionManager()
  }

  render () {
    return (
      <div>
        <Header name={this.props.name} />
        <Sidebar
          currencies={this.props.userFeed}
          handleJoinButton={this.handleJoinButton}
          activeJoin={this.state.activeJoin}
          joinCurrency={this.joinCurrency}
          updateCurrencyValue={this.updateCurrencyValue}
          currencyToJoin={this.state.currencyToJoin}
         />
        <div className={styles.wrapper}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    sbot: state.ssb.sbot,
    name: state.ssb.name,
    id: state.ssb.id,
    userFeed: state.userFeed,
    feed: state.feed,
    mutual: state.mutual
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSSB: (sbot) => {
      dispatch(addSSBAction(sbot))
    },
    addMutual: (sbot) => {
      dispatch(addMutualAction(sbot))
    },
    addIdentity: (name, photo, id) => {
      dispatch(addIdentityAction(name, photo, id))
    },
    getFeed: (feed) => {
      dispatch(getFeedAction(feed))
    },
    getUserFeed: (feed) => {
      dispatch(getUserFeedAction(feed))
    },
    updateFeed: (id, name) => {
      dispatch(updateFeedWithNameAction(id, name))
    },
    addFriends: (friends) => {
      dispatch(addFriendsAction(friends))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteTemplate)
