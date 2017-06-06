import * as React from 'react'
import styles from './tx.scss'

const Tx = () => {
  return (
    <section className={styles.tx}>
      <h4 className={styles.tx_title}>send token</h4>
      <form className={styles.tx_form}>
        <input className={styles.form_to} placeholder='to' />
        <input className={styles.form_amount} placeholder='Amount' />
        <input className={styles.form_description} placeholder='Description' />
        <button className={styles.form_publish}>Send</button>
      </form>
    </section>
  )
}

export default Tx
