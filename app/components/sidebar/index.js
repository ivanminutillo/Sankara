import * as React from 'react'
import styles from './sidebar.scss'

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h4 className={styles.sidebar_title}>Wallets</h4>
      <ul className={styles.sidebar_list}>
        <li className={styles.list_item}>
          <a className={styles.item_link}>Ssbcoin</a>
        </li>
        <li className={styles.list_item}>
          <a className={styles.item_link}>Eco</a>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
