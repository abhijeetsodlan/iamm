This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Form email setup

Before deploying the IT assessment form, run
`supabase/migrations/20261017_it_assessment.sql` in the Supabase SQL editor.
This adds nullable security, cloud spending, and IT support fields to existing
assessment tables. New installations can run `supabase/schema.sql` instead.
Apply this migration before deploying the code; both submissions and the admin
assessment query expect these columns.

Copy `.env.example` to `.env.local` and fill in your Supabase settings and
`GMAIL_APP_PASSWORD`. This must be a Google App Password for
`abhijeet.pushingcode@gmail.com`, not your normal Google password. Enable 2-Step
Verification and generate an App Password at https://myaccount.google.com/apppasswords.
Keep it server-only, never use a `NEXT_PUBLIC_` prefix, and never commit it.
Set the same variable in your hosting environment and redeploy.

The HTML/plain-text template, sender, recipient and Gmail SMTP settings are in
`lib/assessmentEmail.ts`. Sender: `IAMM Solutions <abhijeet.pushingcode@gmail.com>`.
Recipient: `info@iammllc.com`. Submitted HTML content is escaped.
`ASSESSMENT_REPLY_TO_EMAIL` overrides the reply address; remove it to reply
directly to the assessment submitter.

Both form endpoints validate input, save to Supabase, then send notifications.
Contact and assessment templates are in `lib/assessmentEmail.ts`.
Missing Gmail credentials return 503 before saving. If email fails after saving,
the lead remains in the admin dashboard and a notification failure is logged.
There is no automatic retry. SMTP acceptance does not prove inbox delivery;
confirm receipt during an authorized live test. Your host must allow outgoing
TLS SMTP connections to smtp.gmail.com:465.

Run `node --test --experimental-test-isolation=none tests/assessment.test.mjs` for mocked API tests. These do not send
live email or modify your database. The contact form uses `app/api/contact/route.ts` to save contact, quote and project enquiries, then sends a matching branded notification through the same Gmail transport.

## IAMM AI chatbot

Add `GEMINI_API_KEY` to `.env.local` and to your Vercel environment, then restart
development or redeploy. Keep this key server-only. `GEMINI_MODEL` optionally
overrides the default `gemini-3.1-flash-lite`; choose a Gemini model that supports
structured JSON output and is available for your project. Free-tier quotas and
model availability are controlled by Google, not by the key's display name.

If your key is in `.env`, do not leave an empty `GEMINI_API_KEY=` in
`.env.local`: Next.js gives `.env.local` precedence, even when the value is empty.
Keep the key in one local environment file and restart the dev server after
changing it. A successful models-list request verifies authentication; a live
generation and `/api/chat` request are needed to verify actual chat operation.

- `components/chat/Chatbot.tsx`: chat window, suggested questions and approved links.
- `app/api/chat/route.ts`: input validation, Gemini REST call and error handling.
- `lib/chatbot.ts`: IAMM scope rules and knowledge assembled from `lib/site.ts`.
- `lib/site.ts`: shared services, plans, projects and process; plan changes here
  update both the Plans page and the chatbot context.

The widget appears on public pages and is hidden on admin routes. It keeps chat
in page memory only; no chat tables or Supabase migration are needed. A request
sends the latest four exchanges plus the new question to Google. There are no
tools, browsing, database reads, automatic form submissions or email actions.
Responses are displayed as escaped text; navigation uses fixed approved links.
Scope instructions and a structured relevance flag redirect off-topic requests,
but model-based topic control is not a guarantee against all prompt injection.
Confirm pricing and support commitments with IAMM.

Requests are limited to 1,200 characters per question, nine history messages,
32 KB per request, six requests per visitor/minute and 30 per server instance/minute.
The in-memory limits reset on cold starts and are not shared across Vercel
instances. They are best-effort controls, not a hard spending cap. Set provider
quotas and configure a Vercel firewall rate-limit rule on `/api/chat` for
deployment-wide protection. Never assume the free tier provides unlimited usage.
Provider outages, blocked responses and quota exhaustion offer a contact fallback.
Messages are processed by Google; free-tier content may be used for product
improvement. The chat and privacy page disclose this and advise against sensitive
details. No visitor message or provider response body is logged by the chat route.

Run `node --test --experimental-test-isolation=none tests/chat.test.mjs tests/assessment.test.mjs`
for mocked checks. Before launch, add the real key and manually check service
questions, plan comparisons, contextual follow-ups, unrelated requests, attempted
role overrides, quota errors and mobile/keyboard interaction. Mocked checks do
not establish Gemini's real response quality or perfect topic adherence.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
