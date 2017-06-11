import * as React from 'react'
import styles from './hero.scss'

const Hero = (props) => {
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero_title}>{props.currency}</h2>
      <div className={styles.hero_infos}>
        <span className={styles.infos_members}>{0} Members</span>
        <span className={styles.infos_members}>{props.balance} Balance </span>
       </div>
    </section>
  )
}

export default Hero
