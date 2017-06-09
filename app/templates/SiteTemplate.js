import React, {Component} from 'react'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import styles from './sitetemplate.scss'
let ssbClient = window.require('ssb-client')
import { connect } from 'react-redux'
import {addSSBAction, addIdentityAction} from '../core/actions/ssb'
import {getFeedAction, getUserFeedAction, updateFeedWithNameAction} from '../core/actions/feed'
import {addMutualAction} from '../core/actions/mutual'
var pull = require('pull-stream')
import Mutual from '../utils/mutualSsb'
import getAvatar from 'ssb-avatar'

class SiteTemplate extends Component {
  constructor () {
    super()
    this.connectionManager = this.connectionManager.bind(this)
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
            console.log(tx)
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
    })
  }

  componentDidMount () {
    this.connectionManager()
  }

  render () {
    return (
      <div>
        <Header name={this.props.name} />
        <Sidebar currencies={this.props.userFeed} />
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
    feed: state.feed
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteTemplate)
