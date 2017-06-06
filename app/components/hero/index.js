import * as React from 'react'
import styles from './hero.scss'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero_title}>SSBCOIN</h2>
      <div className={styles.hero_infos}>
        <span className={styles.infos_members}>39 Members</span>
        <span className={styles.infos_members}>39 Members</span>
       </div>
    </section>
  )
}

export default Hero
