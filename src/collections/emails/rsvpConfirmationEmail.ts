const CORAL = '#CD7060'
const BODY_TEXT = '#554E4E'
const VALUE_TEXT = 'rgba(65, 65, 65, 0.9)'
// Dictated as "#0000", which isn't a resolvable color — using a soft neutral
// divider that matches the card's cream/tan palette until the real value is confirmed.
const DIVIDER_COLOR = 'rgba(0, 0, 0, 0.15)'
const GRADIENT_BG = 'linear-gradient(180deg, #F5F2ED 0%, #E6DACC 55%, #EFD2B7 100%)'
const FALLBACK_BG = '#EFD2B7'

const POPPINS_STACK = `'Poppins', Helvetica, Arial, sans-serif`
// The site's custom "Modernline" script font is a local file and can't be embedded
// in email clients reliably (most strip @font-face) — falls back to a system cursive font.
const SCRIPT_STACK = `'Brush Script MT', 'Segoe Script', cursive`

const EVENT_DATE_LINES = ['Saturday, 1st Aug, 2026', '10:00 AM- 12:30PM']
const EVENT_LOCATION_LINES = [
  'Al Huzaifa, Al Wasl Flagship',
  '(Next to Emirates Islamic, Shop No 7)',
]

const row = (content: string, paddingTop: number) => `
  <tr>
    <td align="center" style="padding-top:${paddingTop}px;">${content}</td>
  </tr>
`

const divider = () => `
  <tr>
    <td align="center" style="padding-top:20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="rsvp-divider" style="width:163px; height:1px; line-height:1px; font-size:1px; background-color:${DIVIDER_COLOR};">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
`

const labelText = (text: string) =>
  `<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:500; font-size:16px; color:${CORAL};">${text}</p>`

const valueText = (lines: string[]) =>
  `<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:500; font-size:16px; line-height:23px; color:${VALUE_TEXT};">${lines.join('<br/>')}</p>`

export const buildRsvpEmailHtml = ({
  name,
  numberOfGuests,
}: {
  name: string
  numberOfGuests: number
}) => {
  const guestCount = String(numberOfGuests).padStart(2, '0')

  return `
<style>
  @media only screen and (max-width: 600px) {
    .rsvp-card { width: 100% !important; }
    .rsvp-pad { padding: 24px 20px !important; }
    .rsvp-desc { max-width: 100% !important; }
    .rsvp-divider { width: 110px !important; }
  }
</style>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${FALLBACK_BG};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="556" cellpadding="0" cellspacing="0" border="0" class="rsvp-card" style="width:556px; max-width:556px; background:${GRADIENT_BG}; background-color:${FALLBACK_BG};">
        <tr>
          <td class="rsvp-pad" style="padding:34px 48px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${row(`<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:400; font-size:16px; color:${BODY_TEXT};">Hi,</p>`, 0)}
              ${row(`<p style="margin:0; font-family:${SCRIPT_STACK}; font-weight:400; font-size:24px; color:${CORAL};">${name}</p>`, 0)}
              ${row(
                `<p class="rsvp-desc" style="margin:0 auto; max-width:455px; font-family:${POPPINS_STACK}; font-weight:400; font-size:16px; line-height:21px; color:${BODY_TEXT};">Your place has been reserved for The Art of Waiting. We look forward to welcoming you to a complimentary morning of ikebana, pottery and meaningful conversation, as part of Summer Lounging: A State of Mind.</p>`,
                10,
              )}
              ${row(
                `<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:500; font-size:16px; line-height:23px; color:${CORAL};">${name}</p>`,
                30,
              )}
              ${row(
                `<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:500; font-size:16px; line-height:23px; color:${CORAL};">Number of Attendees: ${guestCount}</p>`,
                0,
              )}
              ${divider()}
              ${row(labelText('DATE &amp; TIME'), 20)}
              ${row(valueText(EVENT_DATE_LINES), 10)}
              ${divider()}
              ${row(labelText('LOCATION'), 20)}
              ${row(valueText(EVENT_LOCATION_LINES), 10)}
              ${row(
                `<p style="margin:0; font-family:${POPPINS_STACK}; font-weight:400; font-size:16px; line-height:21px; color:${BODY_TEXT};">We look forward to sharing this morning with you.<br/><br/>Warm regards,<br/>The Al Huzaifa Team</p>`,
                50,
              )}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}
