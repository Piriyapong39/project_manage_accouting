// dependencies
const express = require("express")
const Router = express.Router();

// import summary instance
const summary = require("./summary-controller")


Router.get("/accounting-data/:page", async(req, res) => {
    try {
        return res.status(200).json({data: await summary.getAccountingData(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

Router.get("/transaction-data/:page", async(req, res) => {
    try {
        return res.status(200).json({data: await summary.getTransactionData(req)})
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

module.exports = Router

