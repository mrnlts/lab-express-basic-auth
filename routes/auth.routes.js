const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

/* GET signup page */
router.get('/signup', (req, res, next) => res.render('auth/signup'));

/* POST signup page */ 
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({username, 'passwordHash': hashedPassword})
        })
        .then((user) => {
            console.log("new user!", user); 
            res.redirect('/login');
        })
        .catch(err => next(err));
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.render('auth/login', { errorMessage: 'All fields are mandatory. Please provide valid username and password.' });
        return;
    }
    console.log("CURRENT SESSION ======> ", req.session);
    User.findOne({username})
        .then((userFromDB)=> {
            if (userFromDB) {
                if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                    let currentUser = req.session.currentUser;
                    currentUser = userFromDB;
                    res.render('users/users');
                } else {
                    console.log('wrong password');
                    res.render('auth/login', {errorMessage: 'Username and password do not match.'});
                }

            } else {
                res.render('auth/login', {errorMessage: 'No users found with the provided username.'});
            }
        })
        .catch(err => next(err))
})

router.get('/userProfile', (req, res, next) => res.render('users/users', {user: req.session.currentUser}));

module.exports = router;