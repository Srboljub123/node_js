const stripe = require('stripe')
const config = require('../config/config.json');

const STRIPE_SECRET_KEY = config.credentials.stripe.secKey;

const Stripe = stripe(STRIPE_SECRET_KEY)

const addProduct = async(name)=>{
    return new Promise(async(resolve) => {
        const product = await Stripe.products.create({
            name,
        });
        resolve(product)
      })
}

const addPrice = async(productID, unit_amount) =>{
    return new Promise(async(resolve) => {
        const price = await Stripe.prices.create({
            unit_amount,
            currency: 'usd',
            recurring: {interval: 'month'},
            product: productID,
          });
        resolve(price)
      })
}

module.exports = {
    addProduct,
    addPrice
}