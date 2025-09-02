// /api/briefs.js — Node/CJS, robust: använder Postgres om tillgängligt, annars in-memory
let MEMORY_STORE = []; // fallback-lagring under functionens liv

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const hasDB = !!process.env.DATABASE_URL;
  const mailTo = process.env.MAIL_TO || 'info@naguprint.fi';

  async function getBody() {
    if (req.body && typeof req.body === 'object') return req.body;
    return await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (c) => (data += c));
      req.on('end', () => {
        try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
      });
      req.on('error', reject);
    });
  }

  async function makeId() {
    try {
      if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
      const c = await import('crypto');
      return c.randomUUID ? c.randomUUID() : String(Date.now());
    } catch {
      return String(Date.now());
    }
  }

  async function ensureTable(sql) {
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
      const body = await getBody();
      const brief = body?.brief;
      if (!brief?.title || !brief?.details) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing required fields' }));
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
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ created: { id, createdAt, ...brief } }));
        } catch (dbErr) {
          console.error('DB error, falling back to memory:', dbErr);
          // fortsätt till in-memory nedan
        }
      }

      // In-memory fallback
      const created = { id, createdAt, ...brief };
      MEMORY_STORE.unshift(created);
      MEMORY_STORE = MEMORY_STORE.slice(0, 200);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ created }));
    } catch (e) {
      console.error('POST /api/briefs crashed:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Server error' }));
    }
  }

  if (req.method === 'GET') {
    try {
      if (hasDB) {
        const { sql } = await import('@vercel/postgres');
        await ensureTable(sql);
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
          email: r.email,
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ briefs }));
      }
      // In-memory
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ briefs: [...MEMORY_STORE] }));
    } catch (e) {
      console.error('GET /api/briefs crashed:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Server error' }));
    }
  }

  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
