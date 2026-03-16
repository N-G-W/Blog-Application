import express from "express";
import multer from "multer";
import {writeFile,stat,mkdir} from "node:fs";
import { Buffer } from "node:buffer";
import path from "path";

// const upload = multer({ dest: 'user-uploads/' })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './user-uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      console.log("This is the dir that is being not created", "./" + uniqueSuffix + "/");
      mkdir("./user-uploads/"+ uniqueSuffix + "/", (e) => {
        if (e) {
            console.log("wwtff");
            throw e
        };
    });
    cb(null, uniqueSuffix + "/" + uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage })

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

var imagePathArrays = [];
var articleContent = [];

function articleFactory(id='',title = '', subtitle = '', content = '', imagePaths = '') {
    return {
        articleID: id,
        title: title,
        subtitle: subtitle,
        content: content,
        paths: imagePaths,
    }
}

app.post("/publish-blog", upload.single('file'), (req, res) => {

    imagePathArrays = [];

    console.log(req.file, req.body);
    if (req.file !== undefined) {
        if (typeof (fileInformation) === "array") {
            fileInformation.forEach(element => {
                imagePathArrays.push(URL.createObjectURL(element));
            });
        }
        else {
            imagePathArrays.push(req.body['file']);
        }
    }
    articleContent.push(articleFactory(
        Math.floor(Math.random()*1e9),
        req.body['title'],
        req.body['subtitle'],
        req.body['content'],
        req.file['path'],
    ))
    
    writeFile("./pseudo-persistance/text-db.txt", JSON.stringify(articleContent), 'utf8', (err) => {
        if (err) {
            console.log(err);
            throw err;
        };
        console.log("File has been saved successfully!");
    })
    console.log(articleContent);
    res.redirect("read-blog");
})

app.listen(port, () => {
    console.log(`Running the server on port : ${port}`);
})