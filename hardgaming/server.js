const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const mysql = require('mysql');
const crypto = require("crypto");
var geoip = require('geoip-lite');
const stripeAPI = require('./api/stripe-functions')
const stripe = require('stripe')
const webhook = require('./api/webhook/webhook-functions')
const sqlAPI = require('./api/mysql')
const ampAPI = require('./api/amp/amp-functions')
const instanceAPI = require('./middleware/instances')
const ws = require('ws')
const wsAPI = require("./api/websockets")

const config = require('./config/config.json');
const axios = require('axios');

const serverSettings = config.serverSettings;
const creds = config.credentials;
const dbConfig = config.database;
const Stripe = stripe(creds.stripe.secKey)

const connection = mysql.createConnection({
	host     : dbConfig.host,
	user     : dbConfig.username,
	password : dbConfig.password,
	database : dbConfig.db
});
const app = express();
const port = process.env.PORT || serverSettings.port;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
    secret: 'o3iyh8bgYJN7rhmLfs',
    resave: true,
	saveUninitialized: true 
}));

// app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, './node_modules/@fortawesome/fontawesome-free/css')));
app.use('/css', express.static(path.join(__dirname, './resources/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));
app.use('/fonts', express.static(path.join(__dirname, './resources/fonts')));
app.use('/webfonts', express.static(path.join(__dirname, './node_modules/@fortawesome/fontawesome-free/webfonts')));
app.use('/js', express.static(path.join(__dirname, './resources/js')));
app.use('/vendor', express.static(path.join(__dirname, './resources/vendor')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/api', express.static(path.join(__dirname, '/api/')));
app.use('/img', express.static(path.join(__dirname, './resources/img')));
app.use('/part', express.static(path.join(__dirname, './views/_partials')));
app.set('views', './views/_pages');
app.set('view engine', 'ejs');

function encryptPassword(pass) {
    const secret = "FAWCD0caijOe4fbOUkaSmfBKtl3efHCvbKHtF3TkPt98nyPlIESm5AcVwb5siyVxYYq8stSSEdaX7srhvn7yB4kNntIwactGmpcz";
    const md5Hasher = crypto.createHmac("md5", secret);

    const hashedPass = md5Hasher.update(pass).digest("hex");
    return hashedPass;
}


const nav = [
    { link: '/', title: 'Home', sub: 'HardGaming Home Page' },
    { link: '/#about', title: 'About Us', sub: 'About HardGaming' },
    { link: '/pricing', title: 'Pricing', sub: 'Pricing Packages' },
    { link: '/merch', title: 'Merchandise', sub: 'Merchandise Packages' }
];
const title = 'HardGaming'

let loggedIn = false;

// Basic Pages
app.get('/', async(req, res) => {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;
    visitAnalytics(req);
    const top6Games = await sqlAPI.getTopGames(6)
    res.render(
        'main/index-new',
        {
            nav,
            title,
            active: 'Home',
            status: req.session,
            user: req.session.user,
            top6Games
        }
    );
});

app.get('/about', (req, res) => {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;
    visitAnalytics(req);
    res.render(
        'main/about-new',
        {
            nav,
            title,
            active: 'About Us',
            status: req.session,
            user: req.session.user
        }
    );
});

app.get('/pricing', async(req, res) => {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;
    visitAnalytics(req);
    let games = await sqlAPI.getGames()
    if (games) {
        res.render(
            'main/pricing-new',
            {
                nav,
                title,
                active: '',
                header: 'Purchase',
                status: req.session,
                user: req.session.user,
                games
            }
        );
    }else{
        res.redirect('/');
    }
    
    
});

app.get('/merch', async(req, res) => {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;
    visitAnalytics(req);

    var config = {
        method: 'get',
        url: 'https://api.printful.com/store/products',
        headers: { 
          'Authorization': 'Basic aGR5YW1jdXUtOTBjbC1tZnZ0OmJvaXEtbXMycHZmMzMybWl4', 
          'Cookie': '__cf_bm=jwkr06ovNPaivj4jtXEOW6Co8o3foG1mpRpdidR_jFc-1657133709-0-AQM0Ky7MRPguSuyyP0zDbZMMI57PyOrmTLOnfpMAXr7SqxEfWy214QifrnFpkpj1S77mTVBdKVMh4vpskJ9VLJI='
        }
    };
      
    await axios(config)
    .then(function (response) {
        res.render(
            'main/merch',
            {
                nav,
                title,
                active: 'Merchandise',
                status: req.session,
                user: req.session.user, 
                products: response.data.result
            }
        );
    })
    .catch(function (error) {
    console.log(error);
    });

    
});

app.get('/merch/:id', async(req, res) => {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count += 1;
    visitAnalytics(req);

    let productId = req.params.id

    var config = {
        method: 'get',
        url: `https://api.printful.com/store/products/${productId}`,
        headers: { 
          'Authorization': 'Basic aGR5YW1jdXUtOTBjbC1tZnZ0OmJvaXEtbXMycHZmMzMybWl4', 
          'Cookie': '__cf_bm=jwkr06ovNPaivj4jtXEOW6Co8o3foG1mpRpdidR_jFc-1657133709-0-AQM0Ky7MRPguSuyyP0zDbZMMI57PyOrmTLOnfpMAXr7SqxEfWy214QifrnFpkpj1S77mTVBdKVMh4vpskJ9VLJI='
        }
    };
      
    await axios(config)
    .then(function (response) {
        
        res.render(
            'main/product-detail',
            {
                nav,
                title,
                active: 'Product Detail',
                status: req.session,
                user: req.session.user, 
                product: response.data.result
            }
        );
    })
    .catch(function (error) {
    console.log(error);
    });

    
});

// User Routes
app.get('/user/auth/login', (req, res) => {
    res.render(
        'auth/login',
        {
            nav,
            title,
            active: '',
            header: 'Login',
            status: req.session,
            user: req.session.user
        }
    );
});

app.get('/user/auth/register', (req, res) => {
    res.render(
        'auth/register',
        {
            nav,
            title,
            active: '',
            header: 'Register',
            status: req.session,
            user: req.session.user
        }
    );
});

app.get('/user/dashboard', async (req, res) => {
    if (req.session.user) {
        if (!req.session.count) {
            req.session.count = 0;
        }
        req.session.count += 1;
        visitAnalytics(req);
        let instanceData = await instanceAPI.getUserInstanceData(req.session.user.stripeID)
        let userInstances = await instanceAPI.updateUserInstances(req.session.user.stripeID)
        console.log(instanceData);
        console.log(userInstances);
        res.render(
            'user/dashboard-new',
            {
                nav,
                title,
                active: '',
                header: 'Profile',
                status: req.session,
                user: req.session.user,
                instances: userInstances,
                instanceData
            }
        );
    }else{
        res.redirect('/#login')
    }
});

app.get('/user/billing', (req, res) => {
    res.render(
        'user/billing',
        {
            nav,
            title,
            active: '',
            header: 'Billing',
            status: req.session,
            user: req.session.user
        }
    );
});

app.get('/user/settings', (req, res) => {
    res.render(
        'user/settings',
        {
            nav,
            title,
            active: '',
            header: 'Settings',
            status: req.session,
            user: req.session.user
        }
    );
});

// Auth Routes
app.post('/auth/login', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = encryptPassword(request.body.password);

	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Execute SQL query that'll select the account from the database based on the specified username and password
                connection.query('SELECT `username`, `email`, `first`, `last`, `stripe_id` FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                    // If there is an issue with the query, output the error
                    if (error) throw error;
                    // If the account exists
                    if (results.length > 0) {
                        // Authenticate the user
                        
                        request.session.loggedin = true;
                        request.session.user = results[0];
                        customer = stripeAPI.getCustomerByID(results[0].stripe_id)
                        request.session.user.stripeID = results[0].stripe_id
                        request.session.user.customer = customer
                        console.log(request.session.user.customer);
                        console.log(request.session.user);
                        // Redirect to home page
                        response.redirect('back');
                    } else {
                        response.send('Incorrect Username and/or Password!');
                    }			
                });
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		response.send('User Does not exist please <a href="/user/auth/register">Register</a> ');
	}
});

app.post('/auth/register', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = encryptPassword(request.body.password);
    let first = request.body.first;
    let last = request.body.last;
    let email = request.body.email;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE username = ?', [username], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				response.send('User Exists please <a href="/user/auth/login">Login</a> ');		
                console.log(results);
                response.end();
			} else {
                let customer = await stripeAPI.addNewCustomer(email, first, last)
                console.log(customer);
				connection.query('INSERT INTO users (username, email, password, first, last, stripe_id) VALUES (?, ?, ?, ?, ?, ?);',[username, email, password, first, last, customer.id], function(error, results, fields) {
                    
                    // If there is an issue with the query, output the error
                    if (error) throw error;
                    // Authenticate the user
                    connection.query('SELECT `username`, `email`, `first`, `last` FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                        request.session.loggedin = true;
                        request.session.user = results[0];
                        request.session.user.stripeID = customer.id 
                        request.session.user.customer = customer
                        response.redirect('back');
                    });
                    
                });
			}			
		});
	} else {
		
		response.end();
	}
});

