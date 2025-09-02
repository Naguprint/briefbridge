// /api/create-checkout-session.js
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Method not allowed' })); }

  const key = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  try {
    const body = await new Promise((resolve, reject) => {
      let data = ''; req.on('data', c => data += c);
      req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
      req.on('error', reject);
    });
    const successUrl = body?.successUrl || `${(typeof window !== 'undefined' ? window.location.origin : 'https://example.com')}/?checkout=success`;
    const cancelUrl  = body?.cancelUrl  || `${(typeof window !== 'undefined' ? window.location.origin : 'https://example.com')}/?checkout=cancel`;

    if (!key || !priceId) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Stripe not configured' }));
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ url: session.url }));
  } catch (e) {
    console.error('create-checkout-session error', e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }
};
