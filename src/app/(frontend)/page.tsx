import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import config from '@/payload.config'
import './globals.css'
import Footer from './Components/Footer/Footer'
import TextContainer from './Components/TextContainer/TextContainer'
import Landing from './Components/Landing/Landing'
import Journal from './Components/Journal/Journal'
import NewsletterSection from './Components/NewsletterSection/NewsletterSection'
import Playlist from './Components/Playlist/Playlist'
import Styling from './Components/Styling/Styling'
import Experience from './Components/Experience/Experience'


export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
    <Landing />
      <TextContainer />
      <Experience />
      <Playlist />
      <Styling />
      <NewsletterSection />
      <Journal />
      <Footer />
    </>
  )
}
