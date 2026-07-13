import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://campaigns.alhuzaifa.com'),
  title: 'Summer Lounging | A State of Mind - Al Huzaifa Furniture Events',
  description:
    'Slow down, settle in, stay a while. Join Al Huzaifa Summer Lounging — an in-store summer experience with the Listening Lounge, Matcha Moments, and Mindful Movements wellness events.',
  keywords: [
    'Al Huzaifa Summer Lounging',
    'Al Huzaifa events',
    'Al Huzaifa furniture events',
    'summer lounging Dubai',
    'in-store summer experience UAE',
    'Listening Lounge Al Huzaifa',
    'Matcha Moments Al Huzaifa',
    'Mindful Movements Al Huzaifa',
    'luxury furniture UAE',
    'Al Huzaifa Dubai',
  ],
  openGraph: {
    title: 'Summer Lounging | A State of Mind — Al Huzaifa Furniture Events',
    description:
      'Slow down, settle in, stay a while. Discover the Al Huzaifa in-store Summer Lounging experience — curated music, matcha rituals, and mindful movement events.',
    url: 'https://campaigns.alhuzaifa.com',
    siteName: 'Al Huzaifa Summer Lounging',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Al Huzaifa Summer Lounging',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summer Lounging | A State of Mind — Al Huzaifa Furniture Events',
    description:
      'Slow down, settle in, stay a while. Discover the Al Huzaifa in-store Summer Lounging experience — curated music, matcha rituals, and mindful movement events.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/PPHatton-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/modernline-personal-use.bold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/landing-hero.webp"
          as="image"
          type="image/webp"
          media="(min-width: 641px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/landing-hero-mobile.webp"
          as="image"
          type="image/webp"
          media="(max-width: 640px)"
          fetchPriority="high"
        />
      </head>
      <body>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
