// dependencies
const express = require("express")
const Router = express.Router();

// import handler
const accountingHandler = require("./account-handler")

// import middlewares
const authentication = require("../../middlewares/authentication")

// use route
Router.use("/manage-accounting", authentication, accountingHandler)




module.exports = Router