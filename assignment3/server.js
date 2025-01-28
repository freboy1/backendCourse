const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const path = require('path');

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Assignment3')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });




// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema);

// Read Users
app.get('/users', async (req, res) => {
  try {
    const { sortField = 'name', sortOrder = 'asc', search = '' } = req.query;

    // Sort option
    const sortOption = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    // Search query (case-insensitive)
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Fetch users with sorting and search
    const users = await User.find(query).sort(sortOption);

    res.render('index', {
      users,
      sortField,
      sortOrder,
      search
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});


app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        newUser.id = Date.now().toString();
        await newUser.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});



// Update a User
app.get('/user/edit/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findOne({ id });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render('useredit', { user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  


app.post('/user/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;
        await User.findOneAndUpdate({id}, { name, email, age });
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error updating user');
    }
});
// Delete a User
app.post('/user/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findOneAndDelete({id});
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});
// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
