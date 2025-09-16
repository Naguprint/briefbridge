module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test basic response with GET
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Checkout endpoint is working',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      keyStart: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : 'not set'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Just return a simple response for now, no Stripe
    return res.status(200).json({ 
      message: 'POST received - Stripe temporarily disabled for testing',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      receivedBody: req.body
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Basic error in handler',
      message: error.message
    });
  }
}