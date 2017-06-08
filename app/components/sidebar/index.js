import * as React from 'react'
import styles from './sidebar.scss'
import { NavLink } from 'react-router-dom'

const Sidebar = (props) => {
  let uniqueCurrencies = []
  uniqueCurrencies = props.currencies
  .map(item => item.currency)
  .filter((item, i, ar) => ar.indexOf(item) === i)
  .map((item, i) => (
    <li key={i} className={styles.list_item}>
      <NavLink to={'/currency/' + item} activeClassName={styles.active} className={styles.item_link}>{item}</NavLink>
    </li>
  ))
  return (
    <aside className={styles.sidebar}>
      <h4 className={styles.sidebar_title}>Wallets</h4>
      <ul className={styles.sidebar_list}>
        {uniqueCurrencies}
      </ul>
      <button className={styles.sidebar_join}>Join a new currency</button>
    </aside>
  )
}

export default Sidebar
