const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/* GET signup page */
router.get('/sign-up', (req, res, next) => res.render('sign-up'));

/* POST home page */ 
router.post('/', (req, res, next) => {
    const {username, passwordHash} = req.body;
    User.create({username, passwordHash})
        .then((user) => {console.log("new user!", user); res.render('index')});
});

module.exports = router;
