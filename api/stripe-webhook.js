// /api/stripe-webhook.js
export const config = { api: { bodyParser: false } }; // Stripe needs raw body
import { buffer } from 'micro';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

  let event;
  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const briefId = session.metadata?.briefId;
    if (briefId) {
      const { sql } = await import('@vercel/postgres');
      await sql`CREATE TABLE IF NOT EXISTS unlocks (brief_id TEXT PRIMARY KEY, unlocked_at BIGINT NOT NULL);`;
      await sql`INSERT INTO unlocks (brief_id, unlocked_at) VALUES (${briefId}, ${Date.now()})
                ON CONFLICT (brief_id) DO NOTHING;`;
    }
  }

  res.json({ received: true });
}
