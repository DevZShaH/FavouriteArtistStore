const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => {
	res.render('loginSignup');
});

//Register page
router.get('/register', (req, res) => {
	res.render('loginSignup');
});

//loginRegister page
router.get('/loginSignup', (req, res) => {
	res.render('loginSignup');
});

//Register Handle
router.post('/register', (req, res) => {
	// console.log(req.body);
	// res.send("hello");
	const { name, email, password, password2 } = req.body;
	let errors = [];

	//Check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: `Please fill in all fields.` });
	}
	//Check passwords matches or not with confirm password
	if (password !== password2) {
		errors.push({ msg: `Passwords do not match.` });
	}
	//Check Password Length
	if (password.length < 6) {
		errors.push({ msg: `Password should be at least 6 characters.` });
	}

	//If there is no any errors, then
	if (errors.length > 0) {
		res.render('loginSignup', {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		// res.send("pass");
		//VALIDATION PASSED
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//User exists
				errors.push({ msg: `Email already exists.` });
				res.render('loginSignup', {
					errors,
					name,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					name,
					email,
					password
				});
				// console.log(newUser);
				// res.send("hello");
				//HASH PASSWORD - BCRYPT
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hashed) => {
						if (err) throw err;
						//SET Password to Hashed
						newUser.password = hashed;
						//SAVE USER TO DB
						newUser
							.save()
							.then((user) => {
								req.flash('success_msg', 'You are now registered and can login.');
								res.redirect('/users/loginSignup');
							})
							.catch((err) => console.log(err));
					})
				);
			}
		});
	}
});

//LOGIN HANDLE
router.post('/loginSignup', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/home', //if we don't use / here before store, then it will redirest to /users/store which leads to error
		failureRedirect: '/users/loginSignup',
		failureFlash: true
	})(req, res, next);
});

//LOGOUT HANDLE
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out.');
	res.redirect('/users/loginSignup');
});

module.exports = router;
