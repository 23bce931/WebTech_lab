// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample in-memory data
let users = [
    { id: 1, name: "Vineetha" },
    { id: 2, name: "John" }
];

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET single user (Route Parameter)
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.send("User not found");
    res.json(user);
});

// POST - Add new user
app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.json(newUser);
});

// PUT - Update user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.send("User not found");

    user.name = req.body.name;
    res.json(user);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.send("User deleted");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});