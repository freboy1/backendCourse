const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const path = require('path');

require('dotenv').config();
require('./config/passport'); // Добавили!

connectDB();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/notes', notesRoutes);
app.use(authRoutes);

app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    res.redirect('/notes');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

// Обновление пароля
app.post('/update-password', async (req, res) => {
    const user = await User.findById(req.user.id);
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.redirect('/profile');
});

// Загрузка аватара (понадобится Multer)
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    res.redirect('/profile');
});


app.get("/", (req, res) => {
    res.render("index");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
