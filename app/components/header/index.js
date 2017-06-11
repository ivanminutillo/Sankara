import * as React from 'react'
import styles from './header.scss'
import { Link } from 'react-router-dom'

const Header = (props) => {
  return (
    <header className={styles.header}>
      <Link to='/'>
        <h2 className={styles.header_title}>sankara</h2>
      </Link>
      <div className={styles.header_right}>
        {/*<form className={styles.header_form}>
          <input className={styles.form_search} placeholder='Search' />
        </form>*/}
        <h2 className={styles.right_username}>{props.name}</h2>
      </div>
    </header>
  )
}

export default Header