app.get('/auth/logout', function(request, response){
    request.session.loggedin = false;
    request.session.username = '';
    // Redirect to home page
    response.redirect('back');
});

// Billing and Purchase Routes
app.get('/purchase/:id', async (req, res) => {
    if (req.session.user) {
        const game = await sqlAPI.getGame(req.params.id)
        if (game) {
            const paymentIntent = await stripeAPI.getPaymentIntent(game, req.session.user.stripeID)
           if (paymentIntent) {
            res.render(
                'billing/purchase-new',
                {
                    nav,
                    title,
                    active: '',
                    header: 'Purchase',
                    status: req.session,
                    user: req.session.user,
                    game,
                    secKey: paymentIntent.client_secret
                }
            );
           }else{
               console.log(paymentIntent);
               res.redirect('/pricing')
           } 
        }else{
            console.log(game);
            res.redirect('/pricing')
        }
    }else{
        res.redirect('/#login')
    }

    
});

// success page 
app.get('/success/:id/' , async (req ,res ) => {
    if (req.session.user) {
        if (req.query.payment_intent) {
            // console.log(req.query); 
            let game = await sqlAPI.getGame(req.params.id)
    
            res.render(
                'billing/success-new',
                {
                    nav,
                    title,
                    active: '',
                    header: 'Purchase Successful',
                    status: req.session,
                    user: req.session.user,
                    game,
                    paymentIntent: req.query.payment_intent
                }
            );
        }else{
            res.redirect('/pricing')
        }
    }else{
        res.redirect('/#login')
    }
    
    
   
})


