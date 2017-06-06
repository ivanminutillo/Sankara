// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.css'
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
          <h2>Hoooome</h2>
          <Link to="/counter">to Counter</Link>
        </div>
      </div>
    );
  }
}
