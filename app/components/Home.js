import React, { Component } from 'react'
import Feed from './feed'
import styles from './page.scss'

export default class Home extends Component {
  render () {
    return (
      <div className={styles.row}>
        <div className={styles.columns + ' ' + styles['medium-centered'] + ' ' + styles['medium-10']}>
          <Feed
            feed={this.props.userFeed}
            title={'Your Feed'}
          />
        </div>
      </div>
    )
  }
}
