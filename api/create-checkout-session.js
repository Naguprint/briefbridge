const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { category, priceAmount, successUrl, cancelUrl } = req.body;

    if (!category || !priceAmount || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Access to ${category} Briefs`,
              description: '30 days access to all briefs in this category',
            },
            unit_amount: priceAmount, // Amount in cents (2900 = 29 EUR)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        category,
      },
    });

    res.status(200).json({ 
      sessionUrl: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}