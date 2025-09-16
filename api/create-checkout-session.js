// Use CommonJS for Vercel Functions
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
    // Check if Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return res.status(500).json({ 
        error: 'Stripe configuration error',
        details: 'Missing API key'
      });
    }

    // Import Stripe - using require inside the function to handle potential issues
    let Stripe;
    try {
      Stripe = require('stripe');
    } catch (importError) {
      console.error('Failed to import Stripe:', importError);
      return res.status(500).json({ 
        error: 'Failed to load payment processor',
        details: importError.message
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get parameters from request body
    const { category, priceAmount, successUrl, cancelUrl } = req.body;

    // Validate required parameters
    if (!category || !priceAmount || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['category', 'priceAmount', 'successUrl', 'cancelUrl'],
        received: { category, priceAmount, successUrl, cancelUrl }
      });
    }

    console.log('Creating checkout session for:', { category, priceAmount });

    // Create Stripe checkout session
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

    console.log('Checkout session created:', session.id);

    return res.status(200).json({ 
      sessionUrl: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    
    // Check for specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        error: 'Stripe authentication failed',
        details: 'Invalid API key'
      });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid request to Stripe',
        details: error.message
      });
    }
    
    // Generic error response
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message || 'Unknown error',
      type: error.type || 'Unknown'
    });
  }
}