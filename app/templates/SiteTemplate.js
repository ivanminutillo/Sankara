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


class SiteTemplate extends Component {
  constructor () {
    super()
    this.updateFeedWithName = this.updateFeedWithName.bind(this)
    this.connectionManager = this.connectionManager.bind(this)
    this.retrieveTheName = this.retrieveTheName.bind(this)
  }

  // componentDidUpdate (prevProps) {
  //   if (prevProps.feed.length !== this.props.feed.length) {
  //     let updatedFeed = []
  //     pull(
  //       this.props.sbot.links({dest: item.author, source: item.author, rel: 'about', values: true}),
  //     )
  //     this.props.feed.map(item => {
  //       pull(
  //         this.props.sbot.links({dest: item.author, source: item.author, rel: 'about', values: true}),
  //         pull.filter(msg => msg.value.content.name),
  //         pull.take(1),
  //         pull.collect((err, msg) => {
  //           updatedFeed.push(
  //             {
  //               ...item,
  //               name: msg[0].value.content.name
  //             }
  //           )
  //         })
  //       )
  //     })
  //   }
  // }

  retrieveTheName (sbot, item) {
    return pull(
      sbot.links({dest: item.id, source: item.id, rel: 'about', values: true}),
      pull.filter(msg => msg.value.content.name),
      pull.take(1)
    )
  }

  updateFeedWithName (sbot) {
    return pull(
      pull.map(item => {
        return {
          ...item,
          name: 'franco'
        }
      }),
      pull.collect((err, msgs) => console.log(msgs))

    )
  }
  
  findUserName (info) {
    return pull(
      this.props.sbot.links({dest: info.author, source: info.author, rel: 'about', values: true}),
      pull.filter(msg => msg.value.content.name),
      pull.take(1)
    )
  }

  findStream (mutual) {
    let _item
    return pull(
      mutual.streamTransactions({account: this.props.sbot.id}),
      pull.map(item => {
        console.log(item)
        _item = item
        return pull(
          this.props.sbot.links({dest: item.author, source: item.author, rel: 'about', values: true}),
          pull.filter(msg => msg.value.content.name),
          pull.take(1)
        )
      }),
      pull.collect((err, msgs) => {
        console.log(_item)
        console.log(msgs)
        pull.collect((err, msg) => {
          console.log(msg)
        })
      })
      // pull.collect(function (err, txs) {
      //   _this.props.getFeed(txs)
      // })
    )
  }

  connectionManager () {
    let _this = this
    ssbClient(function (err, sbot) {
      if (err) throw err
      _this.props.addSSB(sbot)
      let mutual = Mutual.init(_this.props.sbot)
      _this.props.addMutual(mutual)
      sbot.whoami(function (err, info) {
        if (err) throw err
        pull(
          _this.findUserName(info),
          pull.collect((err, msgs) => _this.props.addIdentity(msgs[0].value.content.name, info.id)),
          _this.findStream(mutual)
          )
          // pull(
          //   mutual.streamAccountHistory({account: _this.props.sbot.id}),
          //   pull.collect(function (err, txs) {
          //     _this.props.getUserFeed(txs)
          //   })
          // )
          // pull(
          //   sbot.messagesByType({ type: 'mutual/credit' }),
          //   pull.collect((err, msgs) => {
          //     if (err) throw err
          //     _this.props.getFeed(msgs)
          //     let userFeed = msgs.filter(msg => msg.value.author === _this.props.id)
          //     _this.props.getUserFeed(userFeed)
          //   })
          // )
        // )
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
    addMutual: (sbot) => {
      dispatch(addMutualAction(sbot))
    },
    addIdentity: (name, id) => {
      dispatch(addIdentityAction(name, id))
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
