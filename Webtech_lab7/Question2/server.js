const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "bookstore";

let db;

client.connect().then(() => {
    console.log("MongoDB Connected");
    db = client.db(dbName);
});

// Search Books by Title
app.get("/books/search", async (req, res) => {
    const title = req.query.title;
    const books = await db.collection("books")
        .find({ title: { $regex: title, $options: "i" } })
        .toArray();
    res.json(books);
});

// Filter Books by Category
app.get("/books/category/:category", async (req, res) => {
    const category = req.params.category;
    const books = await db.collection("books")
        .find({ category: category })
        .toArray();
    res.json(books);
});

// Sort by Price
app.get("/books/sort/price", async (req, res) => {
    const books = await db.collection("books")
        .find()
        .sort({ price: 1 })
        .toArray();
    res.json(books);
});

// Sort by Rating
app.get("/books/sort/rating", async (req, res) => {
    const books = await db.collection("books")
        .find()
        .sort({ rating: -1 })
        .toArray();
    res.json(books);
});

// Top Rated Books
app.get("/books/top", async (req, res) => {
    const books = await db.collection("books")
        .find({ rating: { $gte: 4 } })
        .limit(5)
        .toArray();
    res.json(books);
});

// Pagination
app.get("/books", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const books = await db.collection("books")
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

    res.json(books);
});

app.use(express.static("public"));

app.listen(3001, () => {
    console.log("Server running on port 3001");
});