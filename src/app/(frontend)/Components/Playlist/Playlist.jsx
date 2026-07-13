import React from 'react'
import styles from './Playlist.module.css'
import Image from 'next/image'
import rightimg from './1.webp'

const Playlist = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainconatier}>
          <div className={styles.left}>
            <div className={styles.content}>
              <h4>The Summer Playlist</h4>
              <p>
                Press play on the Al Huzaifa Summer Playlist a curated soundtrack inspired by slow
                living, sunlit spaces, and effortless summer moments.
              </p>
            </div>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              <p>LISTEN ON SPOTIFY</p>
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 0.75L14.75 5.75L10.75 10.75M14.75 5.75L0.75 5.75"
                  stroke="#CD7D6D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <div className={styles.right}>
            <Image src={rightimg} alt="leftimg" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Playlist
