const stripe = require('stripe')
const config = require('../config/config.json');
const sqlAPI = require('./mysql')

const STRIPE_SECRET_KEY = config.credentials.stripe.secKey;

const Stripe = stripe(STRIPE_SECRET_KEY)

const addNewCustomer = async (email, first, last) => {
  try {
    const customer = await Stripe.customers.create({
      email,
      name: first +' '+ last,
      description: 'New Customer'
    })
    console.log(customer);
    return customer
  } catch (error) {
    console.log(error);
  }
}

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id)
  return customer
}

const createCheckoutSession = async (customer, price) => {
  const session = await Stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer,
    line_items: [
      {
        price,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: 14
    },

    success_url: `http://localhost:3098/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3098/failed` 
  })

  return session
}

const STRIPE_WEBHOOK_SECRET = config.credentials.stripe.whKey;

// ..
const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    STRIPE_WEBHOOK_SECRET
  )
  return event
}



const getPaymentIntent = async (product, customer) => {
  const cost = product.price
  const customerID = customer
  console.log(cost);
  try {
    return new Promise(async (resolve) => {
      const paymentMethods = await Stripe.paymentMethods.list({
        customer: customerID,
        type: 'card',
      });

      console.log(paymentMethods);
      const paymentIntent = await Stripe.paymentIntents.create({
        amount: cost,
        setup_future_usage: 'off_session',
        currency: 'usd',
        customer: customerID,
        payment_method_types: ['card'],
      });
    
      
      
      resolve(paymentIntent)
    })
  
  } catch (error) {
    return false
  }
 
}
module.exports = {
  addNewCustomer,
	getCustomerByID,
  createCheckoutSession,
  createWebhook,
  getPaymentIntent,
}