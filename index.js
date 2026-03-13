import express from "express";

var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("reading.ejs");
})

app.listen(port, () => {
    console.log(`Running the server on port : ${port}`);
})