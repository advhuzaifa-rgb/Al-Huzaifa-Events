import React from 'react'
import Image from 'next/image'
import styles from './Styling.module.css'
import leftImg from './1.webp'

const Styling = () => {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.left}>
          <Image src={leftImg} alt="Style your summer" />
        </div>

        <div className={styles.right}>
          <div className={styles.topText}>
            <p className={styles.label}>Styling by Al Huzaifa</p>
            <h2 className={styles.heading}>Style Your Summer</h2>
          </div>

          <div className={styles.descBlock}>
            <p className={styles.desc}>
              Refresh your home with effortless styling ideas that bring comfort, warmth, and
              timeless elegance to every space.
            </p>
            <ul className={styles.bullets}>
              <li>
                <span className={styles.dot} />
                <span>Layer natural textures</span>
              </li>
              <li>
                <span className={styles.dot} />
                <span>Introduce soft, seasonal tones</span>
              </li>
              <li>
                <span className={styles.dot} />
                <span>Style with greenery</span>
              </li>
              <li>
                <span className={styles.dot} />
                <span>Mix decorative accents with intention</span>
              </li>
              <li>
                <span className={styles.dot} />
                <span>Create spaces designed for slow living</span>
              </li>
            </ul>
          </div>

          <a
            href="https://www.alhuzaifa.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <span>Download the summer styling guide</span>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.75 0.75L14.75 5.75L10.75 10.75M14.75 5.75L0.75 5.75"
                stroke="#CD7060"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Styling
