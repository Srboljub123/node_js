// This is your test secret API key.
const stripe = require('stripe')('sk_test_51L0RiTL69G5Dmp90stORUj4GsvUV43Zhgr9QZszETM8mju4XYVJPZ95jbinwb6MWR8atLWVy7EE50n6zu9oJKHMK00TRN3Ni8w');
const express = require('express');
const app = express();

app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(3098, () => console.log('Running on port 3098'));