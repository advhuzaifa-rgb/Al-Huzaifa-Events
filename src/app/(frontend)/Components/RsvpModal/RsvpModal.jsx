'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './RsvpModal.module.css'

const RSVP_PARAM = 'rsvp'
const EVENT_LABEL = 'The Art of Waiting'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.313298 0.313298C0.514162 0.112683 0.786443 0 1.07033 0C1.35422 0 1.6265 0.112683 1.82737 0.313298L18.9678 17.4537C19.073 17.5518 19.1574 17.67 19.216 17.8014C19.2745 17.9329 19.306 18.0747 19.3086 18.2186C19.3111 18.3624 19.2846 18.5053 19.2308 18.6387C19.1769 18.7721 19.0967 18.8932 18.995 18.995C18.8932 19.0967 18.7721 19.1769 18.6387 19.2308C18.5053 19.2846 18.3624 19.3111 18.2186 19.3086C18.0747 19.306 17.9329 19.2745 17.8014 19.216C17.67 19.1574 17.5518 19.073 17.4537 18.9678L0.313298 1.82737C0.112683 1.6265 0 1.35422 0 1.07033C0 0.786443 0.112683 0.514162 0.313298 0.313298Z"
      fill="#CD7D6D"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.9654 0.313298C19.166 0.514162 19.2787 0.786443 19.2787 1.07033C19.2787 1.35422 19.166 1.6265 18.9654 1.82737L1.82502 18.9678C1.62195 19.157 1.35335 19.26 1.07581 19.2551C0.798281 19.2502 0.533483 19.1378 0.337207 18.9415C0.14093 18.7452 0.0285011 18.4804 0.0236044 18.2029C0.0187077 17.9254 0.121726 17.6568 0.310956 17.4537L17.4514 0.313298C17.6522 0.112683 17.9245 0 18.2084 0C18.4923 0 18.7646 0.112683 18.9654 0.313298Z"
      fill="#CD7D6D"
    />
  </svg>
)

const ExploreArrow = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.5 1L13 5.5L8.5 10"
      stroke="#CD7D6D"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13 5.5H1" stroke="#CD7D6D" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const EMPTY_FORM = {
  fullName: '',
  mobileNumber: '',
  email: '',
}

// The "Number of Guests" input has been removed from the form; every
// submission now registers a single attendee by default.
const SINGLE_GUEST_COUNT = 1

const FULL_NAME_MAX_LENGTH = 50
const MOBILE_NUMBER_MAX_DIGITS = 15
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_REGEX = new RegExp(`^\\+?\\d{6,${MOBILE_NUMBER_MAX_DIGITS}}$`)

const sanitizeMobileNumber = (value) => {
  const hasLeadingPlus = value.trim().startsWith('+')
  const digits = value.replace(/\D/g, '').slice(0, MOBILE_NUMBER_MAX_DIGITS)
  return hasLeadingPlus ? `+${digits}` : digits
}

