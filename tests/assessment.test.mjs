import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const code = ts.transpileModule(fs.readFileSync('app/api/assessment/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

const valid = { name: 'Test Lead', company: 'Example', email: 'lead@example.com', industry: 'Services', challenges: 'Manual reporting' };

async function run(body, options = {}) {
  const previousEnv = { ...process.env };
  const previousFetch = global.fetch;
  const previousError = console.error;
  const emails = [], inserts = [];
  try {
    Object.assign(process.env, {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-public-key',
      GMAIL_APP_PASSWORD: 'test-app-password',
      ASSESSMENT_REPLY_TO_EMAIL: 'abhijeet.pushingcode@gmail.com',
    });
    if (options.noKey) delete process.env.GMAIL_APP_PASSWORD;
    global.fetch = async () => { throw new Error('Unexpected live HTTP request'); };
    console.error = () => {};
    const loaded = { exports: {} };
    const mockRequire = (name) => {
      if (name === '@/lib/assessmentEmail') {
        const emailModule = { exports: {} };
        const emailCode = ts.transpileModule(fs.readFileSync('lib/assessmentEmail.ts', 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
        }).outputText;
        new Function('exports', 'require', 'module', emailCode)(emailModule.exports, (dependency) => {
          assert.equal(dependency, 'nodemailer');
          return { createTransport: (config) => {
            assert.equal(config.host, 'smtp.gmail.com');
            assert.equal(config.port, 465);
            assert.equal(config.secure, true);
            assert.equal(config.auth.user, 'abhijeet.pushingcode@gmail.com');
            return { sendMail: async (message) => {
              emails.push({ body: message });
              if (options.networkError) throw new Error('SMTP unavailable');
              return { accepted: options.emailError ? [] : ['info@iammllc.com'] };
            } };
          } };
        }, emailModule);
        return emailModule.exports;
      }
      assert.equal(name, '@supabase/supabase-js');
      return { createClient: () => ({ from: (table) => ({ insert: async (payload) => {
        inserts.push({ table, payload });
        return { error: options.databaseError ? { message: 'Database unavailable' } : null };
      } }) }) };
    };
    const routeCode = options.contact ? ts.transpileModule(fs.readFileSync('app/api/contact/route.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText : code;
    new Function('exports', 'require', 'module', routeCode)(loaded.exports, mockRequire, loaded);
    const response = await loaded.exports.POST(new Request('http://localhost/api/assessment', {
      method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body),
    }));
    return { status: response.status, result: await response.json(), emails, inserts };
  } finally {
    global.fetch = previousFetch;
    console.error = previousError;
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key];
    Object.assign(process.env, previousEnv);
  }
}

test('saves assessment and sends notification only to the configured business inbox', async () => {
  const technologyAnswers = { security_needs: 'Review backups', cloud_spend: '£500/month on Azure', it_support_needs: 'Help with device onboarding' };
  const { status, result, emails, inserts } = await run({ ...valid, ...technologyAnswers, name: ' Test Lead ', status: 'approved', to: 'attacker@example.com' });
  assert.equal(status, 200);
  assert.equal(result.notificationSent, true);
  assert.equal(inserts[0].table, 'assessment_submissions');
  assert.equal(inserts[0].payload.name, 'Test Lead');
  assert.equal(inserts[0].payload.status, undefined);
  assert.equal(emails[0].body.to, 'info@iammllc.com');
  assert.deepEqual(emails[0].body.from, { name: 'IAMM Solutions', address: 'abhijeet.pushingcode@gmail.com' });
  assert.equal(emails[0].body.replyTo, 'abhijeet.pushingcode@gmail.com');
  assert.match(emails[0].body.text, /Manual reporting/);
  assert.equal(emails[0].body.subject, 'New IAMM IT assessment');
  for (const [field, answer] of Object.entries(technologyAnswers)) {
    assert.equal(inserts[0].payload[field], answer);
    assert.ok(emails[0].body.text.includes(answer));
  }
});

test('rejects malformed, invalid, or oversized submissions without saving or sending', async () => {
  for (const body of ['{', [], {}, { ...valid, name: ' ' }, { ...valid, email: 'bad' }, { ...valid, website: 'javascript:alert(1)' }, { ...valid, challenges: 'a'.repeat(5001) }, { ...valid, security_needs: 'a'.repeat(5001) }, { ...valid, cloud_spend: 'a'.repeat(501) }, { ...valid, it_support_needs: ['invalid'] }]) {
    const result = await run(body);
    assert.equal(result.status, 400);
    assert.equal(result.inserts.length, 0);
    assert.equal(result.emails.length, 0);
  }
  assert.equal((await run('a'.repeat(50001))).status, 413);
});

test('missing configuration or failed database insert does not send email', async () => {
  for (const options of [{ noKey: true }, { databaseError: true }]) {
    const result = await run(valid, options);
    assert.equal(result.status, options.noKey ? 503 : 502);
    assert.equal(result.emails.length, 0);
  }
});

test('provider errors preserve saved assessments and report notification failure', async () => {
  for (const options of [{ emailError: true }, { networkError: true }]) {
    const result = await run(valid, options);
    assert.equal(result.status, 200);
    assert.deepEqual(result.result, { saved: true, notificationSent: false });
    assert.equal(result.inserts.length, 1);
  }
});

test('HTML notification escapes submitted markup and retains plain-text answers', async () => {
  const answer = '<script>alert("test")</script>\nReview backups & access';
  const { emails } = await run({ ...valid, security_needs: answer });
  assert.ok(!emails[0].body.html.includes('<script>'));
  assert.ok(emails[0].body.html.includes('&lt;script&gt;'));
  assert.ok(emails[0].body.html.includes('Review backups &amp; access'));
  assert.ok(emails[0].body.html.includes('<br>'));
  assert.ok(emails[0].body.text.includes(answer));
  assert.ok(emails[0].body.html.includes('Not provided'));
  assert.ok(emails[0].body.html.includes('https://iammllc.com/admin/assessment'));
});

const contact = { name: 'Test Lead', email: 'lead@example.com', company: 'Example', subject: 'Business plan quote', message: 'Please review our support needs.\n<script>test</script>' };

test('contact enquiries save before sending a branded notification from the correct Gmail account', async () => {
  const { status, result, inserts, emails } = await run({ ...contact, to: 'attacker@example.com', status: 'approved' }, { contact: true });
  assert.equal(status, 200);
  assert.equal(result.notificationSent, true);
  assert.equal(inserts[0].table, 'contact_submissions');
  assert.equal(inserts[0].payload.status, undefined);
  assert.equal(emails[0].body.to, 'info@iammllc.com');
  assert.equal(emails[0].body.from.address, 'abhijeet.pushingcode@gmail.com');
  assert.equal(emails[0].body.subject, 'New IAMM contact enquiry');
  assert.ok(emails[0].body.html.includes('Business plan quote'));
  assert.ok(emails[0].body.html.includes('&lt;script&gt;'));
  assert.ok(!emails[0].body.html.includes('<script>'));
  assert.ok(emails[0].body.html.includes('/admin/contact'));
  assert.ok(!emails[0].body.html.includes('New IT assessment'));
});

test('contact rejects invalid input and preserves saved messages when email fails', async () => {
  for (const body of ['{', [], {}, { ...contact, email: 'invalid' }, { ...contact, message: ' ' }, { ...contact, name: [] }, { ...contact, message: 'a'.repeat(5001) }]) {
    const result = await run(body, { contact: true });
    assert.equal(result.status, 400);
    assert.equal(result.inserts.length, 0);
    assert.equal(result.emails.length, 0);
  }
  assert.equal((await run('a'.repeat(20001), { contact: true })).status, 413);
  for (const options of [{ noKey: true }, { databaseError: true }]) {
    const result = await run(contact, { contact: true, ...options });
    assert.equal(result.status, options.noKey ? 503 : 502);
    assert.equal(result.emails.length, 0);
  }
  for (const options of [{ emailError: true }, { networkError: true }]) {
    const result = await run(contact, { contact: true, ...options });
    assert.deepEqual(result.result, { saved: true, notificationSent: false });
    assert.equal(result.inserts.length, 1);
  }
});
