const express = require('express');
const app = express();

// Global Middleware
app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}, Time: ${new Date()}`);
    next(); // move to next middleware
});

// Middleware Layer 2
app.use((req, res, next) => {
    console.log("Second middleware executed");
    next();
});

// Route-level Middleware
const checkAuth = (req, res, next) => {
    console.log("Auth middleware");
    next();
};

// Route using middleware
app.get('/secure', checkAuth, (req, res) => {
    res.send("Secure Route Accessed");
});

// Normal route
app.get('/', (req, res) => {
    res.send("Home Page");
});

// Start server
app.listen(3000, () => {
    console.log("Middleware server running on port 3000");
});
