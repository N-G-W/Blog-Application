import express from "express";
import multer from "multer";
import {writeFile,readFileSync, mkdir} from "node:fs";
import { Buffer } from "node:buffer";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

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

var imagePathArrays = [];
var articleContent = [];

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("user-uploads"));

function readArticleData(req,res,next) {
    try {
        articleContent = [];
        const data = readFileSync("./pseudo-persistance/text-db.txt", "utf8");
        let obj = JSON.parse(data);
        console.log("this is the obj",obj)
        articleContent.push(obj);
        next();
    } catch {
        console.log("OOpsies!");
        next();
    }
}

app.use(readArticleData);

app.get("/", (req, res) => {
    res.locals.articleContent = articleContent;
    res.render("index.ejs");
})

app.get("/write-blog", (req, res) => {
    res.render("writing.ejs");
})

function checkArticleID(id) {
    for (const article of articleContent[0]) {
            if (article['articleID'] == id) {
                return [[article]];
            }
        }
    return -1;
}
app.get("/read-blog", (req, res) => {
    let paramID = req.query.id;
    console.log("this is the paramid", paramID);
    console.log(articleContent);
    let maybeArticle = checkArticleID(paramID);
    if (maybeArticle!==-1) {
        res.locals.articleContent = maybeArticle;
        console.log(maybeArticle);
        res.render("reading.ejs");
    }
    else {
        res.send("<h1>There doesn't seem to be an article of this ID</h1>") ;
    }
    
})


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
    articleContent.push(articleFactory(
        Math.floor(Math.random() * 1e9),
        req.body['title'],
        req.body['subtitle'],
        req.body['content'],
        // req.file['path'],
        path.normalize(path.relative("user-uploads", req.file['path'])),
    ))
    
    writeFile("./pseudo-persistance/text-db.txt", JSON.stringify(articleContent), 'utf8', (err) => {
        if (err) {
            console.log(err);
            throw err;
        };
        console.log("File has been saved successfully!");
    })
    // console.log(articleContent);
    res.redirect("read-blog");
})

app.listen(port, () => {
    console.log(`Running the server on port : ${port}`);
})