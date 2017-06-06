import * as React from 'react'
import styles from './header.scss'

const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.header_title}>sankara</h2>
      <form className={styles.header_form}>
        <input className={styles.form_search} placeholder='Search' />
      </form>
    </header>
  )
}

export default Header