const RsvpModal = () => {
  const [open, setOpen] = useState(false)
  const [seatInfo, setSeatInfo] = useState(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false)
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)

  const refreshSeatInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/event-rsvps/count')
      if (!res.ok) return
      setSeatInfo(await res.json())
    } catch {
      // no live count available; form still works without it
    }
  }, [])

  useEffect(() => {
    // Opens by default for every landing page visit, not just the ?rsvp= deep link.
    setOpen(true)
    refreshSeatInfo()

    const params = new URLSearchParams(window.location.search)
    if (params.has(RSVP_PARAM)) {
      params.delete(RSVP_PARAM)
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    }
  }, [refreshSeatInfo])

  useEffect(() => {
    if (open) refreshSeatInfo()
  }, [open, refreshSeatInfo])

  useEffect(() => {
    const handleOpenRequest = () => setOpen(true)
    window.addEventListener('al-huzaifa:open-rsvp', handleOpenRequest)
    return () => window.removeEventListener('al-huzaifa:open-rsvp', handleOpenRequest)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) close()
  }

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleMobileChange = (e) => {
    const sanitized = sanitizeMobileNumber(e.target.value)
    setForm((prev) => ({ ...prev, mobileNumber: sanitized }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError('')

    if (form.fullName.trim().length === 0 || form.fullName.trim().length > FULL_NAME_MAX_LENGTH) {
      setError(`Full name must be ${FULL_NAME_MAX_LENGTH} characters or fewer.`)
      return
    }
    if (!MOBILE_REGEX.test(form.mobileNumber.trim())) {
      setError(
        `Enter a valid mobile number (up to ${MOBILE_NUMBER_MAX_DIGITS} digits, with optional country code).`,
      )
      return
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/event-rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          mobileNumber: form.mobileNumber.trim(),
          email: form.email.trim().toLowerCase(),
          numberOfGuests: SINGLE_GUEST_COUNT,
        }),
      })

      if (res.status === 409) {
        await refreshSeatInfo()
        return
      }

      if (!res.ok) throw new Error('Submission failed')

      setSubmitted(true)
      setForm(EMPTY_FORM)
      refreshSeatInfo()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    if (!waitlistEmail || waitlistSubmitting) return
    setWaitlistSubmitting(true)
    try {
      await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail.trim().toLowerCase() }),
      })
      setWaitlistSubmitted(true)
      setWaitlistEmail('')
      setTimeout(() => setWaitlistSubmitted(false), 2000)
    } finally {
      setWaitlistSubmitting(false)
    }
  }

  const handleExploreClick = () => {
    close()
    window.dispatchEvent(new CustomEvent('al-huzaifa:open-experiences'))
  }

  if (!open) return null

  const isFull = seatInfo ? seatInfo.remaining <= 0 : false

  if (submitted) {
    return (
      <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.thankYouShell}>
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
              <CloseIcon />
            </button>
            <div className={styles.thankYouContent}>
              <h2 className={styles.scriptHeading}>Thank You</h2>
              <p className={styles.thankYouText}>
                Your RSVP for {EVENT_LABEL} has been received. A confirmation email will be sent
                to you shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isFull) {
    return (
      <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.soldOutShell}>
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
              <CloseIcon />
            </button>
            <div className={styles.soldOutContent}>
              <h2 className={styles.scriptHeading}>{EVENT_LABEL}</h2>
              <p className={styles.soldOutText}>
                is fully booked. Join the waitlist.
                <br />
                We&apos;ll notify you if a spot becomes available.
              </p>
              <form className={styles.waitlistForm} onSubmit={handleWaitlistSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className={styles.waitlistInput}
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                />
                <button type="submit" className={styles.notifyBtn} disabled={waitlistSubmitting}>
                  {waitlistSubmitted ? 'Subscribed' : 'Notify me'}
                </button>
              </form>
              <button type="button" className={styles.exploreLink} onClick={handleExploreClick}>
                <span className={styles.exploreLinkText}>Explore Upcoming Experiences</span>
                <span className={styles.exploreLinkArrow}>
                  <ExploreArrow />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.formShell}>
          <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
            <CloseIcon />
          </button>
          <div className={styles.formContent}>
            <h2 className={styles.scriptHeading}>{EVENT_LABEL}</h2>
            <p className={styles.description}>
              Join us for a morning of Ikebana, Pottery &amp; Creative Conversation
            </p>
            <p className={styles.dateLine}>Saturday, 1 August 2026 | 10:00 AM - 12:30 PM</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.fieldsWrap}>
                <input
                  type="text"
                  required
                  maxLength={FULL_NAME_MAX_LENGTH}
                  placeholder="Full Name"
                  className={styles.input}
                  value={form.fullName}
                  onChange={handleFieldChange('fullName')}
                />
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  maxLength={MOBILE_NUMBER_MAX_DIGITS + 1}
                  placeholder="Mobile Number"
                  className={styles.input}
                  value={form.mobileNumber}
                  onChange={handleMobileChange}
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className={styles.input}
                  value={form.email}
                  onChange={handleFieldChange('email')}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>

            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RsvpModal
