import React, {Component} from 'react'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import styles from './sitetemplate.scss'
let ssbClient = window.require('ssb-client')
import { connect } from 'react-redux'
import {addSSBAction, addIdentityAction} from '../core/actions/ssb'
import {getFeedAction, getUserFeedAction} from '../core/actions/feed'
var pull = require('pull-stream')

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
      sbot.whoami(function (err, info) {
        if (err) throw err
        pull(
          pull(
            sbot.links({dest: info.id, source: info.id, rel: 'about', values: true}),
            pull.filter(msg => msg.value.content.name),
            pull.take(1),
            pull.collect((err, msgs) => _this.props.addIdentity(msgs[0].value.content.name, info.id))
          ),
          pull(
            sbot.messagesByType({ type: 'mutual/credit' }),
            pull.collect((err, msgs) => {
              if (err) throw err
              _this.props.getFeed(msgs)
              let userFeed = msgs.filter(msg => msg.value.author === _this.props.id)
              _this.props.getUserFeed(userFeed)
            })
          )
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
    addIdentity: (name, id) => {
      dispatch(addIdentityAction(name, id))
    },
    getFeed: (feed) => {
      dispatch(getFeedAction(feed))
    },
    getUserFeed: (feed) => {
      dispatch(getUserFeedAction(feed))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteTemplate)
