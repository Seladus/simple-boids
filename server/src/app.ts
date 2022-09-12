import path from "path";

var express = require("express");
var app = express();

//setting middleware
app.use(express.static(path.join(__dirname, "/../../client/src/public/js"))); //Serves resources from public folder
app.use(express.static(path.join(__dirname, "/../../client/public/html"))); //Serves resources from public folder

console.log(path.join(__dirname, "/../../client/public/src/js"));
console.log(__dirname + "/../client/public/html");

// sendFile will go here
app.get("/", function (req: any, res: any) {
  res.sendFile(
    path.join(__dirname, "/../../client/src/public/html/index.html")
  );
});

var server = app.listen(80);
