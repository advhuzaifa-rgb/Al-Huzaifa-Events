'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Experience.module.css'
import listeningIcon from './1.png'
import matchaIcon from './2.png'
import mindfulIcon from './3.png'

const events = [
  {
    title: 'Move & Unwind',
    description: 'Guided Pilates, Signature Matcha & The Summer Listening Lounge',
    date: '15 July',
  },
  {
    title: 'Breathe & Bloom',
    description: 'Breathwork, Essential Oils & Matcha Making',
    date: '15 July',
  },
  {
    title: 'Clay & Calm',
    description: 'Pottery Workshop & Creative Conversation',
    date: '15 July',
  },
]

const DropdownArrow = () => (
  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.04139 11.625C8.78596 11.6251 8.53629 11.7008 8.32392 11.8428C8.11156 11.9847 7.94605 12.1864 7.84831 12.4224C7.75057 12.6584 7.72499 12.9181 7.7748 13.1686C7.82462 13.4191 7.9476 13.6492 8.12818 13.8299L14.5865 20.2882C14.8287 20.5304 15.1572 20.6664 15.4997 20.6664C15.8422 20.6664 16.1707 20.5304 16.4129 20.2882L22.8713 13.8299C23.0519 13.6492 23.1748 13.4191 23.2246 13.1686C23.2745 12.9181 23.2489 12.6584 23.1511 12.4224C23.0534 12.1864 22.8879 11.9847 22.6755 11.8428C22.4632 11.7008 22.2135 11.6251 21.9581 11.625H9.04139Z" fill="#CD7D6D"/>
</svg>

)

const items = [
  {
    icon: listeningIcon,
    heading: 'Listening Lounge',
    description:
      'Unwind with a curated vinyl soundtrack designed to help you slow down, switch off, and simply be present.',
  },
  {
    icon: matchaIcon,
    heading: 'Matcha Moments',
    description:
      'Explore the ritual of matcha through curated tastings and seasonal matcha experiences.',
  },
  {
    icon: mindfulIcon,
    heading: 'Mindful Movements',
    description: 'Wellness experiences including Pilates, breathwork, and mindful practices.',
    cta: true,
  },
]

const Experience = () => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.mainContainer}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            <span className={styles.script}>In-Store Summer</span>
            <br />
            <span className={styles.heading}>Experience</span>
          </h2>
        </div>

        <div className={styles.right}>
          {items.map((item, index) => (
            <React.Fragment key={item.heading}>
              <div className={styles.block}>
                <div className={styles.icon}>
                  <Image src={item.icon} alt={item.heading} />
                </div>
                <h3 className={styles.blockHeading}>{item.heading}</h3>
                <p className={styles.blockDesc}>{item.description}</p>

                {item.cta && (
                  <div className={styles.ctaWrapper} ref={wrapperRef}>
                    <button
                      type="button"
                      className={styles.cta}
                      onClick={() => setOpen((v) => !v)}
                      aria-expanded={open}
                    >
                      <span>View upcoming events</span>
                      <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
                        <DropdownArrow />
                      </span>
                    </button>

                    {open && (
                      <div className={styles.dropdown}>
                        {events.map((event) => (
                          <div className={styles.event} key={event.title}>
                            <div className={styles.eventLeft}>
                              <p className={styles.eventTitle}>{event.title}</p>
                              <p className={styles.eventDesc}>{event.description}</p>
                            </div>
                            <p className={styles.eventDate}>{event.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {index < items.length - 1 && <div className={styles.line} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Experience
