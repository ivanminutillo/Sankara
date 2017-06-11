import * as React from 'react'
import styles from './settings.scss'

const Settings = (props) => {
    let uniqueCurrencies = []
  uniqueCurrencies = props.currencies
  .map(item => item.currency)
  .filter((item, i, ar) => ar.indexOf(item) === i)
  .map((item, i) => (
    <li key={i} className={styles.list_item}>
        <b>{item}</b>
        <div><input id={item} type='checkbox' onChange={props.handleValue} /></div>
    </li>
  ))
  return (
    <section className={styles.settings}>
      <h4 className={styles.settings_title}>send token</h4>
      <ul>
        {uniqueCurrencies}
      </ul>
    </section>
  )
}

export default Settings
