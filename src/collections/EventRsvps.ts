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

        const emailHtml = buildRsvpEmailHtml({
          name: doc.fullName,
          numberOfGuests: doc.numberOfGuests,
        })

        const emailTasks: Promise<void>[] = []

        if (adminEmail) {
          emailTasks.push(
            sendBrevo({
              sender: { email: verifiedSender, name: SENDER_NAME },
              to: [{ email: adminEmail, name: 'Admin' }],
              subject: `New RSVP — ${doc.fullName} (${doc.numberOfGuests} guests) | ${EVENT_LABEL}`,
              htmlContent: emailHtml,
            }).catch((err) => console.error('Failed to send admin email:', err)),
          )
        }

        if (doc.email) {
          emailTasks.push(
            sendBrevo({
              sender: { email: verifiedSender, name: SENDER_NAME },
              to: [{ email: doc.email, name: doc.fullName }],
              subject: `Event confirmation | ${EVENT_LABEL}`,
              htmlContent: emailHtml,
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
