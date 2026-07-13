import React from 'react'
import Image from 'next/image'
import styles from './JournalArticle.module.css'

const JournalArticle = ({ article }) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <h1>{article.title}</h1>
          <div className={styles.imageWrapper}>
            <Image src={article.image} alt={article.title} className={styles.image} />
          </div>
        </div>

        <p className={styles.description}>{article.description}</p>

        <div className={styles.points}>
          {article.points.map((point, index) => (
            <div className={styles.point} key={index}>
              <h2>
                {index + 1}. {point.heading}
              </h2>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JournalArticle