app.get('/instance/manage/:instance_id', async(req,res)=>{
    const instanceID = req.params.instance_id
    const token = await ampAPI.ampToken()
    console.log(token);
    // const instanceMetricsws = new ws.WebSocket(`ws://api.hardgaming.tech:8080/stream/${token}`);
    if (req.session.user) {
        const game = await sqlAPI.getInstancebyID(instanceID)
        if (game) {
            let instanceData = await ampAPI.getInstanceDetails(instanceID)
            instanceData = instanceData.data
            let instanceMetrics = instanceData.Metrics
            console.log(instanceData);
           if (game.user_id === req.session.user.stripeID) {
            res.render(
                'instance/manage',
                {
                    nav,
                    title,
                    active: '',
                    header: 'Instance Management',
                    status: req.session,
                    user: req.session.user,
                    instance: game,
                    instanceData,
                    instanceMetrics,
                    // instanceMetricsws,
                    token
                }
            );
           }else{
               console.log('userID: ', req.session.user.stripeID);
               console.log('expected userID: ', game.user_id);
               res.redirect('/user/dashboard')
           } 
        }else{
            console.log('Failed to get Instance: ', req.params.instance_id);
            console.log('Instance: ', game);
            res.redirect('/user/dashboard')
        }
    }else{
        res.redirect('/#login')
    }
})

