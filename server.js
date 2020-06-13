//TO ENSURE LOGIN AUTHENTICATED
const { ensureAuthenticated } = require('./config/auth');

const express = require('express');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

//PASSPORT config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;
// console.log(db);
// stripe-keys config
const stripePublicKey = require('./config/keys').STRIPE_PUBLIC_KEY;
const stripeSecretKey = require('./config/keys').STRIPE_SECRET_KEY;
// console.log(stripeSecretKey, stripePublicKey);

//Connect to MongoDB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected...'))
	.catch((err) => console.log(err));

//EJS
// app.use(expressLayouts);
app.set('view engine', 'ejs');

//PUBLIC FOLDER
app.use(express.static('public'));

//BODY PARSER
app.use(express.json()); // body-parser
app.use(express.urlencoded({ extended: false }));

//STRIPE config
const stripe = require('stripe')(stripeSecretKey);

//EXPRESS SESSION
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());

//GLOBAL VARIABLES
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//ROUTES-for login credientials
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));
// app.use("/pages", require("./routes/pages"));

//=============GET=======================================================================================================//
app.get('/store', ensureAuthenticated, (req, res) => {
	fs.readFile('items.json', (error, data) => {
		if (error) {
			res.status(500).end();
		} else {
			res.render('store.ejs', {
				items: JSON.parse(data),
				stripePublicKey: stripePublicKey
			});
		}
	});
});

app.get('/home', ensureAuthenticated, (req, res) => {
	res.render('home.ejs');
});

app.get('/about', ensureAuthenticated, (req, res) => {
	res.render('about'); //this set default view engine of a page to ejs
});

//=============POST=======================================================================================================//
app.post('/purchase', (req, res) => {
	fs.readFile('items.json', (error, data) => {
		if (error) {
			res.status(500).end();
		} else {
			// console.log("purchase");
			const itemsJson = JSON.parse(data);
			const itemsArray = itemsJson.music.concat(itemsJson.merch);
			let total = 0;
			req.body.items.forEach((item) => {
				const itemsJson = itemsArray.find((i) => {
					return i.id == item.id;
				});
				total = total + itemsJson.price * item.quantity; //I changed to itemJson.quantity from item.quantity
			});
			console.log(req.body);
			stripe.charges
				.create({
					amount: total,
					source: req.body.stripeTokenId,
					currency: 'usd'
				})
				.then(() => {
					console.log('Transaction Successful');
					res.json({ message: 'Purchase Successful' });
				})
				.catch(() => {
					console.log('Transaction-failed');
					res.status(500).end();
				});
		}
	});
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
