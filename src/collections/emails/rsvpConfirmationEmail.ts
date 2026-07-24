const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const CORAL = '#CD7060'
const BODY_TEXT = '#554E4E'
const VALUE_TEXT = 'rgba(65,65,65,0.9)'
const DIVIDER_COLOR = '#554E4E'
const GRADIENT_TOP = '#F5F2ED'
const GRADIENT_BOTTOM = '#F9E8D7'
const HEADER_IMG = 'https://campaigns.alhuzaifa.com/emailertop.png'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export function buildRsvpEmailHtml({ name }: { name: string; numberOfGuests?: number | string }): string {
  const safeName = escapeHtml(name)

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Your place is reserved</title>
<style type="text/css">
@media only screen and (max-width: 620px) {
  .container { width: 100% !important; }
  .card { width: 100% !important; }
  .card-pad { padding-left: 20px !important; padding-right: 20px !important; }
  .desc { width: 100% !important; }
}
</style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; -webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
<tr>
<td align="center" style="padding:0;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px; max-width:600px;">
<tr>
<td style="padding:0;">
<img src="${HEADER_IMG}" width="600" alt="Al Huzaifa — Summer Lounging: A State of Mind" style="display:block; width:100%; max-width:600px; height:auto; border:0; outline:none; text-decoration:none;" />
</td>
</tr>
<tr>
<td align="center" style="padding:0 22px;">
<div style="margin-top:-53px;">
<table role="presentation" width="556" cellpadding="0" cellspacing="0" border="0" class="card" bgcolor="${GRADIENT_BOTTOM}" style="width:556px; max-width:556px; background-color:${GRADIENT_BOTTOM}; background-image:linear-gradient(180deg, ${GRADIENT_TOP} 0%, ${GRADIENT_BOTTOM} 100%); border-radius:8px 8px 0 0;">
<tr>
<td align="center" class="card-pad" style="padding:44px 34px 45px 34px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="font-family:${FONT}; font-size:16px; line-height:21px; font-weight:400; color:${BODY_TEXT};">Hi,</td>
</tr>
<tr>
<td align="center" style="padding-top:6px; font-family:${FONT}; font-size:24px; line-height:28px; font-weight:500; color:${CORAL};">${safeName}</td>
</tr>
<tr>
<td align="center" style="padding-top:16px;">
<table role="presentation" width="455" cellpadding="0" cellspacing="0" border="0" class="desc" style="width:455px; max-width:455px;">
<tr>
<td align="center" style="font-family:${FONT}; font-size:16px; line-height:21px; font-weight:400; color:${BODY_TEXT};">Your place has been reserved for <span style="color:${CORAL};">The Art of Waiting.</span><br />We look forward to welcoming you to a complimentary morning of ikebana, pottery and meaningful conversation, as part of Summer Lounging: A State of Mind.</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding-top:40px; font-family:${FONT}; font-size:16px; line-height:20px; font-weight:400; color:${CORAL};">DATE &amp; TIME</td>
</tr>
<tr>
<td align="center" style="padding-top:10px; font-family:${FONT}; font-size:16px; line-height:23px; font-weight:400; color:${VALUE_TEXT};">Saturday, 1st Aug, 2026<br />10:00 AM - 12:30 PM</td>
</tr>
<tr>
<td align="center" style="padding-top:20px;">
<table role="presentation" width="163" cellpadding="0" cellspacing="0" border="0" style="width:163px;">
<tr>
<td style="border-top:1px solid ${DIVIDER_COLOR}; font-size:0; line-height:0;">&nbsp;</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding-top:20px; font-family:${FONT}; font-size:16px; line-height:20px; font-weight:400; color:${CORAL};">LOCATION</td>
</tr>
<tr>
<td align="center" style="padding-top:10px; font-family:${FONT}; font-size:16px; line-height:23px; font-weight:400; color:${VALUE_TEXT};">Al Huzaifa, Al Wasl Flagship<br />( Next to Emirates Islamic, Shop No 7 )</td>
</tr>
<tr>
<td align="center" style="padding-top:50px; font-family:${FONT}; font-size:16px; line-height:21px; font-weight:400; color:${BODY_TEXT};">We look forward to sharing this morning with you.<br /><br />Warm regards,<br />The Al Huzaifa Team</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}
