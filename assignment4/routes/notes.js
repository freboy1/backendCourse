const express = require('express');
const Note = require('../models/Note');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Получение всех заметок пользователя
router.get('/', ensureAuthenticated, async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.render('dashboard', { user: req.user, notes });
});

// Создание новой заметки
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    await Note.create({ title, content, user: req.user.id });
    res.redirect('/dashboard');
});

// Удаление заметки
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
});

// Обновление заметки
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect('/dashboard');
});

module.exports = router;
