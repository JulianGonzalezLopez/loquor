//REQUIRES
const express = require("express");
const path = require("path");
//CONSTANTS
const router = express.Router();
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "../..");



module.exports = router;