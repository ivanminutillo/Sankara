import * as React from 'react'
import styles from './hero.scss'

const Hero = (props) => {
  let members = props.memberList
  .filter(item => item.currency === props.currency)
  .map(item => item.author)
  .filter((x, i, a) => a.indexOf(x) === i)
  console.log(members)
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero_title}>{props.currency}</h2>
      <div className={styles.hero_infos}>
        <span className={styles.infos_members}>{members.length || 0} Members</span>
        <span className={styles.infos_members}>{props.balance} Balance </span>
       </div>
    </section>
  )
}

export default Hero
