// dependencies
const express = require("express")
const Router = express.Router()

const userRoute = require("./user-handler")
Router.use("/manage", userRoute)

module.exports = Router

