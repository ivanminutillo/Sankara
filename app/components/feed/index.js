import * as React from 'react'
import styles from './feed.scss'
import moment from 'moment'

const Feed = (props) => {
  let currencyFeed = []
  currencyFeed = props.feed
  .filter(item => item.currency === props.currency)
  .map(function (item, i) {
    let date = moment.unix(item.timestamp / 1000).format('DD MMM YYYY - hh:mm a')
    let description = (<div />)
    if (item.memo !== undefined) {
      description = (
        <div className={styles.title_description}>{item.memo}</div>
      )
    }
    return (
      <div key={i} className={styles.list_item}>
        <div className={styles.item_title}>
          <span className={styles.title_photo} />
          <h2 className={styles.title_info}><b>{item.authorName}</b> sent <b>{item.amount} {props.currency}</b> to <b>{item.counterpartyName}</b></h2>
          {description}
          <div className={styles.title_secondary}>
            <span className={styles.secondary_date}>{date || 'never'}</span>
          </div>
        </div>
      </div>
    )
  })
  return (
    <section className={styles.feed}>
      <h4 className={styles.feed_title}>feed</h4>
      <div className={styles.feed_list}>
        {currencyFeed}
      </div>
    </section>
  )
}

export default Feed
