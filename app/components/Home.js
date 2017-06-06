// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './sidebar'
import Hero from './hero'
import Header from './header'
import Tx from './tx'
import styles from './Home.scss'
let ssbClient = window.require('ssb-client')


export default class Home extends Component {
  componentDidMount () {
    ssbClient(function (err, sbot) {
      console.log(sbot)
    })
  }
  render () {
    return (
      <div>
        <Header />
        <Sidebar />
        <div className={styles.wrapper}>
          <Hero />
          <div className={styles.row}>
            <div className={styles.columns + ' ' + styles['medium-centered'] + ' ' + styles['medium-10']}>
              <Tx />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
