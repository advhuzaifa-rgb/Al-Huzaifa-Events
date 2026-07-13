'use client'
import React, { useState } from 'react'
import styles from './NewsletterSection.module.css'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || submitting) return

    setSubmitting(true)
    try {
      await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 2000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.textGroup}>
            <h1 className={styles.heading}>
              Join the Al Huzaifa <span className={styles.script}>Edit</span>
            </h1>
            <p className={styles.desc}>
              Receive curated design inspiration, seasonal collections, exclusive event
              invitations, and stories that celebrate the art of living beautifully.
            </p>
          </div>

          <form className={styles.formGroup} onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Your email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.cta}>
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
