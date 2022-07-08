// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_a37e901e5260034e02ad332f0421f90aa2da36f35a97436521098b8880f3ec99";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    let customer;
    let subscription;
    let invoice;
    let product;
  
    // Handle the event
    switch (event.type) {
      case 'customer.created':
        customer = event.data.object;
        // Then define and call a function to handle the event customer.created
        break;
      case 'customer.deleted':
        customer = event.data.object;
        // Then define and call a function to handle the event customer.deleted
        break;
      case 'customer.updated':
        customer = event.data.object;
        // Then define and call a function to handle the event customer.updated
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        console.log(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      case 'customer.subscription.pending_update_applied':
        subscription = event.data.object;
        // Then define and call a function to handle the event customer.subscription.pending_update_applied
        break;
      case 'customer.subscription.pending_update_expired':
        subscription = event.data.object;
        // Then define and call a function to handle the event customer.subscription.pending_update_expired
        break;
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        // Then define and call a function to handle the event customer.subscription.trial_will_end
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        // Then define and call a function to handle the event customer.subscription.updated
        break;
  
      case 'invoice.created':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.created
        break;
      case 'invoice.paid':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.paid
        break;
      case 'invoice.payment_action_required':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.payment_action_required
        break;
      case 'invoice.payment_failed':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.payment_failed
        break;
      case 'invoice.payment_succeeded':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.payment_succeeded
        break;
      case 'invoice.sent':
        invoice = event.data.object;
        // Then define and call a function to handle the event invoice.sent
        break;
      case 'invoice.upcoming':
      invoice = event.data.object;
      // Then define and call a function to handle the event invoice.upcoming
        break;
      case 'product.created':
        product = event.data.object;
        // Then define and call a function to handle the event product.created
        break;
      case 'product.deleted':
        product = event.data.object;
        // Then define and call a function to handle the event product.deleted
        break;
      case 'product.updated':
        product = event.data.object;
        // Then define and call a function to handle the event product.updated
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
  });