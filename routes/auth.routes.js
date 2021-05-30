const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const isUserLoggedIn = require('../middleware/login');
const router = new Router();

const saltRounds = 10;

/* GET signup page */
router.get('/signup', (req, res, next) => res.render('auth/signup'));

/* POST signup page */ 
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    User.find({username})
        .then((dbUser) => {
            if (dbUser) {
                res.render('auth/signup', { errorMessage: 'This username is already taken. Please provide a different one.' });
            } else {
                bcryptjs
                .genSalt(saltRounds)
                .then(salt => bcryptjs.hash(password, salt))
                .then(hashedPassword => {
                    return User.create({username, 'passwordHash': hashedPassword})
                })
                .then((user) => {
                    res.redirect('/login');
                })
                .catch(err => next(err));
            }
        })    
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.render('auth/login', { errorMessage: 'All fields are mandatory. Please provide valid username and password.' });
        return;
    }
    
    User.findOne({username})
        .then((userFromDB)=> {
            if (userFromDB) {
                if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                    req.session.currentUser = userFromDB;
                    res.render('users/users', {userFromDB, logIn: true});
                } else {
                    res.render('auth/login', {errorMessage: 'Username and password do not match.'});
                }

            } else {
                res.render('auth/login', {errorMessage: 'No users found with the provided username.'});
            }
        })
        .catch(err => next(err))
})

router.get('/userProfile', (req, res) => res.render('users/users', {user: req.session.currentUser, logIn: true}));

router.get('/main', isUserLoggedIn, (req, res) => res.render('users/main', {logIn: true}));

router.get('/private', isUserLoggedIn, (req, res, next) => res.render('users/private', {logIn: true}));

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;