'use client'
import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import styles from './page.module.css'

const LANDING_URL = 'https://open.spotify.com/playlist/2u7iWbJ2pstbwTZJSAfWha'
const PNG_SIZE = 2048 // high-res output for print

const page = () => {
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadSvg = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'al-huzaifa-campaigns-qr.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadPng = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const source = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = PNG_SIZE
      canvas.height = PNG_SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // white background so the QR stays scannable on any surface
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, PNG_SIZE, PNG_SIZE)
      ctx.drawImage(img, 0, 0, PNG_SIZE, PNG_SIZE)

      canvas.toBlob((blob) => {
        if (!blob) return
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = 'al-huzaifa-campaigns-qr.png'
        link.click()
        URL.revokeObjectURL(pngUrl)
      }, 'image/png')

      URL.revokeObjectURL(svgUrl)
    }
    img.src = svgUrl
  }

  return (
    <main className={styles.wrapper}>
      <div className={styles.glow} />
      <header className={styles.topbar}>
        <span className={styles.brandMark}>AlHuzaifa</span>
      </header>
      <section className={styles.content}>
        <p className={styles.eyebrow}>Launching soon</p>
        <h1 className={styles.wordmark}>Al-Huzaifa</h1>
        <h2 className={styles.headline}>Something refined is on its way</h2>
        <p className={styles.subtext}>
          We are putting the final touches on an experience worth the wait.
          Our new home goes live shortly , stay close.
        </p>
        <div className={styles.qrCard}>
          <div className={styles.qrFrame} ref={qrRef}>
            <QRCodeSVG value={LANDING_URL} size={220} level="H" marginSize={4} />
          </div>
          <div className={styles.qrText}>
            <p className={styles.qrTitle}>Scan to visit</p>
            <p className={styles.qrHint}>Point your camera here once we launch</p>
          </div>
          <div className={styles.qrButtons}>
            <button className={styles.qrButton} onClick={downloadSvg}>
              Download QR (SVG)
            </button>
            <button className={styles.qrButton} onClick={downloadPng}>
              Download QR (PNG)
            </button>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Al Huzaifa. All rights reserved.</span>
      </footer>
    </main>
  )
}

export default page