// /api/briefs.js
export default async function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const mailTo = process.env.MAIL_TO || 'info@naguprint.fi';

  // --- DB (Vercel Postgres) ---
  // Install: npm i @vercel/postgres
  const { sql } = await import('@vercel/postgres');

  // Ensure table exists
  await sql`CREATE TABLE IF NOT EXISTS briefs(
    id TEXT PRIMARY KEY,
    created_at BIGINT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    budget_min INT,
    budget_max INT,
    timeline TEXT,
    details TEXT,
    name TEXT,
    email TEXT
  );`;

  if (req.method === 'POST') {
    const { brief } = req.body || {};
    if (!brief || !brief.title || !brief.details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = crypto.randomUUID?.() || String(Date.now());
    const createdAt = Date.now();
    const created = { id, createdAt, ...brief };

    await sql`
      INSERT INTO briefs (id, created_at, title, category, budget_min, budget_max, timeline, details, name, email)
      VALUES (${id}, ${createdAt}, ${brief.title}, ${brief.category},
              ${brief.budgetMin ?? null}, ${brief.budgetMax ?? null},
              ${brief.timeline}, ${brief.details}, ${brief.name ?? null}, ${brief.email ?? null});
    `;

    // --- Email notify via Resend ---
    // Install: npm i resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: 'BriefBridge <noreply@briefbridge.dev>',
          to: [mailTo],
          subject: 'New brief posted',
          text: [
            `Title: ${brief.title}`,
            `Category: ${brief.category}`,
            `Budget: ${brief.budgetMin ?? '-'} - ${brief.budgetMax ?? '-'}`,
            `Timeline: ${brief.timeline}`,
            `Name: ${brief.name ?? '-'}`,
            `Email: ${brief.email ?? '-'}`,
            '',
            `${brief.details}`,
          ].join('\n')
        });
      } catch (e) {
        console.error('Email failed', e);
      }
    }

    return res.status(200).json({ created });
  }

  if (req.method === 'GET')) {
    const { rows } = await sql`SELECT * FROM briefs ORDER BY created_at DESC LIMIT 100;`;
    const briefs = rows.map(r => ({
      id: r.id,
      createdAt: Number(r.created_at),
      title: r.title,
      category: r.category,
      budgetMin: r.budget_min,
      budgetMax: r.budget_max,
      timeline: r.timeline,
      details: r.details,
      name: r.name,
      email: r.email
    }));
    return res.status(200).json({ briefs });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
