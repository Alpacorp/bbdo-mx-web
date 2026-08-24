/**
 * contact-email.ts — what the agency actually receives.
 *
 * The enquiry used to arrive as a flat block of labels. It works, but it lands
 * in an inbox where somebody decides in two seconds whether this is a pitch, a
 * CV or a press request, and it usually lands on a phone.
 *
 * WHY EMAIL HTML LOOKS LIKE 2005
 *   Because Outlook renders with Word. Tables for layout, styles inline, no
 *   stylesheet, no flexbox, no grid, no web fonts. This is not sloppiness, it
 *   is the format.
 *
 * NO REMOTE IMAGES, DELIBERATELY
 *   Not even the logo from a URL. Every remote image in an email is a tracking
 *   pixel whether or not it was meant as one: it tells a server the moment
 *   somebody opens the message, and from which network. This message carries
 *   another person's name, address and words, so it does not phone home. The
 *   wordmark is type.
 *
 * BOTH PARTS, ALWAYS
 *   Resend takes `html` and `text` together. A message with only HTML looks
 *   broken wherever images and styles are blocked, and scores worse on spam
 *   filters. The plain text version is not a fallback nobody sees, it is what
 *   half of the clients in the world will show.
 */
import type { Topic } from './contact-routing';

export interface Enquiry {
  topic: Topic;
  name: string;
  email: string;
  company: string;
  message: string;
}

/**
 * Everything below goes into an HTML document, and all of it is typed by a
 * stranger. Without escaping, a message containing a tag would rewrite the
 * email the agency reads.
 */
function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Blank lines become paragraphs, single breaks stay breaks. */
function paragraphs(message: string): string {
  return message
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#161616;">${escape(
          block
        ).replace(/\n/g, '<br>')}</p>`
    )
    .join('');
}

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * Subject lines are read in a 40-character preview on a phone. Leading with
 * bracketed tags spends that budget on punctuation, so the topic, the person
 * and the company come first and the operational tags go last.
 */
export function subjectFor(enquiry: Enquiry, misrouted: boolean, testTo?: string): string {
  const who = [enquiry.name, enquiry.company].filter(Boolean).join(' · ');
  const tail = [misrouted ? 'SIN BUZÓN PROPIO' : null, testTo ? `PRUEBA → ${testTo}` : null]
    .filter(Boolean)
    .join(' · ');
  return `${enquiry.topic.label} · ${who}${tail ? ` · ${tail}` : ''}`;
}

export function textBody(enquiry: Enquiry, misrouted: boolean): string {
  return [
    misrouted
      ? 'AVISO: este tema no tiene buzón propio todavía. Reenvíalo a quien corresponda.\n'
      : null,
    `Tema:    ${enquiry.topic.label}`,
    `Nombre:  ${enquiry.name}`,
    enquiry.company ? `Empresa: ${enquiry.company}` : null,
    `Correo:  ${enquiry.email}`,
    '',
    enquiry.message,
    '',
    '—',
    'Enviado desde el formulario de bbdomexico.com.',
    'Responde a este correo y le llega directamente a quien escribió.',
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export function htmlBody(enquiry: Enquiry, misrouted: boolean): string {
  const { topic, name, email, company, message } = enquiry;

  /* The preview line, hidden in the body. Without it clients preview whatever
     text comes first, which would be the wordmark. */
  const preheader = `${topic.label} · ${name}${company ? ` · ${company}` : ''}`;

  const aviso = misrouted
    ? `<tr><td style="padding:12px 32px;background:#a8001b;color:#ffffff;font:600 13px/1.5 ${SANS};">
         Este tema todavía no tiene buzón propio. Llega aquí por defecto: reenvíalo a quien corresponda.
       </td></tr>`
    : '';

  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(preheader)}</title>
<style>
  /* Apple Mail turns anything that looks like a domain, a date or a phone
     number into a link with its own blue, ignoring the surrounding design —
     which is how "bbdomexico.com" arrived in blue on a black footer. These
     selectors are the only way to take that styling back. */
  a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;">
<tr><td align="center" style="padding:24px 12px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">

    <tr><td style="padding:20px 32px;background:#161616;">
      <span style="font:700 20px/1 ${SANS};letter-spacing:0.06em;color:#ff0000;">BBDO</span>
      <span style="font:400 20px/1 ${SANS};letter-spacing:0.06em;color:#ffffff;"> MÉXICO</span>
    </td></tr>

    ${aviso}

    <tr><td style="padding:32px 32px 0;">
      <span style="display:inline-block;padding:5px 10px;background:#ff0000;color:#ffffff;font:600 11px/1 ${SANS};letter-spacing:0.1em;text-transform:uppercase;">${escape(topic.label)}</span>
    </td></tr>

    <tr><td style="padding:16px 32px 0;">
      <h1 style="margin:0;font:600 26px/1.2 ${SANS};color:#161616;">${escape(name)}</h1>
      ${company ? `<p style="margin:4px 0 0;font:400 16px/1.4 ${SANS};color:#666666;">${escape(company)}</p>` : ''}
    </td></tr>

    <tr><td style="padding:24px 32px 0;">
      <div style="border-top:2px solid #161616;padding-top:24px;font-family:${SANS};">
        ${paragraphs(message)}
      </div>
    </td></tr>

    <tr><td style="padding:8px 32px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f7f7;">
        <tr><td style="padding:16px 20px;font:400 14px/1.6 ${SANS};color:#404040;">
          Responde a este correo y le llega directamente a
          <a href="mailto:${escape(email)}" style="color:#a8001b;font-weight:600;">${escape(email)}</a>.
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:16px 32px;background:#161616;font:400 12px/1.5 ${SANS};color:#9a9a9a;">
      Enviado desde el formulario de <a href="https://bbdomexico.com/" style="color:#9a9a9a;text-decoration:none;">bbdomexico.com</a>
    </td></tr>

  </table>

</td></tr></table>
</body></html>`;
}
