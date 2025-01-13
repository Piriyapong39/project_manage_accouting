// dependecies
const express = require("express")
const Router = express.Router();

// middlewars
const authentication = require("../../middlewares/authentication")

// import handler
const sumaryHandler = require("./summary-handler")

Router.use("/get", authentication, sumaryHandler)


module.exports = Router