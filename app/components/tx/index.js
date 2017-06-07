import * as React from 'react'
import styles from './tx.scss'

const Tx = (props) => {
  return (
    <section className={styles.tx}>
      <h4 className={styles.tx_title}>send token</h4>
      <form className={styles.tx_form}>
        <input className={styles.form_to} value={props.account} onChange={props.handleAccount} placeholder='to' />
        <input type='number' className={styles.form_amount} value={props.amount} onChange={props.handleAmount} placeholder='Amount' />
        <input className={styles.form_description} value={props.memo} onChange={props.handleMemo} placeholder='Description' />
        <div className={styles.form_publish} onClick={() => props.sendTx()} >Send</div>
      </form>
    </section>
  )
}

export default Tx
