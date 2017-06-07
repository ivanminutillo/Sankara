import * as React from 'react'
import styles from './sidebar.scss'
import { Link } from 'react-router-dom'

const Sidebar = (props) => {
  let uniqueCurrencies = []
  uniqueCurrencies = props.currencies
  .map(currency => currency.value.content.currency)
  .filter((item, i, ar) => ar.indexOf(item) === i)
  .map((item, i) => (
    <li key={i} className={styles.list_item}>
      <Link to={'/currency/' + item} className={styles.item_link}>{item}</Link>
    </li>
  ))
  return (
    <aside className={styles.sidebar}>
      <h4 className={styles.sidebar_title}>Wallets</h4>
      <ul className={styles.sidebar_list}>
        {uniqueCurrencies}
      </ul>
    </aside>
  )
}

export default Sidebar
