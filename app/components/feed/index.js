import * as React from 'react'
import styles from './feed.scss'

const Feed = (props) => {
  let currencyFeed = []
  currencyFeed = props.feed
  .filter(item => item.value.content.currency === props.currency)
  .map(function (item, i) {
    let name = 'test'
    let account = 'test2'
    return (
      <div key={i} className={styles.list_item}>
        <div className={styles.item_title}>
          <span className={styles.title_photo} />
          <h2 className={styles.title_info}><b>{name}</b> sent <b>{item.value.content.amount} {props.currency}</b> to <b>{account}</b></h2>
          <div className={styles.title_description}>{item.value.content.memo}</div>
          <div className={styles.title_secondary}>
            <span className={styles.secondary_date}>{item.value.timestamp}</span>
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
