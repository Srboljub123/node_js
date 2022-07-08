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
var paypal = require('paypal-rest-sdk');
var requestIp = require('request-ip');
const multer = require('multer');
const stripeAPI = require('./api/stripe-functions')
const mysqlAPI = require('./middleware/mysql')


const config = require('./config/config.json');

const serverSettings = config.serverSettings;
const creds = config.credentials;
const dbConfig = config.database;

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
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/img', express.static(path.join(__dirname, './resources/images')));
app.use('/img', express.static(path.join(__dirname, './img')));
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
    { link: '/about', title: 'About Us', sub: 'About HardGaming' },
    { link: '/pricing', title: 'Pricing', sub: 'Pricing Packages' }
];
const title = 'HardGaming Admin'

// Basic Pages
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM visitor_data', function(error, results, fields) {
            if (error) throw error;
            
            if (results.length > 0) {
                res.render(
                    'main/index',
                    {
                        nav,
                        title,
                        active: 'Home',
                        status: req.session,
                        user: req.session.user,
                        data: results
                    }
                );
            }else{
               console.log(results);
            };
        });
        
    }else{
        res.redirect('/user/auth/login')
    }
});

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

// Services
app.get('/services/add', (req, res) => {
    if (req.session.loggedin) {
        res.render(
            'services/add',
            {
                nav,
                title,
                active: 'Home',
                status: req.session,
                user: req.session.user,
            }
        );
        
    }else{
        res.redirect('/error/401')
    }
});

app.get('/services/manage', (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM games', function(error, results, fields) {
            if (error) throw error;
            
            if (results.length > 0) {
                res.render(
                    'services/manage',
                    {
                        nav,
                        title,
                        active: 'Home',
                        status: req.session,
                        user: req.session.user,
                        data: results
                    }
                );
            }else{
               console.log(results);
            };
        });
        
    }else{
        res.redirect('/user/auth/login')
    }
});


// Metrics
app.get('/metrics/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render(
            'metrics/dashboard',
            {
                nav,
                title,
                active: 'Metrics',
                status: req.session,
                user: req.session.user,
            }
        );
    }else{
        res.redirect('/user/auth/login')
    }
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
                connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                    // If there is an issue with the query, output the error
                    if (error) throw error;
                    // If the account exists
                    if (results.length > 0) {
                       if (results[0].perm_level > 0) {
                            // Authenticate the user
                            request.session.loggedin = true;
                            request.session.user = results[0];
                            console.log(request.session.user);
                            // Redirect to home page
                            response.redirect('/');
                       }else{
                        response.redirect('/error/401');
                       }
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

app.get('/auth/logout', function(request, response){
    request.session.loggedin = false;
    request.session.username = '';
    // Redirect to home page
    response.redirect('/');
});		

app.get('/error/401', function(req, res){
    res.render(
        'error/401',
        {
            nav,
            title,
            active: 'Home',
        }
    );
});

app.get('/error/500', function(req, res){
    res.render(
        'error/500',
        {
            nav,
            title,
            active: 'Home',
        }
    );
});

app.get('*',function(req, res){
    res.render(
        'error/404',
        {
            nav,
            title,
            active: 'Home',
        }
    );
});

let analytics = () =>{
    connection.query('SELECT * FROM visitor_data', function(error, results, fields) {
        if (error) throw error;
        
        if (results.length > 0) {
        }else{
           console.log(results);
        };
    });
};

const handleError = (err, res) => {
    console.log(err);
    res
      .status(500)
      .redirect('/error/500')
  };
  
const upload = multer({
    dest: "./"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
  
  
app.post(
    "/addService",
    upload.single("gameIcon" /* name attribute of <file> element in your form */),
    async (req, res) => {
        console.log(req.file);
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./img/",req.file.originalname);
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
        });
        let gameImg = path.join('/img/games/',req.file.originalname);
        let avail;
        if (req.body.avail == "true") {
            avail = true;
        }else{
            avail = false;
        }

        console.log(req.body);

        try {
            const product = await stripeAPI.addProduct(req.body.gameName)
            const price = await stripeAPI.addPrice(product.id, req.body.price)
            const addService = await mysqlAPI.addService(req.body.gameName, req.body.shortdesc, req.body.users, req.body.price, avail, price.id, gameImg)

            res.redirect('/services/manage')
        } catch (error) {
            console.log(error);
            alert("Failed to add Service");
        }
        
        

        


      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png or .jpg files are allowed!");
        });
      }
    }
  );

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});