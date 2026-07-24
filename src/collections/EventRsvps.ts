import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'
import { buildRsvpEmailHtml } from './emails/rsvpConfirmationEmail'

export const EVENT_SLUG = 'ikebana-morning-2026-08-01'
const EVENT_LABEL = 'The Art of Waiting'
const SENDER_NAME = 'Al Huzaifa Summer Lounging'

const LOG_TAG = '[RSVP-EMAIL]'

const sendBrevo = async (payload: {
  sender: { email: string; name: string }
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
}) => {
  const recipients = payload.to.map((t) => t.email).join(', ')
  const apiKey = (process.env.BREVO_API_KEY || '').trim()
  if (!apiKey) {
    console.error(`${LOG_TAG} ABORTED — BREVO_API_KEY not set. Would have sent to: ${recipients}`)
    return
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`${LOG_TAG} attempt ${attempt} — calling Brevo API, sender=${payload.sender.email}, to=${recipients}, subject="${payload.subject}"`)
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
      console.log(`${LOG_TAG} SUCCESS — Brevo accepted email for ${recipients}. Response: ${text}`)
      return
    } catch (err: any) {
      clearTimeout(timer)
      console.error(`${LOG_TAG} FAILED attempt ${attempt} for ${recipients}:`, err?.message)
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
        console.log(`${LOG_TAG} afterChange hook fired — operation=${operation}, docId=${doc?.id}`)
        if (operation !== 'create') {
          console.log(`${LOG_TAG} skipped — not a create operation`)
          return
        }

        const verifiedSender = process.env.VERIFIED_SENDER || process.env.ADMIN_EMAIL
        const adminEmail = process.env.ADMIN_EMAIL

        console.log(
          `${LOG_TAG} config check — verifiedSender=${verifiedSender || '(missing)'}, adminEmail=${adminEmail || '(missing)'}, guestEmail=${doc.email || '(missing)'}`,
        )

        if (!verifiedSender) {
          console.error(`${LOG_TAG} ABORTED — VERIFIED_SENDER or ADMIN_EMAIL not set`)
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
            }).catch((err) => console.error(`${LOG_TAG} Failed to send admin email:`, err)),
          )
        } else {
          console.log(`${LOG_TAG} skipping admin email — ADMIN_EMAIL not set`)
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
            }).catch((err) => console.error(`${LOG_TAG} Failed to send user confirmation email:`, err)),
          )
        } else {
          console.log(`${LOG_TAG} skipping guest email — no email on this RSVP doc`)
        }

        console.log(`${LOG_TAG} queued ${emailTasks.length} email task(s), waiting for completion...`)
        const results = await Promise.allSettled(emailTasks)
        console.log(`${LOG_TAG} done — results: ${results.map((r) => r.status).join(', ')}`)
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
