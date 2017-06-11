import * as React from 'react'
import styles from './hero.scss'

const Hero = (props) => {
  console.log(props)
  let members
  if (props.memberList[0]) {
    members = props.memberList[0].members
  }
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero_title}>{props.currency}</h2>
      <div className={styles.hero_infos}>
        <span className={styles.infos_members}>{members} Members</span>
        <span className={styles.infos_members}>{props.balance} Balance </span>
       </div>
    </section>
  )
}

export default Hero
