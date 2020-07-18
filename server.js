var express = require("express");
var path = require("path");
var fs = require("fs");
const { json } = require("express");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//App starts listening
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
  });

app.get("/api/notes", function (req, res) {
  let notes = fs.readFileSync("db/db.json");
  res.send(JSON.parse(notes));
});

app.post("/api/notes", function (req, res) {
  let notes = fs.readFileSync("db/db.json");
  let noteArray = JSON.parse(notes);
  let newNote = req.body;

  let idKey = "id";
  newNote[idKey] = noteArray.length + 1;

  noteArray.push(newNote);
  fs.writeFileSync("db/db.json", JSON.stringify(noteArray));

  notes = fs.readFileSync("db/db.json");
  res.send(JSON.parse(notes));
});

app.delete("/api/notes/:id", function (req, res) {
  let notes = fs.readFileSync("db/db.json");
  let noteArray = JSON.parse(notes);
  let idToDelete = req.params.id;
  console.log(idToDelete);

  let noteToDelete = noteArray.findIndex(obj => obj.id === parseInt(idToDelete));
  console.log(noteToDelete);

  noteArray.splice(noteToDelete, 1);
  fs.writeFileSync("db/db.json", JSON.stringify(noteArray));

  notes = fs.readFileSync("db/db.json");
  res.send(JSON.parse(notes));
});

// Gets notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// If no matching route is found default to home
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});




