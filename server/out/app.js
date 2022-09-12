"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
var express = require("express");
var app = express();
//setting middleware
app.use(express.static(path_1.default.join(__dirname, "/../../client/src/public/js"))); //Serves resources from public folder
app.use(express.static(path_1.default.join(__dirname, "/../../client/public/html"))); //Serves resources from public folder
console.log(path_1.default.join(__dirname, "/../../client/public/src/js"));
console.log(__dirname + "/../client/public/html");
// sendFile will go here
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "/../../client/src/public/html/index.html"));
});
var server = app.listen(80);
