const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// Model
const Student = mongoose.model('Student', studentSchema);

// CREATE
app.post('/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

// READ
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// UPDATE
app.put('/students/:id', async (req, res) => {
    const updated = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
});

// DELETE
app.delete('/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send("Student deleted");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});