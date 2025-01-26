const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/practiceTask4', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema);
// Routes
// Create a User
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});

// Read Users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
});


// Update a User
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;
        await User.findByIdAndUpdate(id, { name, email, age });
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send('Error updating user');
    }
});
// Delete a User
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.send('User deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});
// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
