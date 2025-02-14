const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Страница логина
router.get('/login', (req, res) => {
    res.render('login');
});

// Обработка логина
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

// Страница регистрации
router.get('/register', (req, res) => {
    res.render('register');
});

// Обработка регистрации
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/register');
    }
});

// Выход
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
