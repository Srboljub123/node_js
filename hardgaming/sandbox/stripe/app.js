const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const config = require('./config.json');

/* Server Side -- Stripe API calls */
const stripe = require('stripe');

const app = express();
const port = 3000;
const router = express.Router();


const STRIPE_API = require('../../api/stripe-functions.js');


/* Set up Express to serve HTML files using "res.render" with help of Nunjucks */
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use(express.static(__dirname));
app.use('/styles', express.static('styles'));
app.use(bodyParser());
app.use('/', router);


/* Place all routes here */
router.get('/customerView', (req, res) => {
    STRIPE_API.getAllProductsAndPlans().then(products => {
      products = products.filter(product => {
        return product.plans.length > 0;
      });
  
      res.render('customerView.html', {products: products});
    });
  });


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_YABX10qWQfxEDGn7lWuMqlEP17Od8mNG";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  console.log(request.headers['stripe-signature']);
  const sig = request.headers['stripe-signature'];
  console.log(request.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig , endpointSecret);
  } catch (err) {
    console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


/* Start listening on specified port */
app.listen(port, () => {
console.info('Example app listening on port', port)
});