// /api/briefs.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    // Allow CORS for local dev
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    console.log('API called, method:', req.method);
    console.log('Environment check:', {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasResendKey: !!process.env.RESEND_API_KEY
    });

    const sql = neon(process.env.POSTGRES_URL);
    const mailTo = process.env.MAIL_TO || 'info@naguprint.fi';

    // Test database connection first
    console.log('Testing database connection...');

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

    console.log('Table created/verified successfully');

    if (req.method === 'POST') {
      const { brief } = req.body || {};
      if (!brief || !brief.title || !brief.details) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
      const createdAt = Date.now();
      const created = { id, createdAt, ...brief };

      await sql`
        INSERT INTO briefs (id, created_at, title, category, budget_min, budget_max, timeline, details, name, email)
        VALUES (${id}, ${createdAt}, ${brief.title}, ${brief.category},
                ${brief.budgetMin ?? null}, ${brief.budgetMax ?? null},
                ${brief.timeline}, ${brief.details}, ${brief.name ?? null}, ${brief.email ?? null});
      `;

      // --- Email notify via Resend ---
      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
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

    if (req.method === 'GET') {
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

  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}