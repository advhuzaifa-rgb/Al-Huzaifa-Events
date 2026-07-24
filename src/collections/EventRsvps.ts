import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'
import { buildRsvpEmailHtml } from './emails/rsvpConfirmationEmail'

export const EVENT_SLUG = 'ikebana-morning-2026-08-01'
const EVENT_LABEL = 'The Art of Waiting'
const SENDER_NAME = 'Al Huzaifa Summer Lounging'

const sendBrevo = async (payload: {
  sender: { email: string; name: string }
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
}) => {
  const apiKey = (process.env.BREVO_API_KEY || '').trim()
  if (!apiKey) {
    console.error('BREVO_API_KEY not set')
    return
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 10000)
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      const text = await res.text().catch(() => '<no-body>')
      if (!res.ok) throw new Error(`Brevo ${res.status}: ${text}`)
      console.log(`Brevo email sent (attempt ${attempt})`)
      return
    } catch (err: any) {
      clearTimeout(timer)
      console.error(`Brevo attempt ${attempt} failed:`, err?.message)
      if (attempt === 2) throw err
      await new Promise((r) => setTimeout(r, 400))
    }
  }
}

const detailRow = (label: string, value: unknown) =>
  `<tr><td style="padding:8px;border:1px solid #ddd"><strong>${label}</strong></td><td style="padding:8px;border:1px solid #ddd">${value ?? '—'}</td></tr>`

const buildAdminNotificationHtml = (doc: {
  fullName: string
  mobileNumber: string
  email: string
  numberOfGuests: number
  createdAt?: string
}) => `
  <div style="font-family:Arial,Helvetica,sans-serif; max-width:520px; margin:0 auto; padding:20px;">
    <h2 style="color:#333; margin:0 0 16px 0;">New RSVP submitted — ${EVENT_LABEL}</h2>
    <table style="border-collapse:collapse; width:100%;">
      ${detailRow('Name', doc.fullName)}
      ${detailRow('Mobile', doc.mobileNumber)}
      ${detailRow('Email', doc.email)}
      ${detailRow('Number of Guests', doc.numberOfGuests)}
    </table>
    <p style="color:#999; font-size:12px; margin-top:16px;">Submitted on ${doc.createdAt || new Date().toISOString()}</p>
  </div>
`

export const getSeatLimit = () => {
  const parsed = Number(process.env.RSVP_SEAT_LIMIT)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50
}

const getFilledSeats = async (req: PayloadRequest) => {
  const { docs } = await req.payload.find({
    collection: 'event-rsvps',
    where: { event: { equals: EVENT_SLUG } },
    pagination: false,
    depth: 0,
  })
  return docs.reduce((sum, doc) => sum + (doc.numberOfGuests || 0), 0)
}

export const EventRsvps: CollectionConfig = {
  slug: 'event-rsvps',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'numberOfGuests', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  endpoints: [
    {
      path: '/count',
      method: 'get',
      handler: async (req) => {
        const limit = getSeatLimit()
        const filled = await getFilledSeats(req)
        return Response.json({
          filled,
          remaining: Math.max(limit - filled, 0),
          limit,
        })
      },
    },
    {
      // Temporary — reports only whether the Brevo env vars are visible to this
      // deployment, never the actual key. Safe to hit directly in a browser.
      // Remove once email delivery is confirmed working.
      path: '/email-diagnostics',
      method: 'get',
      handler: async () => {
        const apiKey = (process.env.BREVO_API_KEY || '').trim()
        return Response.json({
          brevoApiKeyConfigured: apiKey.length > 0,
          brevoApiKeyLastFour: apiKey ? apiKey.slice(-4) : null,
          adminEmail: process.env.ADMIN_EMAIL || null,
          verifiedSender: process.env.VERIFIED_SENDER || null,
        })
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation !== 'create') return data

        data.event = EVENT_SLUG

        const limit = getSeatLimit()
        const filled = await getFilledSeats(req)
        const requested = Number(data.numberOfGuests) || 0

        if (filled + requested > limit) {
          throw new APIError('This experience is full.', 409)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const verifiedSender = process.env.VERIFIED_SENDER || process.env.ADMIN_EMAIL
        const adminEmail = process.env.ADMIN_EMAIL

        if (!verifiedSender) {
          console.error('VERIFIED_SENDER or ADMIN_EMAIL not set')
          return
        }

        const emailTasks: Promise<void>[] = []

        if (adminEmail) {
          emailTasks.push(
            sendBrevo({
              sender: { email: verifiedSender, name: SENDER_NAME },
              to: [{ email: adminEmail, name: 'Admin' }],
              subject: `New RSVP — ${doc.fullName} (${doc.numberOfGuests} guests) | ${EVENT_LABEL}`,
              htmlContent: buildAdminNotificationHtml({
                fullName: doc.fullName,
                mobileNumber: doc.mobileNumber,
                email: doc.email,
                numberOfGuests: doc.numberOfGuests,
                createdAt: doc.createdAt,
              }),
            }).catch((err) => console.error('Failed to send admin email:', err)),
          )
        }

        if (doc.email) {
          emailTasks.push(
            sendBrevo({
              sender: { email: verifiedSender, name: SENDER_NAME },
              to: [{ email: doc.email, name: doc.fullName }],
              subject: `Event confirmation | ${EVENT_LABEL}`,
              htmlContent: buildRsvpEmailHtml({
                name: doc.fullName,
                numberOfGuests: doc.numberOfGuests,
              }),
            }).catch((err) => console.error('Failed to send user confirmation email:', err)),
          )
        }

        await Promise.allSettled(emailTasks)
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'mobileNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'instagram',
      type: 'text',
      required: false,
      admin: {
        description: 'No longer collected on the frontend form; kept optional for any older submissions.',
      },
    },
    {
      name: 'numberOfGuests',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'event',
      type: 'text',
      required: true,
      defaultValue: EVENT_SLUG,
      admin: {
        readOnly: true,
        description: 'Set automatically by the server; identifies which event this RSVP belongs to.',
      },
    },
  ],
  timestamps: true,
}
