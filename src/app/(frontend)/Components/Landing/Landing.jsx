import React from 'react'
import styles from './Landing.module.css'
import Image from 'next/image'
import Logo from './logo.png'

const Landing = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainConatiner}>
          <div className={styles.one}>
            <Image src={Logo} alt="logo" />
            <h1>Summer Lounging</h1>
          </div>
          <div className={styles.two}>
            <div className={styles.twotop}>
              <h4>A state of mind</h4>
              <div className={styles.line}></div>
            </div>
            <p>SLOW DOWN I SETTLE IN I STAY A WHILE</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
