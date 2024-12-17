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
// Helper function to validate numbers
function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// Route for handling the form submission
app.post('/calculate', (req, res) => {
    const weight = parseFloat(req.body.weight.replace(',', '.'));
    const height = parseFloat(req.body.height.replace(',', '.'));
    const age = parseInt(req.body.age);
    let gender = 1; // Gender factor

    if (req.body.gender === "Female") {
        gender = 0.9;
    }

    let bmiValue, bmiMessage, diagnos;

    if (!isNumber(weight) || !isNumber(height) || !isNumber(age)) {
        bmiMessage = "You needed to enter valid numbers";
        diagnos = "Your Brain is Underweight";
    } else if (weight <= 0 || height <= 0 || age <= 0) {
        bmiMessage = "You needed to enter positive numbers";
        diagnos = "Your Brain is Underweight";
    } else if (age < 18) {
        bmiMessage = "Age must be >= 18";
        diagnos = "Cannot decide";
    } else {
        bmiValue = (weight / (height * height)) * gender;

        // Adjust BMI based on age
        let ageFactor = 1.0;
        if (age >= 25 && age <= 34) {
            ageFactor = 0.98;
        } else if (age <= 44) {
            ageFactor = 0.96;
        } else if (age <= 54) {
            ageFactor = 0.94;
        } else if (age > 54) {
            ageFactor = 0.92;
        }
        bmiValue *= ageFactor;

        // Determine BMI category
        if (bmiValue < 18.5) {
            bmiMessage = "Underweight";
            diagnos = "Eat more";
        } else if (bmiValue <= 24.9) {
            bmiMessage = "Normal weight";
            diagnos = "Everything is okay, bro!";
        } else if (bmiValue <= 29.9) {
            bmiMessage = "Overweight";
            diagnos = "Eat less";
        } else {
            bmiMessage = "Obesity";
            diagnos = "Do not eat anymore";
        }
    }

    // Respond with the result
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
            <p>Your BMI: ${bmiValue}</p>
            <p>Your BMI Category: ${bmiMessage}</p>
            <p>Your Diagnosis: ${diagnos}</p>
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
