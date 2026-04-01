const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("student_notes");
    console.log("MongoDB Connected");
}
connectDB();


// ADD NOTE
app.post("/notes", async (req, res) => {

    const note = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        created_date: new Date().toISOString().split("T")[0]
    };

    const result = await db.collection("notes").insertOne(note);

    res.send(result);
});


// VIEW NOTES
app.get("/notes", async (req, res) => {

    const notes = await db.collection("notes").find().toArray();

    res.json(notes);
});


// UPDATE NOTE
app.put("/notes/:id", async (req, res) => {

    const id = req.params.id;

    const result = await db.collection("notes").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );

    res.send(result);
});


// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {

    const id = req.params.id;

    const result = await db.collection("notes").deleteOne({
        _id: new ObjectId(id)
    });

    res.send(result);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});