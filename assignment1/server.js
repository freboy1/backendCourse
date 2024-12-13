// Import required modules
const express = require('express'); // Express framework for creating the server
const bodyParser = require('body-parser'); // Middleware for parsing form data

// Initialize the app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static('public')); // Serve static files (like CSS) from the 'public' folder

// Route for the home page
app.get('/', (req, res) => {
    // Serve the index.html file when the user accesses the root URL
    res.sendFile(__dirname + '/views/index.html');
});
function isNumber(value) {
    return typeof value === 'number';
  }
// Route for handling the form submission
app.post('/calculate', (req, res) => {
    // Retrieve the 'name' field value from the submitted form
    const weight = req.body.weight;
    const height = req.body.height;
    let message;
    if (!isNumber(weight) && !isNumber(height)) {
        message = "You needed to enter numbers";
        message += "\n Your Brain is Underweight";
    } else {
        if (weight < 0 || height < 0) {
            message = "You needed to enter positive numbers";
            message += "\n Your Brain is Underweight";
        } else {
            if (height == 0) {
                message = "";
                message += "\n Your Brain is Underweight";
            }
        }
    }
    // Send a personalized greeting as the response
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your BMI Calculator</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Your Personalized BMI Calculator</h1>
            <p>Your BMI: ${message}</p>
            <a href="/">Go back</a> 
        </body>
        </html>
    `);
});

// Start the server
const PORT = 3000; // Define the port number
app.listen(PORT, () => {
    // Log a message when the server starts
    console.log(`Server is running on http://localhost:${PORT}`);
});
