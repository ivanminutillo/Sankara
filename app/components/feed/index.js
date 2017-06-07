import * as React from 'react'
import styles from './feed.scss'

const Feed = () => {
  return (
    <section className={styles.feed}>
      <h4 className={styles.feed_title}>feed</h4>
      <div className={styles.feed_list}>
        <div className={styles.list_item}>
          <div className={styles.item_title}>
            <span className={styles.title_photo} />
            <h2 className={styles.title_info}><b>Bernini</b> sent <b>10 ssbcoin</b> to <b>Dominic</b></h2>
            <div className={styles.title_description}>Increasing Prosperity With Positive Thinking Increasing Prosperity.</div>
            <div className={styles.title_secondary}>
              <span className={styles.secondary_date}>12 hours ago</span>
            </div>
          </div>
        </div>
        <div className={styles.list_item}>
          <div className={styles.item_title}>
            <span className={styles.title_photo} />
            <h2 className={styles.title_info}><b>Bernini</b> sent <b>10 ssbcoin</b> to <b>Dominic</b></h2>
            <div className={styles.title_description}>Increasing Prosperity With Positive Thinking Increasing Prosperity.</div>
            <div className={styles.title_secondary}>
              <span className={styles.secondary_date}>12 hours ago</span>
            </div>
          </div>
        </div>
        <div className={styles.list_item}>
          <div className={styles.item_title}>
            <span className={styles.title_photo} />
            <h2 className={styles.title_info}><b>Bernini</b> sent <b>10 ssbcoin</b> to <b>Dominic</b></h2>
            <div className={styles.title_description}>Increasing Prosperity With Positive Thinking Increasing Prosperity.</div>
            <div className={styles.title_secondary}>
              <span className={styles.secondary_date}>12 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feed
