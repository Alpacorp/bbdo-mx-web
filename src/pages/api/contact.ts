/**
 * POST /api/contact — the only part of this site that is not static.
 *
 * Section 3 of the brief keeps the site static precisely because that is what
 * makes it fast and gives it almost no attack surface. This route is the
 * single exception, so it is deliberately small: parse, validate, send, answer.
 *
 * IT WORKS WITHOUT JAVASCRIPT
 *   The form posts to it natively and the endpoint answers with a 303 back to
 *   /contact/, carrying the outcome in the query string. The page reads that
 *   and renders the message server-side. JavaScript, when present, intercepts
 *   and shows the same states inline — an enhancement, never the mechanism.
 *
 * IT NEVER PRETENDS
 *   If the mail provider is not configured, or refuses, this returns an error
 *   and the page tells the visitor to write directly. The one unacceptable
 *   outcome is a green tick over a message that went nowhere: somebody with a
 *   brief to award would assume the agency ignored them.
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { topicById, FALLBACK_INBOX } from '../../contact-routing';
import { htmlBody, textBody, subjectFor } from '../../contact-email';

/** On demand: everything else on this site is prerendered. */
export const prerender = false;

/**
 * Every message is written out in Spanish. A constraint without one falls back
 * to Zod's English default, which is how a bot once got told "Too big:
 * expected string to have <=0 characters" — in English, on a Spanish site.
 */
const Enquiry = z.object({
  topic: z.string().refine((v) => topicById(v) !== undefined, 'Tema desconocido'),
  name: z.string().trim().min(2, 'Falta tu nombre').max(120, 'El nombre es demasiado largo'),
  email: z.email('Revisa el correo').max(200, 'El correo es demasiado largo'),
  company: z
    .string()
    .trim()
    .max(160, 'El nombre de la empresa es demasiado largo')
    .optional()
    .default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más')
    .max(4000, 'El mensaje es demasiado largo'),
  /** Must be checked. Mexican law requires consent at the point of collection. */
  consent: z.literal('on', { message: 'Falta aceptar el aviso de privacidad' }),
});

function back(url: URL, state: string, extra?: Record<string, string>) {
  const to = new URL('/contact/', url);
  to.searchParams.set('estado', state);
  for (const [k, v] of Object.entries(extra ?? {})) to.searchParams.set(k, v);
  return new Response(null, { status: 303, headers: { Location: to.href } });
}

interface Outgoing {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

async function send({ to, subject, text, html, replyTo }: Outgoing) {
  const key = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.CONTACT_FROM;

  /* Not configured is a deployment error, not a visitor error. Loudly. */
  if (!key || !from) {
    throw new Error('RESEND_API_KEY or CONTACT_FROM missing: mail is not configured');
  }

  /**
   * Testing only. Resend's shared sender, onboarding@resend.dev, will only
   * deliver to the address the Resend account is registered to — anything else
   * comes back as a 403. So while a domain is not verified, CONTACT_TO_OVERRIDE
   * points every enquiry at that one address.
   *
   * It must not be set in production: with it set, a real new-business enquiry
   * would go to whoever is named here and never reach the agency. The subject
   * carries the inbox it was meant for so a test message is never mistaken for
   * a real one.
   */
  const override = import.meta.env.CONTACT_TO_OVERRIDE;
  const recipient = override || to;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [recipient], subject, text, html, reply_to: replyTo }),
  });

  if (!res.ok) {
    /* Resend explains its refusals in the body — an unverified sender and an
       unauthorised recipient both come back as 403, and without the body they
       look identical. */
    const detail = await res.text().catch(() => '');
    throw new Error(`Mail provider answered ${res.status}: ${detail.slice(0, 300)}`);
  }

  /* The provider's id for the message, logged and nothing else. It is the only
     way to answer "did this actually go out?" weeks later without the sender
     and the agency comparing inboxes. No names, no addresses, no message: the
     id is enough to look it up, and the log is not where personal data goes. */
  const { id } = (await res.json().catch(() => ({}))) as { id?: string };
  console.info(`[contact] enviado, id ${id ?? 'desconocido'}`);
}

export const POST: APIRoute = async ({ request, url }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json');

  const form = await request.formData();

  /* The honeypot is checked BEFORE validation and is not part of the schema.
     Inside it, a filled trap becomes a validation failure, which both tells the
     bot it was caught and shows a real visitor an error about a field they
     cannot see. Answering success and sending nothing is the point. */
  if (String(form.get('website') ?? '')) {
    return wantsJson
      ? new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      : back(url, 'ok');
  }

  const parsed = Enquiry.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Revisa los datos';
    return wantsJson
      ? new Response(JSON.stringify({ ok: false, error: first }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        })
      : back(url, 'datos', { motivo: first });
  }

  const data = parsed.data;

  const topic = topicById(data.topic)!;
  const inbox = topic.inbox ?? FALLBACK_INBOX;
  try {
    const enquiry = {
      topic,
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    };

    await send({
      to: inbox,
      subject: subjectFor(enquiry, topic.inbox === null, import.meta.env.CONTACT_TO_OVERRIDE),
      text: textBody(enquiry, topic.inbox === null),
      html: htmlBody(enquiry, topic.inbox === null),
      replyTo: data.email,
    });
  } catch (error) {
    console.error('[contact] send failed:', error);
    return wantsJson
      ? new Response(JSON.stringify({ ok: false, error: 'envio' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        })
      : back(url, 'error');
  }

  return wantsJson
    ? new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    : back(url, 'ok');
};
