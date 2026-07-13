'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './Journal.module.css'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { articles } from './data'

const ArrowIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.75 0.75L14.75 5.75L10.75 10.75M14.75 5.75L0.75 5.75"
      stroke="#CD7D6D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Journal = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>
        <h2>Summer Styling Journal</h2>

        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {articles.map((article, index) => (
              <div className={styles.slide} key={index}>
                <Link href={`/journal/${article.slug}`} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <Image src={article.image} alt={article.title} className={styles.image} />
                  </div>
                  <p>{article.title}</p>
                  <span className={styles.cta}>
                    <span>Read the article</span>
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.pills}>
          {articles.map((_, index) => (
            <button
              type="button"
              key={index}
              className={`${styles.pill} ${index === selectedIndex ? styles.pillActive : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Journal
