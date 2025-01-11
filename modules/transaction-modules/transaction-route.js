// dependencies
const express = require("express")
const Router = express.Router()

// import transaction hanler
const transactionHandler = require("./transaction-handler")


// import middlewares
const authentication = require("../../middlewares/authentication")

Router.use("/manage", authentication, transactionHandler)

module.exports = Router