//Create Instance
app.post('/instance/create', async (req, res) => {
    console.log(req.body);
    let paymentStatus = await sqlAPI.getIntent(req.body.paymentIntent)
    console.log(paymentStatus)
    if (paymentStatus.status != 0) {
        let instance = await ampAPI.createInstanceScript(req.body.gameid, req.body.serverName, req.session.user.stripeID)
        console.log(instance);
        await sqlAPI.delIntent(req.body.paymentIntent)
        setTimeout(()=>{
            res.redirect('/user/dashboard')
        }, 30000);
    }else{
        res.redirect(`/err/${req.body.gameid}/paymentFailed`)
    }
    
})

//Start Instance
app.post('/instance/start', async (req, res) => {
    const instanceName = req.body.instanceName
    let startInstance = await ampAPI.startInstance(instanceName)
    setTimeout(()=>{
        res.redirect('/user/dashboard')
    }, 90000);
    
    
})

//Delete Instance
app.post('/instance/delete', async (req, res) => {
    const instanceID = req.body.instanceID
    const instanceName = req.body.instanceName

    let delInstance = await ampAPI.delInstance(instanceName)
    if (delInstance) {
        let delInstanceSQL = await sqlAPI.delInstancebyID(instanceID)
        setTimeout(()=>{
            res.redirect('/user/dashboard')
        }, 90000);
    }
    
})

//Restart Instance
app.post('/instance/restart', async (req, res) => {
    const instanceName = req.body.instanceName
    let restartInstance = await ampAPI.restartInstance(instanceName)
    setTimeout(()=>{
        res.redirect('/user/dashboard')
    }, 90000);
    
    
})

//Stop Instance
app.post('/instance/stop', async (req, res) => {
    const instanceName = req.body.instanceName
    let stopInstance = await ampAPI.stopInstance(instanceName)
    setTimeout(()=>{
        res.redirect('/user/dashboard')
    }, 90000);
    
})

// error page 
app.get('/err/:id/:err' , async (req , res) => {
    console.log(req.query); 
    let game = await sqlAPI.getGame(req.params.id)
    res.render(
        'billing/failure',
        {
            nav,
            title,
            active: '',
            header: 'Purchase Successful',
            status: req.session,
            user: req.session.user,
            game,
            err: req.params.err
        }
    );
})

var visitAnalytics = (req)=> {
    let ip = req.socket.remoteAddress.split(':')[3];
    let count = req.session.count;
    let geo = geoip.lookup(ip);
    let last_visit = new Date();
    console.log(geo);
    console.log(count);
    
    if (geo) {
        connection.query('SELECT * FROM visitor_data WHERE ip_address = ?', [ip], function(error, results, fields) {
            if (results.length > 0) {
                connection.query('UPDATE visitor_data SET count = ?, last_visit = ? WHERE ip_address = ?', [count, last_visit, ip], function(error, results, fields) {
                    if (error) throw error;
                    console.log("1 record updated");
                });
            }else{
                connection.query('INSERT INTO visitor_data(ip_address,count,country,last_visit) VALUES(?,?,?,?)', [ip, count, geo.country, last_visit], function(error, results, fields) {
                    if (error) throw error;
                    console.log("1 record inserted");
                });
            };
        });
    }
    

};


// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
});
  
app.post('/webhook', express.json({type: 'application/json'}), async (req, res) => {
    const event = req.body;
    
    response = await webhook.handleEvent(event);

    res.send(response);
  });


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});