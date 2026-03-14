import express from "express";

var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/write-blog", (req, res) => {
    res.render("writing.ejs");
})

app.get("/read-blog", (req, res) => {
    res.render("reading.ejs");
})

app.post("/publish-blog", (req, res) => {
    // console.log(req);
    let fileInformation = req.body['file'];
    console.log(fileInformation);
    res.redirect("read-blog");
})

app.listen(port, () => {
    console.log(`Running the server on port : ${port}`);
})