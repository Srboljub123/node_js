const api = require('../stripe-functions')
const sqlAPI = require('../mysql')

async function handleEvent(event) {
    eventData = event.data.object
    console.log(event.type);

    switch (event.type) {
        // Payment Events
        case 'payment_intent.created':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                const insertIntoDB = await sqlAPI.addIntent(eventData, customer.id)
            }else{
                console.log(event);
            }
            
            break;
        case 'payment_intent.succeeded':
            console.log(eventData);
            updateIntent = await sqlAPI.updateIntent(eventData,2)

            break;
        case 'payment_intent.processing':
            updateIntent = await sqlAPI.updateIntent(eventData,1)
            break;
        case 'payment_intent.payment_failed':
            updateIntent = await sqlAPI.updateIntent(eventData,3)

            break;
            
        //Subscription Events
        case 'customer.subscription.created':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'customer.subscription.deleted':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'customer.subscription.trial_will_end':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'customer.subscription.updated':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        // Invoice Events
        case 'invoice.created':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.finalized':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.finalization_failed':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.paid':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.payment_action_required':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.payment_failed':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.upcoming':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        case 'invoice.updated':
            if (eventData.customer) {
                customer = await api.getCustomerByID(eventData.customer)
                console.log(customer);
            }else{
                console.log(event);
            }
            
            break;
        
        default:
            break;
    }
    

    return 200
}


module.exports = {
    handleEvent
}