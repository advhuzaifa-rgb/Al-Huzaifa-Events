import type { CollectionConfig, PayloadRequest } from 'payload'
import { APIError } from 'payload'

export const EVENT_SLUG = 'ikebana-morning-2026-08-01'

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
