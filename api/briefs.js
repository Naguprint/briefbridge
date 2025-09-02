// /api/briefs.js — robust version: använder Postgres om den finns, annars in-memory fallback
let MEMORY_STORE = []; // fallback-lagring i serverless-processen

export default async function handler(req, res) {
  // CORS för dev/preview
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const hasDB = !!process.env.DATABASE_URL;
  const mailTo = process.env.MAIL_TO || 'info@naguprint.fi';

  // Hjälp-funktion för id
  async function makeId() {
    try {
      if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
      const { randomUUID } = await import('crypto');
      return randomUUID ? randomUUID() : String(Date.now());
    } catch {
      return String(Date.now());
    }
  }

  async function ensureTable(sql) {
    // Skapa tabell om den inte finns
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
  }

  if (req.method === 'POST') {
    try {
      const { brief } = req.body || {};
      if (!brief?.title || !brief?.details) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const id = await makeId();
      const createdAt = Date.now();

      if (hasDB) {
        try {
          const { sql } = await import('@vercel/postgres');
          await ensureTable(sql);
          await sql`
            INSERT INTO briefs (id, created_at, title, category, budget_min, budget_max, timeline, details, name, email)
            VALUES (${id}, ${createdAt}, ${brief.title}, ${brief.category},
                    ${brief.budgetMin ?? null}, ${brief.budgetMax ?? null},
                    ${brief.timeline}, ${brief.details}, ${brief.name ?? null}, ${brief.email ?? null});
          `;
          // E-postnotis (om RESEND finns)
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
                  `Category: ${brief.category || '-'}`,
                  `Budget: ${brief.budgetMin ?? '-'} - ${brief.budgetMax ?? '-'}`,
                  `Timeline: ${brief.timeline || '-'}`,
                  `Name: ${brief.name || '-'}`,
                  `Email: ${brief.email || '-'}`,
                  '',
                  `${brief.details}`,
                ].join('\n'),
              });
            } catch (e) {
              console.error('Email failed', e);
            }
          }
          return r
