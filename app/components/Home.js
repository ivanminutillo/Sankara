// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './sidebar'
import Header from './header'
import styles from './Home.scss'
let ssbClient = window.require('ssb-client')


export default class Home extends Component {
  componentDidMount () {
    ssbClient(function (err, sbot) {
      console.log(sbot)
    })
  }
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Header />
          <Sidebar />
          <h2>riprooova</h2>
          <Link to="/counter">to Counter</Link>
        </div>
      </div>
    );
  }
}
